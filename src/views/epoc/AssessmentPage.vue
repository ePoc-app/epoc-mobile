<script setup lang="ts">

import { Assessment, AssessmentData, SimpleQuestion, emptyAssessmentData } from '@/types/contents/assessment';
import { useEpocStore } from '@/stores/epocStore';
import { IonIcon, IonButton, IonContent, IonFooter, IonPage } from '@ionic/vue';
import { appService } from '@/utils/appService';
import CertificateModal from '@/components/CertificateModal.vue';
import { Epoc } from '@/types/epoc';
import { useReadingStore } from '@/stores/readingStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { alertController, onIonViewDidEnter, onIonViewWillEnter } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperObject } from 'swiper/types';
import { denormalize } from '@/utils/pipes';
import { useTemplateRefsList } from '@vueuse/core';
import Card from '@/components/Card.vue';
import CommonQuestion from '@/components/questions/CommonQuestion.vue';
import ScoreProgress from '@/components/ScoreProgress.vue';

const { t } = useI18n();
type CommonQuestionType = InstanceType<typeof CommonQuestion>
// TODO IL FAUT TRADUIRE LE SIMPLE CHOICE POUR RENDRE FONCTIONNEL LE COMMON QUESTION

//Store
const epocStore = useEpocStore()
const readingStore = useReadingStore()
const settingsStore = useSettingsStore()       
const router = useRouter();
const route = useRoute();

// params
const epocId = ref<string>(route.params.epocId.toString())
const assessmentId = ref<string>(route.params.assessmentId.toString())

// # ref
const { epoc } = storeToRefs(epocStore)
const { settings } = storeToRefs(settingsStore)
const { readings } = storeToRefs(readingStore)

const questionsElement = useTemplateRefsList<CommonQuestionType>()

const userScore = ref(0);
const userResponses = ref<string[]>([]);
const assessmentData = ref<AssessmentData>(emptyAssessmentData);
const currentQuestionUserResponse = ref<string>();
const correctionShown = ref(false);
const currentQuestion = ref(0);
const isEnd = ref(false);
const certificateShown = ref(false)
const questionSlides = ref<SwiperObject>() //undefined; // will be set only once on mounted 



// Computed
const reading = computed(() => readings.value.find(question => question.epocId === epoc.value.id))
const assessments = computed(() : (Assessment|SimpleQuestion)[] => epoc.value.assessments)
const assessment = computed(() : (Assessment|SimpleQuestion) => epoc.value.contents[assessmentId.value] as Assessment)

const questions = computed(() => assessment.value?.questions?.map(questionId => epoc.value.questions[questionId]) || [])
const scoreMax = computed(() => epocStore.calcScoreTotal(epoc.value, assessment.value.questions || []))

// setup process
if (!reading) readingStore.addReading(epocId.value);
readingStore.saveStatement(epocId.value, 'contents', assessmentId.value, 'started', true);

// Lifecycle

onIonViewWillEnter(() => {
  retry();
})

onIonViewDidEnter(() => {
  updateFocus();
  // @ts-ignore
  const allowTouch = !!window.isPreviewWindow;
  setTimeout(() => {
    if  (questionSlides.value) {
      questionSlides.value.allowTouchMove = allowTouch;
    }
  }, 100);
})

// Methods

// called only once, automatically done by the swiper event 
const setSwiperRef = (swiper : SwiperObject) => {
    questionSlides.value = swiper
}


const retry = () => {
  userScore.value = 0;
  userResponses.value = [];
  assessmentData.value = emptyAssessmentData;
  currentQuestionUserResponse.value = undefined;
  correctionShown.value = false;
  currentQuestion.value = 0;
  questionSlides.value?.slideTo(0);
  isEnd.value = false;
}

const onUserHasResponded = (userResponses: any) => {
    currentQuestionUserResponse.value = userResponses;
// TODO should be automatic, to remove if no use found    this.ref.detectChanges();
}

const checkAnswer = () => {
    const question = (questions.value) ? questions.value[currentQuestion.value] : undefined
    const response = currentQuestionUserResponse.value
    if (question && response) {
        const userSucceeded = epocStore.isUserResponsesCorrect(
            question.correctResponse,
            currentQuestionUserResponse.value
        );
        const score = userSucceeded ? +question.score : 0;
        correctionShown.value = true;
        questionsElement.value.toArray()[currentQuestion.value].showCorrection();
        userScore.value += score;
        userResponses.value.push(response);
        // TODO Tracker tracker.trackEvent('Assessments', 'Answered', `Answered ${epocId.value} ${assessmentId.value} ${currentQuestion.value}`, score);
        if (assessment.value && assessment.value.questions ) {
            readingStore.saveStatement(epocId.value, 'questions', assessment.value.questions[currentQuestion.value], 'attempted', true);
            readingStore.saveStatement(epocId.value, 'questions', assessment.value.questions[currentQuestion.value], 'scored', score);
            readingStore.saveStatement(epocId.value, 'questions', assessment.value.questions[currentQuestion.value], 'passed', userSucceeded);
        }
    }
}

