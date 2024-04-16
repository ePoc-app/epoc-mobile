import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, from, Observable, ReplaySubject, timer} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';
import {Epoc, EpocLibrary, EpocMetadata} from 'src/app/classes/epoc';
import {FileService} from './file.service';
import {environment as env} from 'src/environments/environment';
import {mode} from 'src/environments/environment.mode';
import {Capacitor} from '@capacitor/core';
import { Filesystem,Directory, Encoding } from '@capacitor/filesystem';
import {SettingsStoreService} from './settings-store.service';
import {ReadingStoreService} from './reading-store.service';
import {Reading} from '../classes/reading';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {MatomoTracker} from '@ngx-matomo/tracker';
import {AppService} from './app.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    private _library : EpocLibrary[];
    private librarySubject$ = new ReplaySubject<EpocLibrary[]>(1);
    library$ = this.librarySubject$.asObservable()

    private _epocProgresses : {[EpocId: string] : number} = {};
    private epocProgressesSubject$ = new ReplaySubject<{[EpocId: string] : number}>(1);
    epocProgresses$ = this.epocProgressesSubject$.asObservable();
    private libraryUrl = env.mode[mode].libraryUrl;
    private cachedLibrary: EpocLibrary[] = JSON.parse(localStorage.getItem('library')) || [];

    private readings: Reading[];

    constructor(
        private http: HttpClient,
        private fileService: FileService,
        private file: File,
        private settingsStore: SettingsStoreService,
        private readingStore: ReadingStoreService,
        public actionSheetController: ActionSheetController,
        private router: Router,
        public alertController: AlertController,
        private readonly tracker: MatomoTracker,
        public appService: AppService,
        public translate: TranslateService
    ) {
        this.settingsStore.settings$.subscribe(settings => {
            if (!settings) return;
            this.libraryUrl = env.mode[mode][settings.libraryMode];
            this.fetchLibrary();
        });
        this.readingStore.readings$.subscribe(readings => this.readings = readings)
    }

    get library(): EpocLibrary[] {
        return this._library;
    }

    set library(value: EpocLibrary[]) {
        this._library = value;
        this.librarySubject$.next(value);
    }

    updateEpocLibraryState(epocId, {
        downloading = false,
        unzipping = false,
        downloaded = false,
        opened,
        updateAvailable = false
    }:{
        downloading?: boolean,
        unzipping?: boolean,
        downloaded?: boolean,
        opened?: boolean,
        updateAvailable?: boolean
    }){
        const epocIndex = this._library.findIndex(item => item.id === epocId);
        if (epocIndex === -1) return;
        const epoc = this._library[epocIndex];
        epoc.downloading = downloading;
        epoc.downloaded = downloaded;
        epoc.unzipping = unzipping;
        epoc.opened = typeof opened !== 'undefined' ? opened:epoc.opened;
        epoc.updateAvailable = updateAvailable
        this._library[epocIndex] = epoc;
        this.librarySubject$.next(this._library);
    }

    addEpocProgress(epocId) {
        this.updateEpocProgress(epocId, 0);
    }

    updateEpocProgress(epocId, progress) {
        this._epocProgresses[epocId] = progress;
        this.epocProgressesSubject$.next(this._epocProgresses);
    }

    fetchLibrary(): void {
        this.http.get<EpocLibrary[]>(this.libraryUrl).pipe(filter(data => {
            if (!Array.isArray(data) || !data[0].id) return false; // cache only if valid
            localStorage.setItem('library', JSON.stringify(data)) // cache using localStorage
            return true;
        })).pipe(startWith(this.cachedLibrary)).subscribe((data: EpocLibrary[]) => this.library = data.map(item => {
            item.downloading = false;
            item.downloaded = false;
            item.unzipping = false;
            item.opened = false;
            return item;
        }), (e) => console.warn('Error fetching library', e), () => {
            this.library.forEach(epoc => {
                this.readEpocContent(epoc.id).subscribe((localEpoc) => {
                    const downloadDate = localEpoc.lastModif ? new Date(localEpoc.lastModif.replace(/-/g, '/')) : new Date();
                    const updateAvailable = new Date(epoc.lastModified) > downloadDate;
                    this.updateEpocLibraryState(epoc.id, {downloaded: true, updateAvailable});
                })
            })

            if (this.readings) {
                this.library.forEach(epoc => {
                    this.updateEpocLibraryState(
                        epoc.id,
                        {
                            downloaded: epoc.downloaded,
                            opened: this.readings.findIndex(reading => reading.epocId === epoc.id) !== -1
                        }
                    );
                })
            }
        }); // return data starting with previous cached request
    }

    readEpocContent(epocId): Observable<Epoc> {
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
            return from(Filesystem.readFile({
                path: `../Library/NoCloud/epocs/${epocId}/content.json`,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            })).pipe(map(file => JSON.parse(file.data)));
        } else {
            const rootDirectory = Capacitor.isNativePlatform() && this.file.dataDirectory ? this.file.dataDirectory : 'assets/demo/';
            const url = Capacitor.convertFileSrc(`${rootDirectory}epocs/${epocId}/content.json`)
            return this.http.get<Epoc>(url)
        }
    }

    downloadEpoc(epoc: EpocMetadata): Observable<number> {
        const download = this.fileService.download(epoc.download, `epocs/${epoc.id}.zip`);
        this.updateEpocLibraryState(epoc.id, {downloading: true});
        this.addEpocProgress(epoc.id);
        download.subscribe((progress) => {
            this.updateEpocProgress(epoc.id, progress);
        }, () => {
            this.updateEpocLibraryState(epoc.id, {});
        }, () => {
            this.unzipEpoc(epoc);
        });
        this.tracker.trackEvent('Library', 'Download', `Download ${epoc.id}`);
        return download;
    }

    unzipEpoc(epoc: EpocMetadata): Observable<number> {
        const unzip = this.fileService.unzip(`epocs/${epoc.id}.zip`, `epocs/${epoc.id}`);
        this.updateEpocLibraryState(epoc.id, {unzipping: true});
        this.addEpocProgress(epoc.id);
        unzip.subscribe((progress) => {
            this.updateEpocProgress(epoc.id, progress);
        }, () => {
            this.updateEpocLibraryState(epoc.id, {});
        }, () => {
            this.updateEpocLibraryState(epoc.id, {downloaded: true});
            this.fileService.deleteZip(`epocs/${epoc.id}.zip`);
        });
        return unzip;
    }

    deleteEpoc(epoc: EpocMetadata): Observable<any> {
        this.tracker.trackEvent('Library', 'Delete', `Delete ${epoc.id}`);
        const rm = this.fileService.deleteFolder(`epocs/${epoc.id}`);
        rm.subscribe(() => {}, () => {}, () => { this.updateEpocLibraryState(epoc.id, {}); });
        return rm;
    }

    deleteAll(): Observable<any> {
        this.tracker.trackEvent('Library', 'Delete', `Delete all`);
        const deletions$ = [];
        this.library.forEach(item => {
            if(!item.downloaded) return;
            deletions$.push(this.deleteEpoc(item));
        })
        return forkJoin([timer(100), ...deletions$]);
    }

    async epocLibraryMenu(epoc){
        const buttons = [
            {
                text: this.translate.instant('FLOATING_MENU.TOC'),
                icon: 'list-circle-outline',
                handler: () => {
                    this.router.navigateByUrl('/epoc/toc/' + epoc.id);
                }
            },
            {
                text: this.translate.instant('FLOATING_MENU.CERTIFICATE'),
                icon: 'star-outline',
                handler: () => {
                    this.router.navigateByUrl('/epoc/score/' + epoc.id);
                }
            },
            {
                text: this.translate.instant('FLOATING_MENU.LICENSE'),
                icon: 'receipt-outline',
                handler: () => {
                    this.appService.displayLicence(epoc)
                }
            },
            ...(epoc.updateAvailable ? [{
                text: this.translate.instant('FLOATING_MENU.UPDATE'),
                icon: 'cloud-download-outline',
                handler: () => {
                    this.deleteEpoc(epoc).subscribe(() => this.downloadEpoc(epoc))
                }
            }] : []),
            ...(epoc.opened ? [{
                text: this.translate.instant('FLOATING_MENU.RESET'),
                icon: 'refresh-outline',
                handler: () => {
                    this.confirmReset(epoc)
                }
            }] : []),
            {
                text: this.translate.instant('FLOATING_MENU.DELETE'),
                icon: 'trash',
                handler: () => {
                    this.confirmDelete(epoc)
                }
            },
            {
                text: 'Fermer',
                role: 'cancel'
            }
        ];
        const actionSheet = await this.actionSheetController.create({
            header: epoc.title,
            cssClass: 'custom-action-sheet',
            mode: 'ios',
            buttons
        });
        await actionSheet.present();
    }

    async confirmReset(epoc) {
        const alert = await this.alertController.create({
            header: 'Confirmation',
            message: `Attention la réinitialisation de l'ePoc <b>"${epoc.title}"</b> supprimera toute votre progression`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        this.readingStore.removeReading(epoc.id);
                        this.updateEpocLibraryState(epoc.id,{
                            downloaded: epoc.downloaded,
                            opened: false
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    async confirmDelete(epoc) {
        const alert = await this.alertController.create({
            header: 'Confirmation',
            message: `Merci de confimer la suppresion de l'ePoc <b>"${epoc.title}"</b>`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        this.deleteEpoc(epoc);
                    }
                }
            ]
        });

        await alert.present();
    }
}
