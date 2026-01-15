<script setup lang="ts">
import { MultipleChoiceQuestion } from '@/types/contents/assessment';
import { PropType } from 'vue';
import { chevronDownOutline } from 'ionicons/icons';
import { IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { alert, checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';



const props = defineProps({
    question: { type : Object as PropType<(MultipleChoiceQuestion)>, required: true},
    userResponses: {type: Object as PropType<(any[])>, required: true}
})


type CorrectionType = {correct: boolean, label: string, feedback?: string}
let correction : CorrectionType[] = []
let rightResponsesNb = 0;
let wrongResponsesNb = 0;
let missingResponses : {label: string, feedback?: string}[] = [];

props.question.responses.forEach((response, index) => {
    if ((props.question.correctResponse).indexOf(response.value) !== -1) {
        if (props.userResponses.indexOf(response.value) !== -1) {
            correction.push({correct:true, label: response.label, feedback: response.feedback});
            rightResponsesNb++;
        } else{
            missingResponses.push({label: response.label, feedback: response.feedback})
        }
    } else {
    if (props.userResponses.indexOf(response.value) !== -1) {
        correction.push({correct:false, label: response.label, feedback: response.feedback});
        wrongResponsesNb++;
    }
    }
});


</script>

<template>
<div  v-if="correction">
  <div class="correction-specs">
    <div class="correction-spec">
      <div class="correction-spec-icon"><ion-icon aria-hidden="true" :icon="checkmarkOutline"></ion-icon></div>
      <div class="correction-spec-value">{{rightResponsesNb}} {{$t('QUESTION.CORRECTION.CORRECT_ANSWERS', rightResponsesNb)}}</div>
    </div>
    <div class="correction-spec">
      <div class="correction-spec-icon"><ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon></div>
      <div class="correction-spec-value">{{wrongResponsesNb}} {{$t('QUESTION.CORRECTION.WRONG_ANSWERS', wrongResponsesNb)}}</div>
    </div>
    <div class="correction-spec" v-if="missingResponses && missingResponses.length">
      <div class="correction-spec-icon"><ion-icon aria-hidden="true" :icon="warningOutline"></ion-icon></div>
      <div class="correction-spec-value">{{missingResponses.length}} {{$t('QUESTION.CORRECTION.OMISSION', missingResponses.length)}}</div>
    </div>
  </div>
  <h4>{{$t('QUESTION.CORRECTION.RESPONDED')}}</h4>
  <ion-item lines="none" v-for="response of correction">
    <div class="correction-icon correct" v-if="response.correct"><ion-icon aria-hidden="true" :icon="checkmarkOutline"></ion-icon></div>
    <div class="correction-icon incorrect" v-if="!response.correct"><ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon></div>
    <ion-label class="ion-text-wrap" color="inria-icon">
      {{response.label}}
      <div class="correction-right" v-if="response.correct">{{$t('QUESTION.CORRECTION.TRUE')}}</div>
      <div class="correction-wrong" v-if="!response.correct">{{$t('QUESTION.CORRECTION.FALSE')}}</div>
      <details :open="!response.correct" v-if="response.feedback">
        <summary>{{$t('QUESTION.PREVIEW.EXPLANATION')}} <ion-icon :icon="chevronDownOutline"></ion-icon></summary>
        <div>{{response.feedback}}</div>
      </details>
    </ion-label>
  </ion-item>
</div>
<div v-if="missingResponses && missingResponses.length">
  <h4>{{$t('QUESTION.CORRECTION.FORGOTTEN')}}</h4>
  <ion-item lines="none" v-for="response of missingResponses">
    <div class="correction-icon">
      <ion-icon aria-hidden="true" :icon="alert"></ion-icon>
    </div>
    <ion-label class="ion-text-wrap" color="inria-icon">
      {{response.label}}
      <div class="correction-missing">{{$t('QUESTION.CORRECTION.WAS_TRUE')}}</div>
      <details open v-if="response.feedback">
        <summary>{{$t('QUESTION.PREVIEW.EXPLANATION')}} <ion-icon :icon="chevronDownOutline"></ion-icon></summary>
        <div>{{response.feedback}}</div>
      </details>
    </ion-label>
  </ion-item>
</div>
</template>

<style scoped lang="scss">
@use '@/theme/correction.scss';
ion-item {
    --background: var(--ion-color-contrast-2);
}
</style>
