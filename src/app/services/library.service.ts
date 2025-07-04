import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, forkJoin, from, mergeMap, Observable, ReplaySubject, throwError, timer} from 'rxjs';
import {catchError, filter, map, startWith} from 'rxjs/operators';
import {Epoc, EpocCollection, EpocMetadata, EpocLibraryState} from 'src/app/classes/epoc';
import {FileService} from './file.service';
import {environment as env} from 'src/environments/environment';
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
import {Settings} from 'src/app/classes/settings';
import {uid} from '@epoc/epoc-types/src/v1';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    settings: Settings;
    private officialCollectionsUrl = env.officialCollectionsUrl;

    private _officialCollections : Record<uid, EpocCollection> = {};
    private officialCollectionsSubject$ = new ReplaySubject<Record<uid, EpocCollection>>(1);
    officialCollections$: Observable<Record<uid, EpocCollection>> = this.officialCollectionsSubject$.asObservable();

    private _customCollections : Record<uid, EpocCollection> = {};
    private customCollectionsSubject$ = new ReplaySubject<Record<uid, EpocCollection>>(1);
    customCollections$: Observable<Record<uid, EpocCollection>> = this.customCollectionsSubject$.asObservable();

    private _epocProgresses : {[EpocId: string] : number} = {};
    private epocProgressesSubject$ = new ReplaySubject<{[EpocId: string] : number}>(1);
    epocProgresses$ = this.epocProgressesSubject$.asObservable();

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
        this.fetchOfficialCollections();

        this.settingsStore.settings$.subscribe(settings => {
            if (!settings) return;
            this.settings = settings;
            this.fetchCustomCollections();
        });
        this.readingStore.readings$.subscribe(readings => this.readings = readings)
    }

    get officialCollections(): Record<uid, EpocCollection> {
        return this._officialCollections;
    }

    set officialCollections(value: Record<uid, EpocCollection>) {
        this._officialCollections = value;
        this.officialCollectionsSubject$.next(value);
    }

    get customCollections(): Record<uid, EpocCollection> {
        return this._customCollections;
    }

    set customCollections(value: Record<uid, EpocCollection>) {
        this._customCollections = value;
        this.customCollectionsSubject$.next(value);
    }

    updateEpocCollectionState(epocId, {
        downloading = false,
        unzipping = false,
        downloaded = false,
        opened,
        updateAvailable = false
    }:EpocLibraryState, collectionId: string, custom? : boolean) {
        const collectionToUpdate = custom ? this._customCollections : this._officialCollections;
        const collectionToUpdateSubject$ = custom ? this.customCollectionsSubject$ : this.officialCollectionsSubject$;
        const epoc = collectionToUpdate[collectionId]?.ePocs[epocId];
        if (!epoc) {
            console.warn(`ePoc with id ${epocId} not found in collection ${collectionId}`);
            return;
        }
        epoc.downloading = downloading;
        epoc.downloaded = downloaded;
        epoc.unzipping = unzipping;
        epoc.opened = typeof opened !== 'undefined' ? opened:epoc.opened;
        epoc.updateAvailable = updateAvailable;
        collectionToUpdateSubject$.next(collectionToUpdate);
    }

    addEpocProgress(epocId) {
        this.updateEpocProgress(epocId, 0);
    }

    updateEpocProgress(epocId, progress) {
        this._epocProgresses[epocId] = progress;
        this.epocProgressesSubject$.next(this._epocProgresses);
    }

    fetchCustomCollections(): void {
        const cachedCustomCollections: Record<uid, EpocCollection> = JSON.parse(localStorage.getItem('customCollections')) || {};

        const customCollectionsArray$ = this.settings.customLibrairies.map(epocCollectionUrl =>
            this.http.get<EpocCollection>(epocCollectionUrl).pipe(
                map(epocCollection => {
                    // Iterate over each ePoc in the ePocs Record and add the new properties
                    Object.keys(epocCollection.ePocs).forEach((id) => {
                        epocCollection.ePocs[id] = {
                            ...epocCollection.ePocs[id],
                            downloading: false,
                            downloaded: false,
                            unzipping: false,
                            opened: false,
                        };
                    });
                    return epocCollection;
                })
            )
        );

        forkJoin(customCollectionsArray$).subscribe(customCollectionsArray => {
            const customCollections: Record<string, EpocCollection> = {};
            customCollectionsArray.forEach((epocCollection) => {
                customCollections[epocCollection.id] = epocCollection;
                Object.values(epocCollection.ePocs).forEach(epoc => {
                    this.readEpocContent(epoc.id).subscribe((localEpoc) => {
                        if (!localEpoc) return;
                        const downloadDate = localEpoc.lastModif ? new Date(localEpoc.lastModif.replace(/-/g, '/')) : new Date();
                        const updateAvailable = new Date(epoc.lastModified) > downloadDate;
                        this.updateEpocCollectionState(epoc.id, {downloaded: true, updateAvailable}, epocCollection.id, true);
                    })
                })
            });
            this._customCollections = customCollections;
        });
    }

    fetchOfficialCollections(): void {
        const cachedOfficialCollections: Record<uid, EpocCollection> = JSON.parse(localStorage.getItem('officialCollections')) || {};

        // Observable for fetching and updating collections
        const fetchAndUpdate$ = this.http.get<string[]>(this.officialCollectionsUrl).pipe(
            mergeMap((collectionUrls: string[]) => {
                return forkJoin(collectionUrls.map(url => this.http.get<EpocCollection>(url).pipe(
                    catchError(error => {
                        console.error('Error fetching collection:', error);
                        return throwError(() => error);
                    })
                )));
            }),
            map((epocCollections: EpocCollection[]) => {
                return epocCollections.map(epocCollection => {
                    Object.keys(epocCollection.ePocs).forEach((id) => {
                        epocCollection.ePocs[id] = {
                            ...epocCollection.ePocs[id],
                            downloading: false,
                            downloaded: false,
                            unzipping: false,
                            opened: false,
                        };
                    });
                    return epocCollection;
                });
            }),
            map((epocCollections: EpocCollection[]) => {
                // Convert the array of collections into a record
                const epocCollectionsRecord = epocCollections.reduce((acc, collection) => {
                    acc[collection.id] = collection;
                    return acc;
                }, {} as Record<string, EpocCollection>);

                localStorage.setItem('officialCollections', JSON.stringify(epocCollectionsRecord));
                return epocCollectionsRecord;
            })
        );

        // Use startWith to provide initial values from cache
        fetchAndUpdate$.pipe(
            startWith(cachedOfficialCollections),
        ).subscribe({
            next: (epocCollections: Record<uid, EpocCollection>) => {
                const officialCollections: Record<string, EpocCollection> = {};
                Object.values(epocCollections).forEach((epocCollection) => {
                    officialCollections[epocCollection.id] = epocCollection;
                    Object.values(epocCollection.ePocs).forEach(epoc => {
                        this.readEpocContent(epoc.id).subscribe((localEpoc) => {
                            if (!localEpoc) return;
                            const downloadDate = localEpoc.lastModif ? new Date(localEpoc.lastModif.replace(/-/g, '/')) : new Date();
                            const updateAvailable = new Date(epoc.lastModified) > downloadDate;
                            this.updateEpocCollectionState(epoc.id, {downloaded: true, updateAvailable}, epocCollection.id);
                        })
                    })
                });
                this._officialCollections = officialCollections;
            },
            error: (error) => {
                console.error('Error fetching collections:', error);
            }
        });
    }

    readEpocContent(epocId): Observable<Epoc> {
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
            return from(Filesystem.readFile({
                path: `../Library/NoCloud/epocs/${epocId}/content.json`,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            })).pipe(map(file => JSON.parse(file.data as string)));
        } else {
            const rootDirectory = Capacitor.isNativePlatform() && this.file.dataDirectory ? this.file.dataDirectory : 'assets/demo/';
            const url = Capacitor.convertFileSrc(`${rootDirectory}epocs/${epocId}/content.json`)
            return this.http.get<Epoc>(url).pipe(catchError(() => new BehaviorSubject(null).asObservable()));
        }
    }

    downloadEpoc(epoc: EpocMetadata, libraryId: string): Observable<number> {
        const download = this.fileService.download(epoc.download, `epocs/${epoc.id}.zip`);
        this.updateEpocCollectionState(epoc.id, {downloading: true}, libraryId);
        this.addEpocProgress(epoc.id);
        download.subscribe((progress) => {
            this.updateEpocProgress(epoc.id, progress);
        }, () => {
            this.updateEpocCollectionState(epoc.id, {}, libraryId);
        }, () => {
            this.unzipEpoc(epoc.id, libraryId);
        });
        this.tracker.trackEvent('Library', 'Download', `Download ${libraryId} ${epoc.id}`);
        return download;
    }

    unzipEpoc(epocId: string, libraryId?: string): Observable<number> {
        const unzip = this.fileService.unzip(`epocs/${epocId}.zip`, `epocs/${epocId}`);
        this.updateEpocCollectionState(epocId, {unzipping: true}, libraryId);
        this.addEpocProgress(epocId);
        unzip.subscribe((progress) => {
            this.updateEpocProgress(epocId, progress);
        }, () => {
            this.updateEpocCollectionState(epocId, {}, libraryId);
        }, () => {
            this.updateEpocCollectionState(epocId, {downloaded: true}, libraryId);
            this.fileService.deleteZip(`epocs/${epocId}.zip`);
        });
        return unzip;
    }

    deleteEpoc(epoc: EpocMetadata, libraryId?: string): Observable<any> {
        this.tracker.trackEvent('Library', 'Delete', `Delete ${epoc.id}`);
        const rm = this.fileService.deleteFolder(`epocs/${epoc.id}`);
        rm.subscribe(() => {}, () => {}, () => { this.updateEpocCollectionState(epoc.id, {}, libraryId); });
        return rm;
    }

    async epocLibraryMenu(epoc, libraryId?: string){
        const buttons = [
            {
                text: this.translate.instant('FLOATING_MENU.TOC'),
                icon: 'list-circle-outline',
                handler: () => {
                    this.router.navigateByUrl('/epoc/toc/' + epoc.id);
                }
            },
            {
                text: this.translate.instant('FLOATING_MENU.SCORE_DETAILS'),
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
                    this.deleteEpoc(epoc, libraryId).subscribe(() => this.downloadEpoc(epoc, libraryId))
                }
            }] : []),
            ...(epoc.opened ? [{
                text: this.translate.instant('FLOATING_MENU.RESET'),
                icon: 'refresh-outline',
                handler: () => {
                    this.confirmReset(epoc, libraryId)
                }
            }] : []),
            {
                text: this.translate.instant('FLOATING_MENU.DELETE'),
                icon: 'trash',
                handler: () => {
                    this.confirmDelete(epoc, libraryId)
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
            subHeader: this.translate.instant('FLOATING_MENU.MAIN_MENU'),
            mode: 'ios',
            buttons
        });
        document.documentElement.style.setProperty('--thumbnail-url', `url(${epoc.image})`);
        await actionSheet.present();
    }

    async confirmReset(epoc, libraryId?: string) {
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
                        this.updateEpocCollectionState(epoc.id,{
                            downloaded: epoc.downloaded,
                            opened: false
                        }, libraryId);
                    }
                }
            ]
        });

        await alert.present();
    }

    async confirmDelete(epoc, libraryId?: string) {
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
                        this.deleteEpoc(epoc, libraryId);
                    }
                }
            ]
        });

        await alert.present();
    }
}
