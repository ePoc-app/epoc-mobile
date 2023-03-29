import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, from, Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Epoc, EpocLibrary, EpocMetadata} from 'src/app/classes/epoc';
import {FileService} from './file.service';
import {Capacitor} from '@capacitor/core';
import {Filesystem,Directory, Encoding} from '@capacitor/filesystem';
import {SettingsStoreService} from './settings-store.service';
import {ReadingStoreService} from './reading-store.service';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {File, FileEntry, FileWriter} from '@ionic-native/file/ngx';
import {AppService} from './app.service';
import {TranslateService} from '@ngx-translate/core';
import {getPromise} from '@ionic-native/core';

@Injectable({
    providedIn: 'root'
})
export class LocalEpocsService {
    private _localEpocs : EpocLibrary[];
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
        private ngZone: NgZone,
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
        this.imports = {...this.imports, [id]: this.translate.instant('LIBRARY_PAGE.IMPORT')};
        const download = this.fileService.download(url, `local-epocs/${id}.zip`);
        download.subscribe(() => {}, () => {
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
        this.imports = {...this.imports, [id]: this.translate.instant('LIBRARY_PAGE.IMPORT')};
        this.file.writeFile(this.file.dataDirectory, `local-epocs/${id}.zip`, '', {replace: true}).then((fileEntry: FileEntry) => {
            fileEntry.createWriter((fileWriter) => {
                this.writeFileInChunks(fileWriter, file, (progress) => {
                    this.ngZone.run(() => {
                        const p = Math.round(progress.written / progress.total * 100);
                        this.imports[id] = `${this.translate.instant('LIBRARY_PAGE.IMPORT')} (${p}%)`
                    });
                }).then(() => {
                    this.ngZone.run(() => {
                        this.unzipLocalEpoc(id);
                    })
                });
            });
        }).catch(() => {
            this.toast(this.translate.instant('FLOATING_MENU.ERROR'), 'danger');
            delete this.imports[id];
            this.imports = {...this.imports};
        });
    }

    private writeFileInChunks(writer: FileWriter, file: Blob, progressCb?) {
        const BLOCK_SIZE = 1024 * 1024;
        let writtenSize = 0;

        function writeNextChunk() {
            const size = Math.min(BLOCK_SIZE, file.size - writtenSize);
            const chunk = file.slice(writtenSize, writtenSize + size);
            writtenSize += size;
            writer.write(chunk);
            progressCb({
                written: writtenSize,
                total: file.size
            });
        }

        return getPromise<any>((resolve, reject) => {
            writer.onerror = reject as (event: ProgressEvent) => void;
            writer.onwrite = () => {
                if (writtenSize < file.size) {
                    writeNextChunk();
                } else {
                    resolve();
                }
            };
            writeNextChunk();
        });
    }

    unzipLocalEpoc(id: string): Observable<number> {
        const unzip = this.fileService.unzip(`local-epocs/${id}.zip`, `local-epocs/${id}`);
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
        const rm = this.fileService.deleteFolder(dir);
        this.fetchLocalEpocs();
        return rm;
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
