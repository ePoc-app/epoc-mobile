<script setup lang="ts">
import { Assessment, Question, SimpleQuestion } from '@/types/contents/assessment';
import { computed, PropType, ref, useTemplateRef, watch } from 'vue';
import { appService } from '@/utils/appService';
import FlipCard from '../FlipCard.vue';
import { removeSecableSpace, srcConvert } from '@/utils/pipes';
import { useEpocStore } from '@/stores/epocStore';
import SimpleChoice from './SimpleChoice.vue';
const epocStore = useEpocStore()

const props = defineProps({
  question: {
    type : Object as PropType<(Question)>,
    required: true
  },
  closable: {
    type : Boolean,
    required: true
  },
  contentId: {
    type : String,
    required: true
  },
  epocId: {
    type : String,
    required: true
  },
  title: {
    type : String,
    required: true
  },
  subtitle: {
    type : String,
    required: true
  },
  icon: {
    type : String,
    required: true
  },
})

const emits = defineEmits<{
  userHasResponded: [id: number]; // named tuple syntax
  questionAnswered: [value: boolean];
  dragging: [event: Event];
  close: [value: boolean];
}>()

type FlipCardType = InstanceType<typeof FlipCard>
const flipCardComponent = useTemplateRef<FlipCardType>('flip-card')
const userAssessment = ref<(Assessment|SimpleQuestion)>()
const questionDisabled = ref(userAssessment.value ? true : false);
const userResponses = ref(userAssessment.value && Object.hasOwn(userAssessment.value, 'responses')  ? userAssessment.value['responses'] as String[] : undefined);
const flipped = ref(userAssessment.value ? true : false);

watch(userAssessment, (newUserAssessment) => {
  if (userAssessment) {
    emits('questionAnswered', true)
  }
  else {
    emits('questionAnswered', true)
  }
})

const flip = (event?) => {
  if (event && (['SUMMARY'].indexOf(event.target.tagName) !== -1 || event.target.closest('a'))) return;
  if (questionDisabled.value) {
    flipCardComponent.value?.flip();
    flipped.value = flipCardComponent.value?.flipped || false;
    updateFocus();
  }
  setTimeout(() => {
    updateFocus();
  }, 600);
}

const updateUserResponse = (userResponse: Event) => {
  //userResponses.value = userResponse;
}

const onDrag= (value: Event) => {
    emits('dragging',value);
  }

const back = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    emits('close', true)
  }

const updateFocus = () => {
    if(appService.screenReaderDetected) {
      (document.querySelector('app-epoc-assessment .assessment-reader') as HTMLElement).focus();
    }
  }

</script>

<template>
<flip-card :initFlipped="flipped" v-on:click="flip($event)" ref="flip-card">
  <template front>
    <div :aria-hidden="flipped">
      <div class="title-container">
        <div class="title-icon" v-if="icon">
          <ion-icon aria-hidden="true" :icon="icon"></ion-icon>
        </div>
        <h5 class="subtitle" v-if="subtitle">{{removeSecableSpace(subtitle)}}</h5>
        <h4 class="title" v-if="title">{{removeSecableSpace(subtitle)}} {{+question.score ? '(' + question.score + 'pts)' : ''}}</h4>
      </div>
      <div role="button" aria-label="Fermer" class="close" v-if="closable" v-on:click="back($event)">
        <ion-icon aria-hidden="true" name="close-outline"></ion-icon>
      </div>
      <div class="statement ion-text-center">
        <b>{{removeSecableSpace(question.label)}}</b>
        <div v-if="question.statement && !['swipe', 'drag-and-drop'].includes(question.type)" :innerHTML="srcConvert(removeSecableSpace(question.statement), epocStore.rootFolder)"></div>
      </div>
      <div class="question">
        <simple-choice v-if="question.type === 'choice' && question.responses.length > 0" :question="question" :userPreviousResponse="userResponses" :disabled="questionDisabled" @userResponse="updateUserResponse($event)"></simple-choice>
      </div>
      <ng-content></ng-content>
    </div>
  </template>
  <template back>
    <div class="correction" v-if="flipped && question.responses.length > 0">
      <div class="title-container">
        <div class="title-icon">
          <ion-icon aria-hidden="true" name="checkmark-circle-outline"></ion-icon>
        </div>
        <h5 class="subtitle">{{$t('QUESTION.PREVIEW.RESPONSES')}}</h5>
      </div>
      <div :aria-hidden="!flipped" role="button" aria-label="Fermer" class="close" v-if="closable" v-on:click="back($event)">
        <ion-icon aria-hidden="true" name="close-outline"></ion-icon>
      </div>
      <div class="statement ion-text-center">
        <b>{{question.label}}</b>
      </div>
      <template>
        <correction-simple-choice v-if="question.type == 'choice'" :question="question" :userResponses="userResponses"></correction-simple-choice>
        <correction-multiple-choice v-else-if="question.type == 'multiple-choice'" :question="question" :userResponses="userResponses"></correction-multiple-choice>
        <correction-reorder v-else-if="question.type =='reorder'" :question="question" :userResponses="userResponses"></correction-reorder>
        <correction-sort v-else-if="['dropdown-list', 'swipe', 'drag-and-drop'].includes(question.type)" :question="question" :userResponses="userResponses"></correction-sort>
        <correction-generic v-else :question="question" :userResponses="userResponses"></correction-generic>
      </template>
      <div class="explanation" v-if="question.feedback">
        <h4>{{$t('QUESTION.PREVIEW.EXPLANATION')}}</h4>
        <html-content :html="srcConvert(question.feedback, epocStore.rootFolder)"></html-content>
      </div>
    </div>
  </template>
</flip-card>

</template>

<style scoped>
:host{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width:100%;
  overflow: hidden;
}

.header{
  background: var(--ion-color-content);
  box-shadow: 0 6px 14px 0 var(--ion-color-shadow);
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s ease-in-out 0s;
  .correction-tabs{
    display: flex;
    padding: 1rem .5rem;
    .correction-tab {
      flex: 1 1 0;
      padding: .2rem;
      margin: 0 .5rem;
      text-align: center;
      background: var(--ion-color-unique-1);
      color: var(--ion-color-text);
      border-radius: 1em;
      font-size: .875rem;
      text-transform: uppercase;

      span{
        display: inline-block;
        font-weight: bold;
        padding-top: .1em;
      }

      &.selected{
        color: var(--ion-color-contrast-3);
        background: var(--ion-color-correction-selected);
      }
    }
  }

  &.shown{
    max-height: 4rem;
    transition: max-height .3s ease-in-out .6s;
  }
}

.close{
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top:1rem;
  right:1rem;
  width:1.8rem;
  height:1.8rem;
  z-index: 10;
  background: var(--ion-color-contrast);
  border-radius: 2rem;
  --ionicon-stroke-width: 64px;
  color: var(--ion-color-text-button);
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
     margin: 0 auto 1rem auto;
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
     margin: .5rem 0 1rem 0;
     font-size: 1.3rem;
     font-weight: bold;

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
 }

.statement{
  b{
    display: block;
    margin-bottom: 1rem;
  }

  div{
    color: var(--ion-color-inria-grey);
    font-size: 0.875rem;
  }
}

.question{
  margin-bottom: 2rem;
}

.explanation{
  color: var(--ion-color-text-2);
  font-size: 14px;
  h4{
    font-size: 1rem;
    font-weight: bold;
    color: var(--ion-color-text-2);
    text-transform: uppercase;
  }
}
</style>