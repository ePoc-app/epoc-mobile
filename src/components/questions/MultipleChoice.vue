<script setup lang="ts">
import { MultipleChoiceQuestion } from '@/types/contents/assessment';
import { PropType, ref } from 'vue';
import { IonItem, IonCheckbox, IonLabel, IonList } from '@ionic/vue';

const props = defineProps({
    question: { type : Object as PropType<(MultipleChoiceQuestion)>, required: true},
    disabled: Boolean,
    userPreviousResponse: Array<String>,
})

const emits = defineEmits<{
  userHasResponded: [userResponses: any[]]; 
}>()

const selectedAnswers = ref<any[]>((props.userPreviousResponse && props.userPreviousResponse.length > 0) ? props.userPreviousResponse : []);

const selectAnswer = (answer: any) => {
    const index = selectedAnswers.value.indexOf(answer.detail.value);
    if (answer.detail.checked && index === -1) {
        selectedAnswers.value.push(answer.detail.value);
    } else {
        if (index >= 0) {
            selectedAnswers.value.splice(index, 1);
        }
    }
    emits('userHasResponded', selectedAnswers.value);
}
</script>

<template>
<ion-list>
  <ion-item v-for="response of question.responses" lines="none">
    <ion-checkbox mode="md" slot="start" :value="response.value" @ionChange="selectAnswer"
                  :checked="selectedAnswers.indexOf(response.value) !== -1" :disabled="disabled">
    </ion-checkbox>
    <ion-label class="ion-text-wrap">{{response.label}}</ion-label>
  </ion-item>
</ion-list>
</template>

<style>
</style>
