import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {AlertController, IonSlides} from '@ionic/angular';
import {Reading} from '../../../classes/reading';
import {Assessment} from '../../../classes/contents/assessment';

@Component({
    selector: 'app-assessment',
    templateUrl: 'assessment.page.html',
    styleUrls: ['assessment.page.scss']
})
export class AssessmentPage implements OnInit {
    @ViewChild('questionSlides', { static: false }) protected questionSlides: IonSlides;

    epoc$: Observable<Epoc>;
    assessment: Assessment;
    epocId;
    assessmentId;
    reading: Reading;

    slidesOptions = {
        allowTouchMove: false
    };

    userScore = 0;
    userResponses: string[] = [];
    questionsSuccessed: boolean[];
    currentQuestion = 0;
    currentAnswer;
    explanationShown = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('epocId')))
        );

        this.epocId = this.route.snapshot.paramMap.get('epocId');
        this.assessmentId = this.route.snapshot.paramMap.get('assessmentId');

        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);
                console.log(readings);
            }
        });

        this.epoc$.subscribe(epoc => {
            this.assessment = epoc.content.find((content) => content.id === this.assessmentId);
            this.questionsSuccessed = new Array(this.assessment.items.length);
        });
    }

    updateCurrentAnswer(newValue) {
        this.currentAnswer = newValue;
    }

    checkAnswer() {
        if (this.assessment.items[this.currentQuestion].correctResponse === this.currentAnswer) {
            this.questionSuccessed();
        } else {
            this.questionFailed();
        }
        this.userResponses.push(this.currentAnswer);
        this.explanationShown = true;
        this.questionSlides.slideNext();
    }

    questionSuccessed() {
        this.userScore += this.assessment.items[this.currentQuestion].score;
        this.questionsSuccessed[this.currentQuestion] = true;
    }

    questionFailed() {
        this.questionsSuccessed[this.currentQuestion] = false;
    }

    nextQuestion() {
        if (this.currentQuestion < this.assessment.items.length - 1) {
            this.currentQuestion++;
            this.currentAnswer = '';
            this.explanationShown = false;
            this.questionSlides.slideNext();
        } else {
            this.readingStore.saveResponses(this.epocId, this.assessmentId, this.userScore, this.userResponses);
            this.location.back();
        }
    }
}
