import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {Capacitor, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';
import {Epoc} from '../classes/epoc';
import {Assessment, SimpleQuestion} from '../classes/contents/assessment';
import {uid} from '../classes/types';

const { Filesystem } = Plugins;

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    protected epoc$: ReplaySubject<Epoc> = new ReplaySubject(1);
    private initialized = false;
    public rootFolder = localStorage.getItem('rootFolder') ? Capacitor.convertFileSrc(localStorage.getItem('rootFolder')) : './assets/demo/';

    constructor(private http: HttpClient) {}

    getLibrary(): Observable<Epoc[]> {
        return null;
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
            chapter.assessmentCount = 0;
            chapter.initializedContents = chapter.contents.map((id) => {
                const currentContent = epoc.contents[id];
                currentContent.id = id;
                if (currentContent.type === 'assessment') {
                    (currentContent as Assessment).scoreTotal = this.calcScoreTotal(epoc, (currentContent as Assessment).questions);
                    (currentContent as Assessment).chapterId = chapterId;
                    chapter.time = chapter.time + (currentContent as Assessment).questions.length;
                    chapter.assessmentCount++;
                    epoc.assessments.push((currentContent as Assessment));
                } else if (currentContent.type === 'simple-question' &&
                    Number(epoc.questions[(currentContent as SimpleQuestion).question].score) > 0) {
                    (currentContent as Assessment).scoreTotal = this.calcScoreTotal(epoc, [(currentContent as SimpleQuestion).question]);
                    (currentContent as Assessment).questions = [(currentContent as SimpleQuestion).question];
                    (currentContent as Assessment).chapterId = chapterId;
                    epoc.assessments.push((currentContent as Assessment));
                } else if (currentContent.type === 'video') {
                    chapter.videoCount++;
                    chapter.time = chapter.time + 3;
                }
                return currentContent;
            });
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
