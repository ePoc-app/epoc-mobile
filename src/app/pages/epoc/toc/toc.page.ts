import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from 'src/app/classes/epoc';
import {AlertController} from '@ionic/angular';
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
    chaptersFinished: Array<boolean> = [];
    assessmentDone: Array<boolean> = [];

    sliderOptions = {
        slidesPerView: 1.2,
        spaceBetween: 25,
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public epocService: EpocService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController,
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
        combineLatest(this.epoc$, this.readingStore.readings$, (epoc, reading) => ({epoc, reading})).subscribe(pair => {
            if (pair.epoc && pair.reading) {
                this.reading = pair.reading.find(item => item.epocId === this.epoc.id);
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
            chapter.assessmentDone = chapter.assessments.every(uid => this.reading.assessments.findIndex(assessment => assessment.id === uid) !== -1);
        }
    }
}