const nextQuestion = () => {
    currentQuestionUserResponse.value = undefined;
    correctionShown.value = false;
    currentQuestion.value++;
    if (currentQuestion.value >= questions.value.length) {
        setAssessmentsData();
        readingStore.saveResponses(epocId.value, assessmentId.value, userScore.value, userResponses.value);
        isEnd.value = true;
        readingStore.saveStatement(epocId.value, 'contents', assessmentId.value, 'completed', true);
        readingStore.saveStatement(epocId.value, 'contents', assessmentId.value, 'scored', userScore.value);
    }
    questionSlides.value?.slideNext();
    setTimeout(() => {
        updateFocus();
    }, 1000);
}

const setAssessmentsData = () => {
    // TODO Tracker this.tracker.trackEvent('Assessments', 'Done', `Answered ${epocId.value} ${assessment.valueId}`, this.userScore);
    assessmentData.value = {
        userScore: userScore.value,
        totalUserScore: 0,
        totalScore: 0
    };

    assessments.value.forEach((assessment : Assessment | SimpleQuestion) => {
        if (assessment.id !== assessmentId.value) {
            const userAssessment = reading.value?.assessments.find(a => assessment.id === a.id);
            if (userAssessment && userAssessment.score > 0) {
                assessmentData.value.totalUserScore += userAssessment.score;
            }
        }
        assessmentData.value.totalScore += assessment.scoreTotal || 0
    });
    if (assessmentData.value.totalUserScore + assessmentData.value?.userScore >= epoc.value.certificateScore 
        && reading.value?.badges.length || 0 >= epoc.value.certificateBadgeCount) {
        setTimeout(() => {
            showCertificateCard();
        }, 1500);
    }
}

const showCertificateCard = () => {
    if (!reading.value?.certificateShown) {
        certificateShown.value = true;
        readingStore.updateCertificateShown(epoc.value.id, true);
    }
}

const back = () => {
  presentAlertConfirm()
}

const presentAlertConfirm = async () => {
    const alert = await alertController.create({
        header: t('QUESTION.QUIT_MODAL.HEADER'),
        message: t('QUESTION.QUIT_MODAL.MSG'),
        buttons: [
            {
                text: t('QUESTION.QUIT_MODAL.STAY'),
                role: 'cancel'
            },
            {
                text: t('QUESTION.QUIT_MODAL.QUIT'),
                handler: () => {
                    router.back()
                    // TODO test in situ
                    // navigateBack(
                    //    '/epoc/play/' + epoc.value.id + '/' + assessment.value.chapterId + '/content/' + assessment.valueId
                    //);
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
<ion-content :scrollY="false" v-if="assessment">
    <div class="slider-wrapper assessment-reader" slot="fixed" tabindex="1">
        <swiper @swiper="setSwiperRef" class="slider assessment-swiper" :allow-touch-move=false>
            <template v-for="(question, questionIndex) in denormalize(assessment.questions, epoc.questions)">
                <swiper-slide>
                    <common-question :aria-hidden="questionIndex !== currentQuestion" :closable=true 
                        :subtitle="'Question '+(questionIndex+1)+'/'+assessment.questions?.length" :contentId="assessment.id"
                         :epocId="epocId" :question="question" 
                         @userHasResponded="onUserHasResponded($event)" videos youtube,
                         @close="back()" 
                         :ref="questionsElement.set"
                         v-if="!isEnd">
                    </common-question>
                </swiper-slide>
            </template>
            <swiper-slide class="assessment-end">
                <card v-if="assessmentData">
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
                            <score-progress :progress="assessmentData.totalUserScore / assessmentData.totalScore * 100"
                                            :delta="assessmentData.userScore / assessmentData.totalScore * 100"
                                            :threshold="epoc.certificateScore / assessmentData.totalScore * 100"
                                            :minLabel="'0'"
                                            :maxLabel="assessmentData.totalScore">
                            </score-progress>
                        </div>
                    </div>
                    <ion-button size="large" expand="block" color="outline-button" fill="outline" (click)="retry()">
                        <span>{{$t('QUESTION.ASSESSMENT_PAGE.RESTART_ACTIVITY')}}</span>
                    </ion-button>
                </card>
            </swiper-slide>
        </swiper>
    </div>
    <certificate-modal :epocId="epocId" :certificateShown="certificateShown"></certificate-modal>
</ion-content>

<ion-footer v-if="!isEnd">
    <ion-button size="large" expand="block" color="inria" :disabled="!currentQuestionUserResponse" v-on:click="checkAnswer();" v-if="!correctionShown">
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
