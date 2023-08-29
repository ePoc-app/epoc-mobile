import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {AlertController, IonSlides, NavController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Epoc} from 'src/app/classes/epoc';
import {Reading} from 'src/app/classes/reading';
import {Assessment, Question, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {EpocService} from 'src/app/services/epoc.service';
import {CommonQuestionComponent} from 'src/app/components/questions/common-question/common-question.component';
import {MatomoTracker} from '@ngx-matomo/tracker';
import {AppService} from 'src/app/services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-epoc-assessment',
    templateUrl: 'assessment.page.html',
    styleUrls: ['assessment.page.scss']
})
export class EpocAssessmentPage implements OnInit {
    @ViewChildren(CommonQuestionComponent) questionsElement:QueryList<CommonQuestionComponent>;
    @ViewChild('questionSlides', {static: false}) questionSlides: IonSlides;

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    assessments: (Assessment|SimpleQuestion)[];
    assessment: Assessment;
    epocId;
    assessmentId;
    reading: Reading;
    assessmentDone: Array<boolean>;
    isEnd = false;

    slidesOptions = {
        allowTouchMove: false
    };

    scoreMax = 0;
    userScore = 0;
    userResponses: Array<any> = [];
    questions: Question[];
    currentQuestion = 0;
    currentQuestionUserResponse;
    correctionShown = false;
    explanationShown = false;
    assessmentData = null;
    certificateShown = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        public epocService: EpocService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController,
        public navCtrl: NavController,
        private readonly tracker: MatomoTracker,
        public appService: AppService,
        public translate: TranslateService
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('epocId')))
        );

        this.epocId = this.route.snapshot.paramMap.get('epocId');
        this.assessmentId = this.route.snapshot.paramMap.get('assessmentId');

        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);
                if (!this.reading) this.readingStore.addReading(this.epocId);
            }
        });

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.assessments = epoc.assessments;
            this.assessment = epoc.contents[this.assessmentId] as Assessment;
            this.questions = this.assessment.questions.map(questionId => this.epoc.questions[questionId]);
            this.scoreMax = this.epocService.calcScoreTotal(this.epoc, this.assessment.questions);
            this.readingStore.saveStatement(this.epocId, 'contents', this.assessmentId, 'started', true);
        });
    }

    ionViewWillEnter() {
        this.retry();
    }

    onUserHasResponded(userResponses) {
        this.currentQuestionUserResponse = userResponses;
    }

    checkAnswer() {
        const question = this.questions[this.currentQuestion];
        const score = this.epocService.calcScore(question.score, question.correctResponse, this.currentQuestionUserResponse);
        this.correctionShown = true;
        this.questionsElement.toArray()[this.currentQuestion].showCorrection();
        this.userScore += score;
        this.userResponses.push(this.currentQuestionUserResponse);
        this.tracker.trackEvent('Assessments', 'Answered', `Answered ${this.epocId} ${this.assessmentId} ${this.currentQuestion}`, score);
        this.readingStore.saveStatement(this.epocId, 'questions', this.assessment.questions[this.currentQuestion], 'attempted', true);
        this.readingStore.saveStatement(this.epocId, 'questions', this.assessment.questions[this.currentQuestion], 'scored', score);
        if (score > 0) {
            this.readingStore.saveStatement(this.epocId, 'questions', this.assessment.questions[this.currentQuestion], 'passed', true);
        } else {
            this.readingStore.saveStatement(this.epocId, 'questions', this.assessment.questions[this.currentQuestion], 'failed', true);
        }
    }

    toggleExplanation() {
        this.questionsElement.toArray()[this.currentQuestion].toggleExplanation();
    }

    onExplanationToggle(event) {
        this.explanationShown = event
    }

    nextQuestion() {
        this.currentQuestionUserResponse = null;
        this.correctionShown = false;
        this.explanationShown = false;
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
            this.setAssessmentsData();
            this.readingStore.saveResponses(this.epocId, this.assessmentId, this.userScore, this.userResponses);
            this.isEnd = true;
            this.readingStore.saveStatement(this.epocId, 'contents', this.assessmentId, 'completed', true);
            this.readingStore.saveStatement(this.epocId, 'contents', this.assessmentId, 'scored', this.userScore);
        }
        this.questionSlides.slideNext();
        setTimeout(() => {
            this.updateFocus();
        }, 1000);
    }

    setAssessmentsData() {
        this.tracker.trackEvent('Assessments', 'Done', `Answered ${this.epocId} ${this.assessmentId}`, this.userScore);
        this.assessmentData = {
            userScore: this.userScore,
            totalUserScore: 0,
            totalScore: 0
        };

        this.assessments.forEach((assessment) => {
            if (assessment.id !== this.assessmentId) {
                const userAssessment = this.reading.assessments.find(a => assessment.id === a.id);
                if (userAssessment && userAssessment.score > 0) {
                    this.assessmentData.totalUserScore += userAssessment.score;
                }
            }
            this.assessmentData.totalScore += assessment.scoreTotal;
        });
        if (this.assessmentData.totalUserScore + this.assessmentData.userScore >= this.epoc.certificateScore) {
            setTimeout(() => {
                this.showCertificateCard();
            }, 1500);
        }
    }

    showCertificateCard() {
        if (!this.reading.certificateShown) {
            this.certificateShown = true;
            this.readingStore.updateCertificateShown(this.epoc.id, true);
        }
    }

    back() {
        this.presentAlertConfirm()
    }

    async presentAlertConfirm() {
        const alert = await this.alertController.create({
            header: this.translate.instant('QUESTION.QUIT_MODAL.HEADER'),
            message: this.translate.instant('QUESTION.QUIT_MODAL.MSG'),
            buttons: [
                {
                    text: this.translate.instant('QUESTION.QUIT_MODAL.STAY'),
                    role: 'cancel'
                },
                {
                    text: this.translate.instant('QUESTION.QUIT_MODAL.QUIT'),
                    handler: () => {
                        this.navCtrl.navigateBack(
                            '/epoc/play/' + this.epoc.id + '/' + this.assessment.chapterId + '/content/' + this.assessmentId
                        );
                    },
                }
            ],
        });

        await alert.present();
    }

    retry() {
        this.userScore = 0;
        this.userResponses = [];
        this.assessmentData = null;
        this.currentQuestionUserResponse = null;
        this.correctionShown = false;
        this.currentQuestion = 0;
        this.questionSlides?.slideTo(0);
        this.isEnd = false;
        this.explanationShown = false;
    }

    resume() {
        this.router.navigateByUrl(`/epoc/play/${this.epoc.id}/${this.assessment.chapterId}/content/${this.assessmentId}/next`);
    }

    updateFocus() {
        if(this.appService.screenReaderDetected) {
            (document.querySelector('app-epoc-assessment .assessment-reader') as HTMLElement).focus();
        }
    }

    ionViewDidEnter() {
        this.updateFocus();
    }
}
