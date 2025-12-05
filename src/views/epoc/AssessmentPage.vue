<script setup lang="ts">
import {ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {AlertController, IonicSlides, NavController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {Reading} from 'src/app/classes/reading';
import {Assessment, Question, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {CommonQuestionComponent} from 'src/app/components/questions/common-question/common-question.component';
import { useEpocStore } from '@/stores/epocStore';
import { appService } from '@/utils/appService';
import { Epoc } from '@/types/epoc';
import { useReadingStore } from '@/stores/readingStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { onIonViewDidEnter, onIonViewWillEnter } from '@ionic/vue';



//Store
const epocStore = useEpocStore()
const readingStore = useReadingStore()
const settingsStore = useSettingsStore()       
const router = useRouter();
const route = useRoute();

// # ref
const { epoc } = storeToRefs(epocStore)
const { settings } = storeToRefs(settingsStore)
const { readings } = storeToRefs(readingStore)

const epocId = ref<string>(route.params.epoc_id.toString())
const assessmentId = ref<string>(route.params.assessmentId.toString())
const reading = computed(() => readings.value.find(question => question.epocId === epoc.value.id))
const assessments = computed(() => epoc.value.assessments)
const assessment = computed(() => epoc.value.contents[assessmentId.value] as Assessment)

const questions = computed(() => assessment.value.questions.map(questionId => epoc.value.questions[questionId]))
const scoreMax = computed(() => epocStore.calcScoreTotal(epoc.value, assessment.value.questions);

// setup process
if (!reading) readingStore.addReading(epocId.value);
readingStore.saveStatement(epocId.value, 'contents', assessmentId.value, 'started', true);


// Lifecycle

onIonViewWillEnter(() {
  retry();
})

onIonViewDidEnter(() => {
  updateFocus();
  // @ts-ignore
  const allowTouch = !!window.isPreviewWindow;
  setTimeout(() => {
      questionSlides.nativeElement.swiper.allowTouchMove = allowTouch;
  }, 100);
})

// Methods


const retry = () => {
  this.userScore = 0;
  this.userResponses = [];
  this.assessmentData = null;
  this.currentQuestionUserResponse = null;
  this.correctionShown = false;
  this.currentQuestion = 0;
  this.questionSlides?.nativeElement.swiper.slideTo(0);
  this.isEnd = false;
}


onUserHasResponded(userResponses) {
    this.currentQuestionUserResponse = userResponses;
    this.ref.detectChanges();
}

checkAnswer() {
    const question = this.questions[this.currentQuestion];
    const userSucceeded = this.epocService.isUserResponsesCorrect(
        question.correctResponse,
        this.currentQuestionUserResponse
    );
    const score = userSucceeded ? +question.score : 0;
    this.correctionShown = true;
    this.questionsElement.toArray()[this.currentQuestion].showCorrection();
    this.userScore += score;
    this.userResponses.push(this.currentQuestionUserResponse);
    this.tracker.trackEvent('Assessments', 'Answered', `Answered ${this.epocId} ${this.assessmentId} ${this.currentQuestion}`, score);
    this.readingStore.saveStatement(this.epocId, 'questions', this.assessment.questions[this.currentQuestion], 'attempted', true);
    this.readingStore.saveStatement(this.epocId, 'questions', this.assessment.questions[this.currentQuestion], 'scored', score);
    this.readingStore.saveStatement(this.epocId, 'questions', this.assessment.questions[this.currentQuestion], 'passed', userSucceeded);
}

nextQuestion() {
    this.currentQuestionUserResponse = null;
    this.correctionShown = false;
    this.currentQuestion++;
    if (this.currentQuestion >= this.questions.length) {
        this.setAssessmentsData();
        this.readingStore.saveResponses(this.epocId, this.assessmentId, this.userScore, this.userResponses);
        this.isEnd = true;
        this.readingStore.saveStatement(this.epocId, 'contents', this.assessmentId, 'completed', true);
        this.readingStore.saveStatement(this.epocId, 'contents', this.assessmentId, 'scored', this.userScore);
    }
    this.questionSlides.nativeElement.swiper.slideNext();
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
    if (this.assessmentData.totalUserScore + this.assessmentData.userScore >= this.epoc.certificateScore && this.reading.badges.length >= this.epoc.certificateBadgeCount) {
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

const back = () => {
  presentAlertConfirm()
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


const resume = () => {
    router.push(`/epoc/play/${epocId.value}/${assessment.value.chapterId}/content/${assessmentId.value}/next`);
}

const updateFocus = () => {
    if(appService.screenReaderDetected) {
        (document.querySelector('app-epoc-assessment .assessment-reader') as HTMLElement).focus();
    }
}

</script>

<template>
<ion-content [scrollY]="false" v-if="assessment">
    <div class="slider-wrapper assessment-reader" slot="fixed" tabindex="1">
        <swiper-container [modules]="swiperModules" class="slider assessment-swiper" #questionSlides allow-touch-move="false">
            <template *v-for="let question of assessment.questions | denormalize:epoc.questions; let questionIndex = index;">
                <swiper-slide>
                    <common-question [attr.aria-hidden]="questionIndex !== currentQuestion" closable="true" [subtitle]="'Question '+(questionIndex+1)+'/'+assessment.questions.length" [contentId]="assessment.id"
                         [epocId]="epocId" [question]="question" (userHasResponded)="onUserHasResponded($event)" (close)="back()" v-if="!isEnd">
                    </common-question>
                </swiper-slide>
            </template>
            <swiper-slide class="assessment-end">
                <app-card v-if="assessmentData">
                    <div class="title-container">
                        <div class="title-icon">
                            <ion-icon aria-hidden="true" name="star-outline"></ion-icon>
                        </div>
                        <h5 class="title" v-if="scoreMax > 0">{{$t('QUESTION.ASSESSMENT_PAGE.SCORE')}}</h5>
                        <h5 class="title" v-if="scoreMax <= 0">{{$t('QUESTION.ASSESSMENT_PAGE.NOT_GRADED')}}</h5>
                    </div>
                    <div class="score" v-if="scoreMax > 0">
                        <div class="score-points">
                            <div class="score-points-assessment">{{assessmentData.userScore}} pts</div>
                            <div class="score-points-total">
                                <b>{{$t('QUESTION.ASSESSMENT_PAGE.TOTAL_SCORE')}}</b>
                                {{assessmentData.totalUserScore + assessmentData.userScore}} / {{assessmentData.totalScore}}
                            </div>
                        </div>
                        <div aria-hidden="true" class="score-chart">
                            <score-progress [progress]="assessmentData.totalUserScore / assessmentData.totalScore * 100"
                                            [delta]="assessmentData.userScore / assessmentData.totalScore * 100"
                                            [threshold]="epoc.certificateScore / assessmentData.totalScore * 100"
                                            [minLabel]="'0'"
                                            [maxLabel]="assessmentData.totalScore"></score-progress>
                        </div>
                    </div>
                    <ion-button size="large" expand="block" color="outline-button" fill="outline" (click)="retry()">
                        <span>{{$t('QUESTION.ASSESSMENT_PAGE.RESTART_ACTIVITY')}}</span>
                    </ion-button>
                </app-card>
            </swiper-slide>
        </swiper-container>
    </div>
    <certificate-modal [epocId]="epocId" [certificateShown]="certificateShown"></certificate-modal>
</ion-content>

<ion-footer v-if="!isEnd">
    <ion-button size="large" expand="block" color="inria" [disabled]="!currentQuestionUserResponse" (click)="checkAnswer();" v-if="!correctionShown">
        <span>{{$t('QUESTION.VALIDATE')}}</span>
    </ion-button>
    <div class="next-buttons">
        <ion-button role="button" color="inria-grey" size="large" expand="block" (click)="nextQuestion()" v-if="correctionShown">
            <span>{{$t('QUESTION.NEXT')}}</span>
            <ion-icon aria-hidden="true" name="arrow-forward-outline" slot="end"></ion-icon>
        </ion-button>
    </div>
</ion-footer>
<ion-footer v-if="isEnd">
    <ion-button role="button" size="large" expand="block" color="inria" (click)="resume()">
        <span>{{$t('QUESTION.ASSESSMENT_PAGE.CONTINUE_COURSE')}}</span>
    </ion-button>
</ion-footer>

</template>

<style scoped lang="scss">
.slider-wrapper{
  position: absolute;
  top: var(--ion-safe-area-top);
  height: calc(100% - var(--ion-safe-area-top));
  width: 100%;
  opacity: 1;
  transition: opacity .3s ease;
  background: var(--ion-color-contrast-2);

  &.loading{
    opacity: 0;
  }
  .slider{
    position: absolute;
    height:100%;
    width: 100%;
    overflow: hidden;
  }

  swiper-slide{
    flex-direction: column;
  }
}

ion-footer{
  padding: 1rem 1rem calc(1rem + var(--ion-safe-area-bottom)) 1rem;
}

.next-buttons{
}

.title-container{
  margin-bottom: 1rem;
  text-align: center;

  .title-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width:3rem;
    height:3rem;
    margin: auto;
    font-size: 1.5rem;
    border-radius: 1rem;
  }

  .subtitle{
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--ion-color-inria);
    text-transform: uppercase;
  }

  .title{
    font-size: 1.3rem;
    font-weight: bold;
  }

  &:after{
    content:'';
    display: block;
    width: 80px;
    height:4px;
    margin: 10px auto;
    border-radius: 2px;
    background: var(--ion-color-inria);
  }
}

.score{
  text-align: center;

  &-points-assessment{
    font-size: 2rem;
    font-weight: bold;
  }

  &-points-total{
    font-size: .8rem;
    font-weight: bold;
    text-transform: uppercase;
    b{
      color: var(--ion-color-inria-grey);
    }
  }
}
</style>
