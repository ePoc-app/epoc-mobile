import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, startWith} from 'rxjs/operators';
import {EpocLibrary, EpocMetadata} from 'src/app/classes/epoc';
import {FileService} from './file.service';

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

    private libraryUrl = 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list.json';
    private cachedLibrary: EpocLibrary[] = JSON.parse(localStorage.getItem('library')) || [];

    constructor(private http: HttpClient, private fileService: FileService) {
        this.fetchLibrary().subscribe((data: EpocLibrary[]) => this.library = data.map(item => {
            item.downloading = false;
            item.downloaded = false;
            item.unzipping = false;
            return item;
        }), (e) => console.warn('Error fetching library', e), () => {
            this.fileService.readdir('epocs').subscribe((data) => {
                data.forEach(file => {
                    const epocId = file.name;
                    this.updateEpocState(epocId, false, false, true);
                })
            });
        });
    }

    get library(): EpocLibrary[] {
        return this._library;
    }

    set library(value: EpocLibrary[]) {
        this._library = value;
        this.librarySubject$.next(value);
    }

    updateEpocState(epocId, downloading:boolean = false, unzipping:boolean = false, downloaded:boolean = false) {
        const epocIndex = this._library.findIndex(item => item.id === epocId);
        if (epocIndex === -1) return;
        const epoc = this._library[epocIndex];
        epoc.downloading = downloading;
        epoc.downloaded = downloaded;
        epoc.unzipping = unzipping;
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

    fetchLibrary(): Observable<EpocLibrary[]> {
        const request = this.http.get<EpocLibrary[]>(this.libraryUrl).pipe(filter(data => {
            if (!Array.isArray(data) || !data[0].id) return false; // cache only if valid
            localStorage.setItem('library', JSON.stringify(data)) // cache using localStorage
            return true;
        }));
        return request.pipe(startWith(this.cachedLibrary)); // return data starting with previous cached request
    }

    downloadEpoc(epoc: EpocMetadata): Observable<number> {
        const download = this.fileService.download(epoc.download, `epocs/${epoc.id}.zip`);
        this.updateEpocState(epoc.id, true);
        this.addEpocProgress(epoc.id);
        download.subscribe((progress) => {
            this.updateEpocProgress(epoc.id, progress);
        }, () => {
            this.updateEpocState(epoc.id);
        }, () => {
            this.unzipEpoc(epoc);
        });
        return download;
    }

    unzipEpoc(epoc: EpocMetadata): Observable<number> {
        const unzip = this.fileService.unzip(`epocs/${epoc.id}.zip`, `epocs/${epoc.id}`);
        this.updateEpocState(epoc.id, false, true);
        this.addEpocProgress(epoc.id);
        unzip.subscribe((progress) => {
            this.updateEpocProgress(epoc.id, progress);
        }, () => {
            this.updateEpocState(epoc.id);
        }, () => {
            this.updateEpocState(epoc.id, false, false, true);
            this.fileService.deleteZip(`epocs/${epoc.id}.zip`);
        });
        return unzip;
    }

    deleteEpoc(epoc: EpocMetadata): Observable<any> {
        const rm = this.fileService.deleteFolder(`epocs/${epoc.id}`);
        rm.subscribe(() => {}, () => {}, () => { this.updateEpocState(epoc.id); });
        return rm;
    }
}
