<script setup lang="ts">
import { Question } from '@/types/contents/assessment';
import { onMounted, PropType, ref, useTemplateRef } from 'vue';
import { appService } from '@/utils/appService';
import FlipCard from '../FlipCard.vue';
import { removeSecableSpace, srcConvert } from '@/utils/pipes';
import { useEpocStore } from '@/stores/epocStore';
import SimpleChoice from './SimpleChoice.vue';
import { IonIcon } from '@ionic/vue';
import HtmlContent from '@/views/epoc/content/HtmlContent.vue';
import CorrectionSimpleChoice from '../corrections/CorrectionSimpleChoice.vue';
import { UserAssessment } from '@/types/reading';
import { checkmarkCircleOutline, closeOutline } from 'ionicons/icons';
import MultipleChoice from './MultipleChoice.vue';
import DragAndDrop from './DragAndDrop.vue';
import DropdownList from './DropdownList.vue';
import Reorder from './Reorder.vue';
import Swipe from './Swipe.vue';
import CorrectionMultipleChoice from '../corrections/CorrectionMultipleChoice.vue';
import CorrectionReorder from '../corrections/CorrectionReorder.vue';
import CorrectionSort from '../corrections/CorrectionSort.vue';
import CustomQuestion from './CustomQuestion.vue';
import CorrectionGeneric from '../corrections/CorrectionGeneric.vue';
import { SwipeQuestion, SimpleChoiceQuestion } from '@/types/contents/assessment';
import { MultipleChoiceQuestion } from '@/types/contents/assessment';

const epocStore = useEpocStore()

const props = defineProps({
  question: { type : Object as PropType<(Question)>, required: true},
  closable: { type : Boolean },
  contentId: { type : String }, // TODO not used aywhere ?
  epocId: { type : String, required: true },
  userAssessment: {type: UserAssessment},
  title: String ,
  subtitle: String,
  icon: String,
})

const emits = defineEmits<{
  userHasResponded: [userResponses: any[]]; 
  dragging: [event: Event];
  close: [value: boolean];
}>()

type FlipCardType = InstanceType<typeof FlipCard>
const flipCardComponent = useTemplateRef<FlipCardType>('flip-card')
const questionDisabled = ref(props.userAssessment ? true : false);
const userResponses = ref(props.userAssessment && Object.hasOwn(props.userAssessment, 'responses')  ? props.userAssessment.responses as String[] : []);
const flipped = ref(props.userAssessment ? true : false);

const flip = (event?: any) => {
  // TODO Check usage of this line, is it dead code ?
  console.log(flipCardComponent.value ? "cmpt ok" : "cmpt dead")
  if (event && (['SUMMARY'].indexOf(event.target.tagName) !== -1 || event.target.closest('a'))) return;
  if (questionDisabled.value) {
    flipCardComponent.value!.flip();
    flipped.value = flipCardComponent.value!.flipped || false;
    updateFocus();
  }
  setTimeout(() => {
    updateFocus();
  }, 600);
}

const updateUserResponse = (_userResponse: any[]) => {
  userResponses.value = _userResponse;
  emits('userHasResponded', _userResponse)
}

const onDrag= (value: Event) => {
    emits('dragging',value);
  }

const back = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    emits('close', true)
  }

// TODO Check if this work as intended ?
const updateFocus = () => {
    if(appService.screenReaderDetected) {
      (document.querySelector('app-epoc-assessment .assessment-reader') as HTMLElement).focus();
    }
  }

const showCorrection = () =>  {
  console.log(userResponses.value)
  console.log(flipCardComponent.value ? "cmpt ok" : "cmpt dead")
  questionDisabled.value = true;
  flip();
}

defineExpose({
  showCorrection
})
</script>

