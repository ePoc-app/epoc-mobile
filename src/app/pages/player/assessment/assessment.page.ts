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
import {Label} from 'ng2-charts';

@Component({
    selector: 'app-assessment',
    templateUrl: 'assessment.page.html',
    styleUrls: ['assessment.page.scss']
})
export class AssessmentPage implements OnInit {
    @ViewChild('questionSlides', { static: false }) questionSlides: IonSlides;

    epoc$: Observable<Epoc>;
    epoc: Epoc;
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

    doughnutChartOptions = {
        responsive: true,
        aspectRatio: 1,
        legend: {
            position: 'bottom'
        },
        elements: {
            center: {
                text: '',
                sidePadding: 15
            }
        }
    };
    doughnutChartLabels: Label[] = [];
    doughnutChartDataset = [{
        label: 'Résumé des scores',
        data: [],
        backgroundColor: ['#10dc60', '#ffce00']
    }];

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
            }
        });

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.assessment = epoc.content.find((content) => content.id === this.assessmentId);
            this.questionsSuccessed = new Array(this.assessment.items.length);
        });
    }

    updateCurrentAnswer(newValue) {
        this.currentAnswer = newValue;
    }

    checkAnswer() {
        const correctResponse = this.assessment.items[this.currentQuestion].correctResponse;
        if (typeof this.currentAnswer === 'string') {
            if (correctResponse === this.currentAnswer) {
                this.questionSuccessed();
            } else {
                this.questionFailed();
            }
        } else if (Array.isArray(correctResponse)) {
            if (correctResponse.every((answer, index) => {
                if (typeof answer === 'object') {
                    return this.arraysEqual(this.currentAnswer[index], answer.values);
                } else {
                    return this.currentAnswer ? this.currentAnswer.indexOf(answer) >= 0 : false;
                }
            })) {
                this.questionSuccessed();
            } else {
                this.questionFailed();
            }
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
            this.currentQuestion++;
            this.currentAnswer = '';
            this.explanationShown = false;
            this.readingStore.saveResponses(this.epocId, this.assessmentId, this.userScore, this.userResponses);
            this.questionSlides.slideNext();
            this.doughnutChartOptions = {
                responsive: true,
                aspectRatio: 1,
                legend: {
                    position: 'bottom'
                },
                elements: {
                    center: {
                        text: Math.round(this.userScore / this.getScoreTotal() * 100) + '%',
                        sidePadding: 15
                    }
                }
            };
            this.doughnutChartDataset[0].data = [
                this.questionsSuccessed.reduce((a, e) => e ? a + 1 : a, 0),
                this.questionsSuccessed.reduce((a, e) => !e ? a + 1 : a, 0),
            ];
        }
    }

    arraysEqual(arr1Orig, arr2Orig) {

        if (!Array.isArray(arr1Orig) || ! Array.isArray(arr2Orig) || arr1Orig.length !== arr2Orig.length) {
            return false;
        }

        const arr1 = arr1Orig.concat().sort();
        const arr2 = arr2Orig.concat().sort();

        for (let i = 0; i < arr1.length; i++) {

            if (arr1[i] !== arr2[i]) {
                return false;
            }

        }

        return true;

    }

    hasNextSlide() {
        return this.currentQuestion < this.assessment.items.length;
    }

    getScoreTotal() {
        return this.assessment.items.reduce((total, item) => item.score + total, 0);
    }

    back(event) {
        event.preventDefault();
        event.stopPropagation();
        this.router.navigateByUrl('/player/play/' + this.epoc.id + '/' + this.assessment.chapterId + '/content/' + this.assessmentId);
    }

    retry() {
        location.reload();
    }

    resume() {
        this.router.navigateByUrl('/player/play/' + this.epoc.id + '/' + this.assessment.chapterId + '/content/' + this.assessmentId);
    }
}
