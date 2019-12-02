import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ActionSheetController, AlertController, IonSlides, Platform} from '@ionic/angular';
import {LibraryService} from '../../services/library.service';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Epoc} from '../../classes/epoc';
import {NgForm} from '@angular/forms';
import {ReadingStoreService} from '../../services/reading-store.service';
import {Reading} from '../../classes/reading';

@Component({
    selector: 'app-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class PlayerPage implements OnInit {

    @ViewChild('slides', { static: false }) protected slider: IonSlides;

    epoc$: Observable<Epoc>;

    readings: Reading[];

    slidesOptions = {
        slidesPerView: 2,
        spaceBetween: 0,
        initialSlide: 0,
        autoHeight: true,
        breakpoints: {
            600: {
                slidesPerView: 1
            }
        }
    };

    currentPage = 0;
    displaySubmit = true;
    displayResume = false;
    displayTryagain = false;
    isBookmarked = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public alertController: AlertController,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );

        this.slidesOptions.initialSlide = +this.route.snapshot.paramMap.get('page');
        this.currentPage = +this.route.snapshot.paramMap.get('page');
    }

    onSubmit(assessmentForm: NgForm, assessments) {
        const errors = assessments.some((assessment, index) => {
            return assessment.correctResponse !== assessmentForm.value[assessment.type + '-' + index];
        });

        if (errors) {
            this.displayTryagain = true;
            this.displaySubmit = false;
        } else {
            this.displaySubmit = false;
            this.displayResume = true;
        }
    }

    initSlide(epoc) {
        const currentReading = this.readingStore.readings.find(reading => reading.epocId === epoc.id);
        this.isBookmarked = currentReading.bookmarks.indexOf(this.currentPage) !== -1;
    }

    slideChanged(epoc) {
        this.slider.getActiveIndex().then((index) => {
            this.currentPage = index;
            this.readingStore.updateProgress(epoc.id, (index + 1) / epoc.content.length);
            const currentReading = this.readingStore.readings.find(reading => reading.epocId === epoc.id);
            this.isBookmarked = currentReading.bookmarks.indexOf(this.currentPage) !== -1;
        });
    }

    beforeSlideChanged() {
        this.isBookmarked = false;
        this.displaySubmit = true;
        this.displayTryagain = false;
        this.displayResume = false;
    }

    resume() {
        this.displaySubmit = true;
        this.displayResume = false;
        this.slider.slideNext();
    }

    tryAgain(assessmentForm: NgForm) {
        this.displaySubmit = true;
        this.displayTryagain = false;
        assessmentForm.reset();
    }

    toggleBookmark() {
        this.readingStore.toggleBookmark(this.route.snapshot.paramMap.get('id'), this.currentPage);
        this.isBookmarked = !this.isBookmarked;

        console.log('tutu')
    }
}
