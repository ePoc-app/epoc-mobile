<script setup lang="ts">
import { Question } from '@/types/contents/assessment';
import { PropType, ref } from 'vue';
import { IonIcon, IonLabel, IonItem } from '@ionic/vue';
import { chevronDownOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';

const props = defineProps({
  question: { type : Object as PropType<(Question)>, required: true},
  userResponses: { type : Object as PropType<(any[])>, required: true },
})

interface Correction { correct: boolean, userResponseLabel?: string, feedback?: string, correctResponse?: string }

let correction : Correction[] = [];
props.userResponses.forEach((userResponse, index) => {
    correction.push({
        correct: props.question.correctResponse.indexOf(userResponse) !== -1,
        userResponseLabel: props.question.responses.find(response => response.value === userResponse)?.label,
        feedback: props.question.responses.find(response => response.value === userResponse)?.feedback,
        correctResponse: props.question.responses.find(response => response.value === props.question.correctResponse[index])?.label
    })
})
</script>

<template>
<div v-if="correction">
  <h4>{{$t('QUESTION.CORRECTION.RESPONDED')}}</h4>
  <ion-item lines="none" v-for="response of correction">
    <div class="correction-icon correct" v-if="response.correct">
      <ion-icon aria-hidden="true" :icon="checkmarkOutline"></ion-icon>
    </div>
    <div class="correction-icon incorrect" v-if="!response.correct">
      <ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon>
    </div>
    <ion-label class="ion-text-wrap" color="inria-icon">
      {{response.userResponseLabel}}
      <div class="correction-right" v-if="response.correct">{{$t('QUESTION.CORRECTION.TRUE')}}</div>
      <div class="correction-wrong" v-if="!response.correct">{{$t('QUESTION.CORRECTION.FALSE')}}</div>
      <div class="correction-right-answer" v-if="!response.correct">
        <b>{{$t('QUESTION.CORRECTION.CORRECT')}}</b><span>{{response.correctResponse}}</span>
      </div>
      <details :open="!response.correct" v-if="response.feedback">
        <summary>{{$t('QUESTION.PREVIEW.EXPLANATION')}} 
          <ion-icon :icon="chevronDownOutline"></ion-icon>
        </summary>
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
