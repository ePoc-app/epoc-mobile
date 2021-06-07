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
import {Assessment, Question} from '../../../classes/contents/assessment';

@Component({
    selector: 'app-assessment',
    templateUrl: 'assessment.page.html',
    styleUrls: ['assessment.page.scss']
})
export class AssessmentPage implements OnInit {
    @ViewChild('questionSlides', { static: false }) questionSlides: IonSlides;

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    assessments: Assessment[];
    assessment: Assessment;
    epocId;
    assessmentId;
    reading: Reading;

    slidesOptions = {
        allowTouchMove: false
    };

    scoreMax = 0;
    userScore = 0;
    userResponses: string[] = [];
    questions: Question[];
    questionsSuccessed: boolean[];
    currentQuestion = 0;
    currentAnswer;
    explanationShown = false;
    assessmentData = null;
    notransition = false;
    flipped = false;
    certificateShown = false;
    solutionShown = false;
    easierScoring: boolean;
    nbCorrect: number;
    nbIncorrect: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        public libraryService: LibraryService,
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
            this.assessments = epoc.assessments;
            this.assessment = epoc.contents[this.assessmentId];
            this.questions = this.assessment.questions.map(questionId => this.epoc.questions[questionId]);
            this.scoreMax = this.libraryService.calcScoreTotal(this.epoc, this.assessment.questions);
            this.questionsSuccessed = new Array(this.questions.length);
            this.initQuestion();
        });
    }

    updateCurrentAnswer(newValue) {
        this.currentAnswer = newValue;
    }

    checkAnswer() {
        this.nbCorrect = 0;
        this.nbIncorrect = 0;
        const correctResponse = this.questions[this.currentQuestion].correctResponse;
        this.easierScoring =
            this.epoc.parameters.easierScoring
            || this.assessment.easierScoring
            || this.questions[this.currentQuestion].easierScoring;
        if (typeof correctResponse === 'string') {
            if (!this.easierScoring) {
                // Vérification Array entier
                if (correctResponse === this.currentAnswer) {
                    this.questionSuccessed();
                } else {
                    this.questionFailed();
                }
            } else {
                // Vérification réponse par réponse
                for (let i = 0; i < this.currentAnswer.length; i++) {
                    if (this.currentAnswer[i] === correctResponse[i]) {
                        this.nbCorrect++;
                    }
                    // Si on à parcouru toutes les réponses > on calcule le score
                    if (i === this.currentAnswer.length - 1) {
                        this.questionEasierScoring();
                    }
                }
            }
        } else if (Array.isArray(correctResponse)) {
            if (!this.easierScoring) {
                if (correctResponse.length === this.currentAnswer.length && correctResponse.every((answer, index) => {
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
                    let length = 0;
                    correctResponse.forEach(() => {
                        length++;
                    })
                    correctResponse.forEach((answer, index) => {
                        if (typeof answer === 'object') {
                            // Vérification réponse par réponse
                            this.currentAnswer[index].forEach((current) => {
                                    if (answer.values.includes(current)) {
                                        this.nbCorrect++;
                                    }
                                })
                            // Si on à parcouru toutes les réponses > on calcule le score
                            if (index + 1 === length) {
                                    this.questionEasierScoring();
                                }
                        } else {
                            // Vérification réponse par réponse
                            if (this.currentAnswer.includes(answer)) {
                                    this.nbCorrect++;
                                }
                                // Si on à parcouru toutes les réponses > on calcule le score
                                if (index + 1 === length) {
                                    this.questionEasierScoring();
                                }
                        }
                    })
            }
        } else {
            this.questionFailed();
        }
        this.userResponses.push(this.currentAnswer);
        this.explanationShown = true;
        this.notransition = false;
        document.querySelectorAll('.flip-container').forEach((elem) => elem.scrollTo(0, 0));
    }

    questionSuccessed() {
        this.userScore += +this.questions[this.currentQuestion].score;
        this.questionsSuccessed[this.currentQuestion] = true;
    }

    questionFailed() {
        this.questionsSuccessed[this.currentQuestion] = false;
    }

    questionEasierScoring() {
        const lengthCorrect = this.questions[this.currentQuestion].correctResponse.length;
        const nbIncorrect = this.currentAnswer.length - this.nbCorrect;
        const scorePerRep = +this.questions[this.currentQuestion].score / lengthCorrect;
        if (this.questions[this.currentQuestion].type === 'multiple-choice') {
            this.userScore +=
                Math.round(scorePerRep * this.nbCorrect - nbIncorrect * scorePerRep) > 0 ?
                    Math.round(scorePerRep * this.nbCorrect - nbIncorrect * scorePerRep)  : 0;
        } else {
            this.userScore += Math.round(scorePerRep * this.nbCorrect);
        }
        this.questionsSuccessed[this.currentQuestion] = this.userScore === this.questions[this.currentQuestion].score;
    }

    initQuestion() {
        this.solutionShown = false;
        this.explanationShown = false;
        this.notransition = true;
        this.flipped = false;
        if (this.questions[this.currentQuestion]) {
            this.currentAnswer = this.questions[this.currentQuestion].responses.length ? '' : true;
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        this.initQuestion();
        if (this.currentQuestion >= this.questions.length) {
            this.setAssessmentsData();
            this.readingStore.saveResponses(this.epocId, this.assessmentId, this.userScore, this.userResponses);
        }
        this.questionSlides.slideNext();
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

    setAssessmentsData() {
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

    goToCertificate() {
        this.dismissCertificateCard();
        this.router.navigateByUrl('/player/score/' + this.epoc.id);
    }

    dismissCertificateCard() {
        this.certificateShown = false;
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
        this.router.navigateByUrl(`/player/play/${this.epoc.id}/${this.assessment.chapterId}/content/${this.assessmentId}/next`);
    }

    flip() {
        if (this.explanationShown) {
            document.querySelectorAll('.flip-container').forEach((elem) => elem.scrollTo(0, 0));
            this.flipped = !this.flipped;
        }
    }

    toggleSolution(event) {
        event.stopPropagation();
        this.solutionShown = !this.solutionShown;
    }
}
