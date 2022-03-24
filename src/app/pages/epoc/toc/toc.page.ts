import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from 'src/app/classes/epoc';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Reading} from 'src/app/classes/reading';
import {EpocService} from '../../../services/epoc.service';

@Component({
    selector: 'app-epoc-toc',
    templateUrl: 'toc.page.html',
    styleUrls: ['toc.page.scss']
})
export class EpocTocPage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    reading: Reading;
    contentInitialized = false;

    sliderOptions = {
        slidesPerView: 1.2,
        spaceBetween: 25,
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public epocService: EpocService,
        private readingStore: ReadingStoreService
    ) {
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('id')))
        );
        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
        });
        combineLatest([this.epoc$, this.readingStore.readings$]).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                this.reading = readings.find(item => item.epocId === this.epoc.id);
                if (this.reading) {
                    this.setProgress();
                }
            }
        });
    }

    ionViewDidEnter() {
        if (this.reading) {
            this.setProgress();
        }
    }

    setProgress () {
        for (const [chapterId, chapter] of Object.entries(this.epoc.chapters)) {
            chapter.assessmentDone = chapter.assessments.every(uid => {
                return this.reading.assessments.findIndex(assessment => assessment.id === uid) !== -1
            });
            const chapterIndex = this.reading.chaptersProgress.findIndex(chapterProgress => chapterProgress.id === chapterId);
            chapter.chapterOpened = chapterIndex !== -1;
            if (chapter.chapterOpened) {
                let resumeLink;
                const readingChapter = this.reading.chaptersProgress[chapterIndex];
                chapter.allViewed = true;
                chapter.initializedContents.forEach(content => {
                    if (content.type === 'assessment' || content.type === 'simple-question'){
                        content.viewed = this.reading.assessments.findIndex(assessment => assessment.id === content.id) !== -1
                    } else {
                        content.viewed = readingChapter.contents.findIndex(uid => uid === content.id) !== -1;
                    }
                    if (!content.viewed) {
                        chapter.allViewed = false;
                        if (!resumeLink) {
                            resumeLink = `/epoc/play/${this.epoc.id}/${chapterId}/content/${content.id}`;
                            chapter.resumeLink = resumeLink;
                        }
                    }
                })
                chapter.done = chapter.assessmentDone && chapter.chapterOpened && chapter.allViewed
            }
        }
        this.contentInitialized = true;
    }

    toggleDetails (chapter) {
        chapter.opened = !chapter.opened;
    }

    displayMenu() {
        this.epocService.presentActionSheet();
    }
}
