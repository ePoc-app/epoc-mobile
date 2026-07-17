<script setup lang="ts">
import { checkmarkOutline, closeOutline, chevronDownOutline } from 'ionicons/icons';
import { Question } from '@/types/contents/assessment';
import { PropType } from 'vue';
import { IonIcon, IonItem, IonLabel } from '@ionic/vue';

const props = defineProps({
    question: { type : Object as PropType<(Question)>, required: true},
    userResponses: {type: Object as PropType<(any[])>, required: true}
})

type CorrectionType = {correct: boolean, label: string, selectedResponse: string,  correctResponse: string, feedback: string | undefined}[]
let rightResponsesNb = 0;
let wrongResponsesNb = 0;

let correction: CorrectionType = [];

props.question?.responses?.forEach(response => {
    const userResponse = props.userResponses.flat(Infinity).find(r => r.value === response.value);
    const correct = props.question.correctResponse[userResponse.category].values.indexOf(response.value) !== -1;
    correct ? rightResponsesNb++ : wrongResponsesNb++;
    correction.push({
        correct,
        label: response.label,
        selectedResponse: props.question.correctResponse[userResponse.category].label,
        correctResponse: props.question.correctResponse.find(correctGroup => correctGroup.values.indexOf(response.value) !== -1)?.label,
        feedback: props?.question.responses.find(r => r.value === response.value)?.feedback
    })
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
    </div>
    <h4>{{$t('QUESTION.CORRECTION.RESPONDED')}}</h4>
    <template  v-for="response of correction">
      <div class="sort-group">
        <div class="sort-group-label">"{{response.label}}"</div>
        <ion-item lines="none">
          <div class="correction-icon correct" v-if="response.correct">
            <ion-icon aria-hidden="true" :icon="checkmarkOutline"></ion-icon>
          </div>
          <div class="correction-icon incorrect" v-if="!response.correct">
            <ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon>
          </div>
          <ion-label class="ion-text-wrap" color="inria-blue">
            {{response.selectedResponse}}
            <div class="correction-right" v-if="response.correct">{{$t("QUESTION.CORRECTION.TRUE")}}</div>
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
    </div>
</template>

<style scoped lang="scss">
@use '@/theme/correction.scss';
.sort-group{
  padding:.5rem;
  margin-bottom: 1em;
  background: var(--ion-color-background);
  border: 1px solid var(--ion-color-contrast-2);
  border-radius: 10px;

  &:last-child{
    margin-bottom: 0;
  }

  .sort-group-label{
    flex-grow: 1;
    padding-top: .25em;
    margin-bottom: .5rem;
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--ion-color-text);
  }

  ion-item {
    --background: var(--ion-color-item);

    ion-label {
      color: var(--ion-color-label);
    }
  }
}
</style>
