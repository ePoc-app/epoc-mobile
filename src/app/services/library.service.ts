import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, ReplaySubject} from 'rxjs';
import {Epoc} from '../classes/epoc';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Assessment, SimpleQuestion} from '../classes/contents/assessment';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    protected epoc$: ReplaySubject<Epoc> = new ReplaySubject(1);
    protected epocId: string;
    public rootFolder: string;

    constructor(private http: HttpClient) {}

    getLibrary(): Observable<Epoc[]> {
        return null;
    }

    getEpoc(id: string): Observable<Epoc> {
        if (this.epocId !== id) {
            this.epocId = id;
            this.rootFolder = 'assets/demo/';
            this.http.get('./assets/demo/content.json').subscribe((epoc) => {
                this.epoc$.next(this.initCourseContent(epoc as Epoc));
            });
        }
        return this.epoc$.asObservable().pipe(distinctUntilChanged());
    }

    initCourseContent(epoc: Epoc) {
        epoc.assessments = [];
        epoc.chapters.forEach((chapter, index) => {
            chapter.time = 0;
            chapter.videoCount = 0;
            chapter.assessmentCount = 0;
            chapter.contents = chapter.contentsIds.reduce((contents, uid) => {
                const currentContent = epoc.content.find(item => item.id === uid);

                if (currentContent.type === 'assessment') {
                    (currentContent as Assessment).scoreTotal = (currentContent as Assessment).items.reduce(
                        (total, item) => item.score + total, 0
                    );
                    (currentContent as Assessment).chapterId = index;
                    chapter.time = chapter.time + (currentContent as Assessment).items.length;
                    chapter.assessmentCount++;
                    epoc.assessments.push((currentContent as Assessment));
                } else if (currentContent.type === 'simple-question' && (currentContent as SimpleQuestion).question.score > 0) {
                    (currentContent as Assessment).items = [(currentContent as SimpleQuestion).question];
                    (currentContent as Assessment).chapterId = index;
                    epoc.assessments.push((currentContent as Assessment));
                } else if (currentContent.type === 'video') {
                    chapter.videoCount++;
                    chapter.time = chapter.time + 3;
                }

                contents.push(currentContent);
                return contents;
            }, []);
        });

        return epoc;
    }
}
