import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, from, lastValueFrom, Observable, of, ReplaySubject} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Epoc, EpocLibrary, EpocMetadata} from 'src/app/classes/epoc';
import {FileService} from './file.service';
import {Capacitor} from '@capacitor/core';
import {Filesystem,Directory, Encoding} from '@capacitor/filesystem';
import {SettingsStoreService} from './settings-store.service';
import {ReadingStoreService} from './reading-store.service';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {AppService} from './app.service';
import {TranslateService} from '@ngx-translate/core';
import {MatomoTracker} from '@ngx-matomo/tracker';

@Injectable({
    providedIn: 'root'
})
export class LocalEpocsService {
    private _localEpocs : EpocLibrary[] = [];
    private localEpocsSubject$ = new ReplaySubject<EpocLibrary[]>(1);
    localEpocs$ = this.localEpocsSubject$.asObservable()
    imports : { [key: string]: string } = {};

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
        public translate: TranslateService,
        public toastController: ToastController,
        private readonly tracker: MatomoTracker
    ) {}

    get localEpocs(): EpocLibrary[] {
        return this._localEpocs;
    }

    set localEpocs(value: EpocLibrary[]) {
        this._localEpocs = value;
        this.localEpocsSubject$.next(value);
    }

    async fetchLocalEpocs() {
        if (!Capacitor.isNativePlatform()) return;
        try{
            // create zips directory if not exists
            await this.file.createDir(this.file.dataDirectory, 'local-epocs', false);
        } catch {}

        forkJoin((await this.fileService.listDirMetadata('local-epocs'))
        .filter(file => file.isDirectory)
        .sort((fileA, fileB) => {
            return new Date(fileA.metadata.modificationTime) > new Date(fileB.metadata.modificationTime) ? 1 : -1;
        })
        .map(file => {
            return this.readEpocContent('local-epocs', file.name)
        })).subscribe(epocs => {
            this.localEpocs = epocs.reduce((localEpocs : EpocLibrary[], localEpoc) => {
                if (!localEpoc.epoc || !localEpoc.rootFolder) return localEpocs;
                localEpocs.push({
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
                    dir: localEpoc.rootFolder,
                    chaptersCount: Object.keys(localEpoc.epoc.chapters).length,
                    assessmentsCount: Object.values(localEpoc.epoc.contents).reduce(
                        (count, content) => {
                            count = content.type === 'assessment' ? count + 1 : count;
                            return count;
                        },
                        0
                    )
                })
                return localEpocs;
            }, [])
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
            }), catchError(() => of({
                epoc: null,
                rootFolder: null
            })));
        } else {
            const url = Capacitor.convertFileSrc(`${this.file.dataDirectory ? this.file.dataDirectory : 'assets/demo/'}${dir}/${epocId}/content.json`)
            return this.http.get<Epoc>(url).pipe(map(epoc => {
                epoc.id = epocId;
                return {
                    epoc,
                    rootFolder: `${dir}/${epocId}`
                }
            }), catchError(() => of({
                epoc: null,
                rootFolder: null
            })));
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

    async downloadLocalEpoc(url: string): Promise<void> {
        if (!url.startsWith('https')) {
            this.toast(this.translate.instant('FLOATING_MENU.ERROR_SSL'), 'danger');
            return;
        }
        // const id = this.simpleHash(url); broken with some urls
        const id = (Math.random() + 1).toString(36).substring(3);
        this.download(url, id);
    }

    download(url, id): Observable<number> {
        this.imports = {...this.imports, [id]: this.translate.instant('LIBRARY_PAGE.DOWNLOADING')};
        const download = this.fileService.download(url, `local-epocs/${id}.zip`);
        this.tracker.trackEvent('Local ePocs', 'Import from URL', url);
        download.subscribe(() => {
        }, () => {
            this.toast(this.translate.instant('FLOATING_MENU.ERROR'), 'danger');
            delete this.imports[id];
            this.imports = {...this.imports};
        }, () => {
            this.unzipLocalEpoc(id);
        });
        return download;
    }


    importFile(file) {
        const id = this.simpleHash(file.name);
        this.imports = {...this.imports, [id]: `${this.translate.instant('LIBRARY_PAGE.IMPORT')} ${file.name}`};

        this.tracker.trackEvent('Local ePocs', 'Import from file', file.name);

        this.file.writeFile(this.file.dataDirectory, `local-epocs/${id}.zip`, file, {replace: true}).then(() => {
            this.unzipLocalEpoc(id);
        }).catch(() => {
            this.toast(this.translate.instant('FLOATING_MENU.ERROR'), 'danger');
            delete this.imports[id];
            this.imports = {...this.imports};
        });
    }

    unzipLocalEpoc(id: string): Observable<number> {
        const unzip = this.fileService.unzip(`local-epocs/${id}.zip`, `local-epocs/${id}`);
        this.imports[id] = this.translate.instant('LIBRARY_PAGE.OPEN_ZIP');
        unzip.subscribe(() => {}, () => {
            delete this.imports[id];
            this.imports = {...this.imports};
            this.toast(this.translate.instant('FLOATING_MENU.ERROR'), 'secondary');
            this.fileService.deleteZip(`local-epocs/${id}.zip`);
        }, () => {
            delete this.imports[id];
            this.imports = {...this.imports};
            this.fetchLocalEpocs();
            this.fileService.deleteZip(`local-epocs/${id}.zip`);
        });
        return unzip;
    }

    deleteEpoc(dir: string): Observable<any> {
        const delete$ = this.fileService.deleteFolder(dir);
        delete$.subscribe(async () => {
            await this.fetchLocalEpocs();
        });
        return delete$;
    }

    async toast(message, color?) {
        const toast = await this.toastController.create({
            message,
            color,
            position: 'top',
            duration: 2000
        });
        await toast.present();
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
                        this.deleteEpoc(epoc.dir);
                    }
                }
            ]
        });

        await alert.present();
    }
}
