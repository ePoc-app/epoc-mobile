import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, filter, startWith} from 'rxjs/operators';
import {Capacitor, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';
import {Epoc, EpocLibrary, EpocMetadata} from 'src/app/classes/epoc';
import {Assessment, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {uid} from 'src/app/classes/types';
import {FileService} from './file.service';

const {Filesystem} = Plugins;

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

    protected epoc$: ReplaySubject<Epoc> = new ReplaySubject(1);
    private initialized = false;
    private libraryUrl = 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list.json';
    private cachedLibrary: EpocLibrary[] = JSON.parse(localStorage.getItem('library')) || [];
    private storedRootFolder = localStorage.getItem('rootFolder');
    public rootFolder =  this.storedRootFolder ? Capacitor.convertFileSrc(this.storedRootFolder) : './assets/demo/';

    constructor(private http: HttpClient, private fileService: FileService) {
        this.fetchLibrary().subscribe((data: EpocLibrary[]) => this.library = data.map(item => {
            item.downloading = false;
            item.downloaded = false;
            item.unzipping = false;
            return item;
        }));
        this.fileService.readdir('epocs').subscribe((data) => {
            data.forEach(file => {
                const epocId = file.name;
                this.updateEpocState(epocId, false, false, true);
            })
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

    setRootFolder(rootFolder: string) {
        if(!rootFolder){
            localStorage.removeItem('rootFolder');
            this.rootFolder = './assets/demo/';
            return;
        }
        localStorage.setItem('rootFolder', rootFolder);
        this.rootFolder = Capacitor.convertFileSrc(rootFolder);
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

    getEpoc(id?: string): Observable<Epoc> {
        if (id || !this.initialized) {
            const url = this.rootFolder + 'content.json';
            this.http.get(url).subscribe((epoc) => {
                this.epoc$.next(this.initCourseContent(epoc as Epoc));
            }, () => {
                // Backup support for iOS livereload (dev environment)
                Filesystem.readFile({
                    path: '../Library/NoCloud/epoc/content.json',
                    directory: FilesystemDirectory.Data,
                    encoding: FilesystemEncoding.UTF8
                }).then((result) => {
                    const epoc = JSON.parse(result.data);
                    this.epoc$.next(this.initCourseContent(epoc as Epoc));
                });
            });
        }
        return this.epoc$.asObservable().pipe(distinctUntilChanged());
    }

    /**
     * Initiliaze ePoc runtime properties
     */
    initCourseContent(epoc: Epoc) {
        this.initialized = true;
        epoc.assessments = [];
        // backward compatibility before epoc parameters existed
        epoc.parameters = epoc.parameters ? epoc.parameters : {};

        for (const [chapterId, chapter] of Object.entries(epoc.chapters)) {
            chapter.time = 0;
            chapter.videoCount = 0;
            chapter.assessments = [];
            chapter.initializedContents = chapter.contents.map((id) => {
                const currentContent = epoc.contents[id];
                currentContent.id = id;
                if (currentContent.type === 'assessment') {
                    (currentContent as Assessment).scoreTotal = this.calcScoreTotal(epoc, (currentContent as Assessment).questions);
                    (currentContent as Assessment).chapterId = chapterId;
                    chapter.time = chapter.time + (currentContent as Assessment).questions.length;
                    chapter.assessments.push(id);
                    epoc.assessments.push((currentContent as Assessment));
                } else if (currentContent.type === 'simple-question' &&
                    Number(epoc.questions[(currentContent as SimpleQuestion).question].score) > 0) {
                    (currentContent as Assessment).scoreTotal = this.calcScoreTotal(epoc, [(currentContent as SimpleQuestion).question]);
                    (currentContent as Assessment).questions = [(currentContent as SimpleQuestion).question];
                    (currentContent as Assessment).chapterId = chapterId;
                    chapter.assessments.push(id);
                    epoc.assessments.push((currentContent as Assessment));
                } else if (currentContent.type === 'video') {
                    chapter.videoCount++;
                    chapter.time = chapter.time + 3;
                }
                return currentContent;
            });
            chapter.assessmentCount = chapter.assessments.length;
        }

        return epoc;
    }

    /**
     * Calcule le score total d'un ensemble de questions
     */
    public calcScoreTotal(epoc: Epoc, questions: Array<uid>) {
        return questions.reduce((total, questionId) => total + Number(epoc.questions[questionId].score), 0);
    }
}
