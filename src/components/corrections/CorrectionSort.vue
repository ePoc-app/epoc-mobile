<script setup lang="ts">
import { checkmarkOutline, closeOutline, chevronDownOutline } from 'ionicons/icons';
import { Question } from '@/types/contents/assessment';
import { PropType } from 'vue';
import { IonIcon, IonItem, IonLabel } from '@ionic/vue';

const props = defineProps({
    question: { type : Object as PropType<(Question)>, required: true},
    userResponses: {type: Object as PropType<(any[])>, required: true}
})

type CorrectionType = {correct: boolean, label: string, correctResponse: string, feedback: string}[][]
let rightResponsesNb = 0;
let wrongResponsesNb = 0;
const sortGroups = props.question.correctResponse.map((zone) => zone.label);

const correction: CorrectionType = props.userResponses.map((group, groupIndex) => {
    return group.map((response : any) => {
        const correct = props.question.correctResponse[groupIndex].values.indexOf(response.value) !== -1;
        correct ? rightResponsesNb++ : wrongResponsesNb++;
        return {
            correct,
            label: response.label,
            correctResponse: props.question.correctResponse.find(correctGroup => correctGroup.values.indexOf(response.value) !== -1)?.label,
            feedback: props?.question.responses.find(r => r.value === response.value)?.feedback
        }
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
    <div class="sort-group" v-for="(sortGroup, index) of sortGroups">
        <div class="sort-group-label">{{sortGroup}}</div>
        <ion-item lines="none" v-for="response of correction[index]">
            <div class="correction-icon correct" v-if="response.correct">
                <ion-icon aria-hidden="true" :icon="checkmarkOutline"></ion-icon>
            </div>
            <div class="correction-icon incorrect" v-if="!response.correct">
                <ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon>
            </div>
            <ion-label class="ion-text-wrap" color="inria-blue">
                {{response.label}}
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
    text-transform: uppercase;
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
