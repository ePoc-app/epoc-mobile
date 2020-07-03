import {Injectable} from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';

import {MockLibrary} from '../classes/mock-library';
import {Epoc} from '../classes/epoc';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Content} from '../classes/contents/content';
import {Assessment} from '../classes/contents/assessment';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    protected epoc$: ReplaySubject<Epoc> = new ReplaySubject(1);
    protected epocId: string;

    constructor() {}

    getLibrary(): Observable<Epoc[]> {
        return of(MockLibrary);
    }

    getEpoc(id: string): Observable<Epoc> {
        if (this.epocId !== id) {
            this.epocId = id;
            this.getLibrary().pipe(
                map((epocs: Epoc[]) => {
                    return epocs.find(item => item.id === id);
                })
            ).subscribe((epoc) => {
                this.epoc$.next(this.initCourseContent(epoc));
            });
        }
        return this.epoc$.asObservable().pipe(distinctUntilChanged());
    }

    initCourseContent(epoc: Epoc) {
        epoc.parts.forEach((part) => {
            part.contents = this.contentsFromTree(epoc, part.outlineTree, 1);
        });
        return epoc;
    }

    contentsFromTree(epoc, outlineTree, depth, currentChapter?): Content[] {
        return outlineTree.reduce((contents, node) => {
            const currentContent = epoc.content.find(item => item.id === node.contentId);
            if (currentContent) {
                currentContent.depth = depth;

                if (currentContent.type === 'chapter') {
                    currentChapter = currentContent;
                    currentChapter.time = 0;
                    currentChapter.videoCount = 0;
                    currentChapter.assessmentCount = 0;
                    epoc.chapterCount = epoc.chapterCount ?  epoc.chapterCount + 1 : 1;
                } else if (currentContent.type === 'assessment') {
                    (currentContent as Assessment).scoreTotal = (currentContent as Assessment).items.reduce(
                        (total, item) => item.score + total, 0
                    );
                    if (currentChapter) {
                        currentChapter.time = currentChapter.time + (currentContent as Assessment).items.length;
                        currentChapter.assessmentCount++;
                    }
                    epoc.assessmentCount = epoc.assessmentCount ? epoc.assessmentCount +  1 : 1;
                } else if (currentContent.type === 'video') {
                    if (currentChapter) {
                        currentChapter.videoCount++;
                        currentChapter.time = currentChapter.time + 3;
                    }
                }
                contents.push(currentContent);

                if (node.children) {
                    contents = contents.concat(this.contentsFromTree(epoc, node.children, depth + 1, currentChapter));
                }
            }
            return contents;
        }, []);
    }
}
