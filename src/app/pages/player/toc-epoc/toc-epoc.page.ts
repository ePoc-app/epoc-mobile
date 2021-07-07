import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {LibraryService} from '../../../services/library.service';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {AlertController} from '@ionic/angular';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {Reading} from '../../../classes/reading';

@Component({
    selector: 'app-toc-epoc',
    templateUrl: 'toc-epoc.page.html',
    styleUrls: ['toc-epoc.page.scss']
})
export class TocEpocPage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    reading: Reading;
    detailedToc = false;
    chaptersFinished: Array<boolean> = [];
    assessmentDone: Array<boolean> = [];

    sliderOptions = {
        slidesPerView: 1.2,
        spaceBetween: 25,
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController,
    ) {
    }

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc())
        );
        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
        });

        combineLatest(this.epoc$, this.readingStore.readings$, (epoc, reading) => ({epoc, reading})).subscribe(pair => {
            if (pair.epoc && pair.reading) {
                this.reading = pair.reading.find(item => item.epocId === this.epoc.id);
                this.setProgress();
            }
        });
    }

    setProgress () {
        for (const [chapterId, chapter] of Object.entries(this.epoc.chapters)) {
            chapter.assessmentDone = chapter.assessments.every(uid => this.reading.assessments.findIndex(assessment => assessment.id === uid) !== -1);
        }
    }
}