<template>
<flip-card :initFlipped="flipped" v-on:click="flip($event)" ref="flip-card">
  <template v-slot:front>
    flipcard is  {{flipCardComponent ? "ok" : "not ok"}}
    <div :aria-hidden="flipped">
      <div class="title-container">
        <div class="title-icon" v-if="icon">
          <ion-icon aria-hidden="true" :icon="icon"></ion-icon>
        </div>
        <h5 class="subtitle" v-if="subtitle">{{removeSecableSpace(subtitle)}}</h5>
        <h4 class="title" v-if="title">{{removeSecableSpace(title)}} {{+question.score ? '(' + question.score + 'pts)' : ''}}</h4>
      </div>
      <div role="button" aria-label="Fermer" class="close" v-if="closable" v-on:click="back($event)">
        <ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon>
      </div>
      <div class="statement ion-text-center">
        <b>{{removeSecableSpace(question.label)}}</b>
        <div v-if="question.statement && !['swipe', 'drag-and-drop'].includes(question.type)" :innerHTML="srcConvert(removeSecableSpace(question.statement), epocStore.rootFolder)"></div>
      </div>
      <div class="question">
        <simple-choice v-if="question.type === 'choice' && question.responses.length > 0" :question="question as SimpleChoiceQuestion" :userPreviousResponse="userResponses" :disabled="questionDisabled"@userHasResponded="updateUserResponse"></simple-choice>
        <multiple-choice v-if="question.type === 'multiple-choice'" :question="question as MultipleChoiceQuestion" :userPreviousResponse="userResponses" :disabled="questionDisabled"@userHasResponded="updateUserResponse($event)"></multiple-choice>
        <reorder v-if="question.type === 'reorder'" :question="question" :disabled="questionDisabled"@userHasResponded="updateUserResponse($event)"></reorder>
        <drag-and-drop v-if="question.type === 'drag-and-drop'" :question="question" :userPreviousResponse="userResponses" :disabled="questionDisabled" @dragging="onDrag($event)"@userHasResponded="updateUserResponse($event)"></drag-and-drop>
        <swipe v-if="question.type === 'swipe'" :question="question as SwipeQuestion" :userPreviousResponse="userResponses"  :disabled="questionDisabled" @userHasResponded="updateUserResponse"></swipe>
        <dropdown-list v-if="question.type === 'dropdown-list'" :question="question" :disabled="questionDisabled"@userHasResponded="updateUserResponse($event)"></dropdown-list>
        <custom-question v-if="question.type === 'custom'" :question="question" :userPreviousResponse="userResponses" :disabled="questionDisabled"@userHasResponded="updateUserResponse($event)"></custom-question>
      </div>
    </div>
    <slot></slot>
  </template>
  <template v-slot:back>
    <div class="correction" v-if="flipped && question.responses.length > 0">
      <div class="title-container">
        <div class="title-icon">
          <ion-icon aria-hidden="true" :icon="checkmarkCircleOutline"></ion-icon>
        </div>
        <h5 class="subtitle">{{$t('QUESTION.PREVIEW.RESPONSES')}}</h5>
      </div>
      <div :aria-hidden="!flipped" role="button" aria-label="Fermer" class="close" v-if="closable" v-on:click="back($event)">
        <ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon>
      </div>
      <div class="statement ion-text-center">
        <b>{{question.label}}</b>
      </div>
      <div>
        <correction-simple-choice v-if="question.type == 'choice'" :question="question" :userResponses="userResponses"></correction-simple-choice>
        <correction-multiple-choice v-else-if="question.type == 'multiple-choice'" :question="question as MultipleChoiceQuestion" :userResponses="userResponses"></correction-multiple-choice>
        <correction-reorder v-else-if="question.type =='reorder'" :question="question" :userResponses="userResponses"></correction-reorder>
        <correction-sort v-else-if="['dropdown-list', 'swipe', 'drag-and-drop'].includes(question.type)" :question="question" :userResponses="userResponses"></correction-sort>
        <correction-generic v-else :question="question" :userResponses="userResponses"></correction-generic>
      </div>
      <div class="explanation" v-if="question.feedback || question.explanation">
        <h4>{{$t('QUESTION.PREVIEW.EXPLANATION')}}</h4>
        <html-content :html="srcConvert(question.feedback || question.explanation, epocStore.rootFolder)"></html-content>
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
     border-bottom: 0;
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