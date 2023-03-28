import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, from, Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Epoc, EpocLibrary, EpocMetadata} from 'src/app/classes/epoc';
import {FileService} from './file.service';
import {Capacitor} from '@capacitor/core';
import {Filesystem,Directory, Encoding} from '@capacitor/filesystem';
import {SettingsStoreService} from './settings-store.service';
import {ReadingStoreService} from './reading-store.service';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {File} from '@ionic-native/file/ngx';
import {AppService} from './app.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LocalEpocsService {
    private _localEpocs : EpocLibrary[];
    private localEpocsSubject$ = new ReplaySubject<EpocLibrary[]>(1);
    localEpocs$ = this.localEpocsSubject$.asObservable()

    constructor(
        private http: HttpClient,
        private fileService: FileService,
        private file: File,
        private settingsStore: SettingsStoreService,
        private readingStore: ReadingStoreService,
        public actionSheetController: ActionSheetController,
        private router: Router,
        public alertController: AlertController,
        public appService: AppService,
        public translate: TranslateService
    ) {}

    get localEpocs(): EpocLibrary[] {
        return this._localEpocs;
    }

    set localEpocs(value: EpocLibrary[]) {
        this._localEpocs = value;
        this.localEpocsSubject$.next(value);
    }

    async fetchLocalEpocs() {
        try{
            // create zips directory if not exists
            await this.file.createDir(this.file.dataDirectory, 'local-epocs', false);
        } catch {}

        this.localEpocs = [];


        console.log(await this.file.listDir(this.file.dataDirectory, 'local-epocs'));

        forkJoin((await this.file.listDir(this.file.dataDirectory, 'local-epocs'))
        .filter(file => file.isDirectory)
        .map(file => {
            return this.readEpocContent('local-epocs', file.name)
        })).subscribe(epocs => {
            this.localEpocs = epocs.map(localEpoc => {
                return {
                    ...(localEpoc.epoc as EpocMetadata),
                    downloading: false,
                    downloaded: true,
                    unzipping: false,
                    opened: false,
                    updateAvailable: false,
                    lastModified: new Date().toISOString(),
                    lang: '',
                    translation: '',
                    rootFolder: Capacitor.convertFileSrc(`${this.file.dataDirectory}/${localEpoc.rootFolder}/`),
                    dir: localEpoc.rootFolder
                }
            })
        })
    }

    readEpocContent(dir, epocId): Observable<{epoc: Epoc, rootFolder: string}> {
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
            return from(Filesystem.readFile({
                path: `../Library/NoCloud/${dir}/${epocId}/content.json`,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            })).pipe(map(file => {
                const epoc = (JSON.parse(file.data) as Epoc);
                epoc.id = epocId;
                return {
                    epoc,
                    rootFolder: `${dir}/${epocId}`
                }
            }));
        } else {
            const url = Capacitor.convertFileSrc(`${this.file.dataDirectory ? this.file.dataDirectory : 'assets/demo/'}${dir}/${epocId}/content.json`)
            return this.http.get<Epoc>(url).pipe(map(epoc => {
                epoc.id = epocId;
                return {
                    epoc,
                    rootFolder: `${dir}/${epocId}`
                }
            }));
        }
    }

    simpleHash(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = hash * 31 + char;
        }
        return hash.toString(36).substring(0, 6).toUpperCase();
    }

    downloadLocalEpoc(url: string): Observable<number> {
        const id = this.simpleHash(url);
        const download = this.fileService.download(url, `local-epocs/${id}.zip`);
        this._localEpocs.push({
            assessmentsCount: 0,
            authors: undefined,
            chaptersCount: 0,
            download: '',
            downloaded: false,
            downloading: true,
            edition: '',
            image: '',
            lang: '',
            lastModif: '',
            lastModified: '',
            objectives: [],
            opened: false,
            summary: '',
            title: 'Import en cours',
            translation: undefined,
            unzipping: false,
            updateAvailable: false,
            id
        });
        this.localEpocs = this._localEpocs;
        download.subscribe((progress) => {}, () => {
            this.fetchLocalEpocs();
        }, () => {
            this.unzipLocalEpoc(id);
        });
        return download;
    }

    unzipLocalEpoc(id: string): Observable<number> {
        const epoc = this._localEpocs.find(e => e.id === id);
        epoc.downloading = false;
        epoc.unzipping = true;
        this.localEpocs = this._localEpocs;

        const unzip = this.fileService.unzip(`local-epocs/${id}.zip`, `local-epocs/${id}`);
        unzip.subscribe((progress) => {}, () => {
            this.fileService.deleteZip(`local-epocs/${id}.zip`);
            this.fetchLocalEpocs();
        }, () => {
            this.fileService.deleteZip(`local-epocs/${id}.zip`);
            this.fetchLocalEpocs();
        });
        return unzip;
    }

    deleteEpoc(dir: string): Observable<any> {
        const rm = this.fileService.deleteFolder(dir);
        this.fetchLocalEpocs();
        return rm;
    }

    async localEpocLibraryMenu(epoc){
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
                        console.log(epoc);
                        this.deleteEpoc(epoc.dir);
                    }
                }
            ]
        });

        await alert.present();
    }
}
