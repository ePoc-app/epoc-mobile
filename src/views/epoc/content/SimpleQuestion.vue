<script setup lang="ts">
import {ref} from 'vue';
import {Zip} from '@epoc/capacitor-zip';
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {FileTransfer} from '@capacitor/file-transfer';
import {useConvertFileSrc} from '@/composables/useConvertFileSrc';
import { useEpocStore } from '@/stores/epocStore';

  const epocStore = useEpocStore()
  // const readonlyTracker = Matomo TODO
 @Input() content: Content;
    @Input() question: Question;
    @Input() epocId: string;
    @Output() dragging = new EventEmitter<string>();

    @ViewChild(CommonQuestionComponent, { static: false })
    private questionComponent!: CommonQuestionComponent;

    reading: Reading;
    const userAssessment = ref();
    const questionAnswered = ref(false);
    const disableCheck = ref(true);
    userResponses = [];


    onBeforeMount(async () => {
      const id = route.params.id.toString();
      await epocStore.getEpocById(id);
      this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.epocId);
                this.userAssessment = this.reading.assessments.find(a => a.id === this.content.id);
            }
        });
    });

  const checkAnswer = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const userSucceeded = this.epocService.isUserResponsesCorrect(this.question.correctResponse, this.userResponses);
        const score = userSucceeded ? +this.question.score : 0;
        this.readingStore.saveResponses(this.epocId, this.content.id, score, this.userResponses);
        this.questionComponent.showCorrection();
        this.tracker.trackEvent('Assessments', 'Answered simple question', `Answered ${this.epocId} ${this.content.id}`, score);
        this.readingStore.saveStatement(this.epocId, 'questions', (this.content as SimpleQuestion).question, 'attempted', true);
        this.readingStore.saveStatement(this.epocId, 'questions', (this.content as SimpleQuestion).question, 'scored', score);
        this.readingStore.saveStatement(this.epocId, 'questions', (this.content as SimpleQuestion).question, 'passed', userSucceeded);
    }

  const onQuestionAnswered = (event) => {
        questionAnswered.value = event;
    }

  const onDrag = (value) => {
        dragging.emit(value);
    }

  const onUserHasResponded = (userResponses) => {
        userResponses.value = userResponses;
        disableCheck.value = false;
    }
</script>

<template>
  <common-question icon="help-circle-outline" :title="content.title" :subtitle="content.subtitle" :contentId="content.id"
                 :epocId="epocId" :question="question" :userAssessment="userAssessment"
                 :questionAnswered="onQuestionAnswered($event)"
                 :dragging="onDrag($event)" :userHasResponded="onUserHasResponded($event)">
  <ion-button v-if="!questionAnswered && question.responses.length > 0" :disabled="disableCheck" expand="block" size="large" color="inria" v-on:click="checkAnswer($event)">
    <span>{{$t('QUESTION.SIMPLE_QUESTION.VALIDATE')}}</span>
  </ion-button>
  <ion-button v-if="question.responses.length <= 0" expand="block" size="large" color="outline-button" fill="outline" v-on:click="checkAnswer($event)">
    <span>{{$t('QUESTION.SIMPLE_QUESTION.FINISH')}}</span>
  </ion-button>
</common-question>

</template>

<style>
@import "../../../colors";

.video-player{
  .video-container{
    position: relative;
    min-height: 210px;

    .poster{
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width:100%;
      top:0;
      left:0;
      bottom:0;
      right:0;
      background: var(--ion-color-inria-blue);

      .title{
        padding: 20px;
        color: white;
        text-align: center;
      }

      img{
        position: absolute;
        width:100%;
        height: auto;
        object-fit: cover;
      }
    }

    .video-play-overlay{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgba(var(--ion-color-inria-blue-rgb), 0.2);
      z-index: 1;
      font-size: 4rem;

      ion-icon, ion-spinner{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
      }
    }

    &.playing {
      .video-play-overlay{
        opacity: 0;
      }
    }

    .video-overlay-controls{
      position: absolute;
      bottom: 0;
      right:0;
      padding: 5px;
      z-index: 2;

      ion-icon{
        font-size: 20px;
        line-height: 1;
        color:white;
        cursor: pointer;
        filter: drop-shadow(0 0 2px var(--ion-color-inria-blue));
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }

  video{
    display: block;
    width: 100%;
    height: auto;
    margin:0;
    background:none;
  }

  .video-actions{
    display: flex;
    font-size: 25px;
    justify-content: space-between;
    padding: 16px;

    .video-action {
      position: relative;
      display: block;
      width:30px;
      height:30px;
      margin: 0;
      padding: 0;
      border-radius: 5px;
      background: var(--ion-color-contrast);
      color: var(--ion-color-inria);
      text-align: center;
      line-height: 35px;

      ion-icon {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &-left{
      display: flex;
      width: 30px;
    }
    &-center{
      display: flex;
      text-align: center;

      .video-action{
        margin: 0 5px;
      }
    }
    &-right{
      display: flex;
      width: 30px;
    }
  }

  .video-timeline{
    position: absolute;
    bottom: 0;
    left:0;
    width:100%;
    height: 10px;
    z-index: 2;


    &:before{
      content:'';
      display: block;
      position: absolute;
      bottom: 0;
      left:0;
      width:100%;
      height: 3px;
      background: rgba(var(--ion-color-inria-light-rgb), 0.5);
    }

    &-progress{
      position: absolute;
      bottom: 0;
      left:0;
      height: 3px;
      background: var(--ion-color-inria);
    }

    &-cursor{
      position: absolute;
      top: calc(50% + 3.5px);
      padding: 8px;
      z-index: 10;
      transform: translate(-50%, -50%);
      transform-origin: center center;
      opacity: 0;

      &:before{
        content:'';
        display: block;
        width: 13px;
        height:13px;
        border-radius: 50%;
        background: white;
        border: 1px solid var(--ion-color-light-shade);
      }
    }
  }
}

.hidden-select{
  display: none;
}

</style>
