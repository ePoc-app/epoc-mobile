<script setup lang="ts">
import { useEpocStore } from '@/stores/epocStore';
import { useReadingStore } from '@/stores/readingStore';
import CommonQuestion from '@/components/questions/CommonQuestion.vue';
import { Content } from '@/types/contents/content';
import { Reading } from '@/types/reading';
import { Question, SimpleQuestion } from '@/types/contents/assessment';
import { computed, onMounted, PropType, ref, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';
import { IonButton } from '@ionic/vue';
import { helpCircleOutline } from 'ionicons/icons';
const readingStore = useReadingStore()
const epocStore = useEpocStore()

const props = defineProps({
  content: { type : Object as PropType<(Content)>, required: true},
  question: {type: Object as PropType<Question>, required: true},
  epocId: {type: String, required: true}, 
})

const emits = defineEmits<{
  // TODO check typing of dragging: [id: string];
  dragging: [event: Event];
}>()

type CommonQuestionType = InstanceType<typeof CommonQuestion>
const commonQuestionCmpt = useTemplateRef<CommonQuestionType>('common-question')
const { readings } = storeToRefs(readingStore)
const questionAnswered = ref(false);
const disableCheck = ref(true);
const userResponses = ref<string[]>([]);

const reading = computed(() => readings.value.find(item => item.epocId === props.epocId))
const userAssessment = computed(() => (reading.value) ? reading.value.assessments.find(a => a.id === props.content.id) : undefined)

const checkAnswer = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  const userSucceeded = epocStore.isUserResponsesCorrect(props.question.correctResponse, userResponses.value)
  const score = userSucceeded ? + props.question.score : 0;
  readingStore.saveResponses(props.epocId, props.content.id, score, userResponses.value);
  readingStore.saveStatement(props.epocId, 'questions', (props.content as SimpleQuestion).question, 'attempted', true);
  readingStore.saveStatement(props.epocId, 'questions', (props.content as SimpleQuestion).question, 'scored', score);
  readingStore.saveStatement(props.epocId, 'questions', (props.content as SimpleQuestion).question, 'passed', userSucceeded);

  commonQuestionCmpt.value?.showCorrection();

}

const onQuestionAnswered = (value: boolean) => {
  questionAnswered.value = value;
}

const onDrag = (event: Event) => {
  emits('dragging', event);
}

const onUserHasResponded = (_userResponses: string[]) => {
  userResponses.value = _userResponses;
  disableCheck.value = false;
}

</script>

<template>
 
<common-question ref="common-question" :icon="helpCircleOutline" 
  :title="content.title" 
  :subtitle="content.subtitle" :contentId="content.id"
  :epocId="epocId" :question="question" :userAssessment="userAssessment"
  @questionAnswered="onQuestionAnswered" 
  @dragging="onDrag" 
  @userHasResponded="onUserHasResponded"
>
  <ion-button v-if="!questionAnswered && question.responses.length > 0" :disabled="disableCheck" expand="block" size="large" color="inria" @click="checkAnswer">
    <span>{{$t('QUESTION.SIMPLE_QUESTION.VALIDATE')}}</span>
  </ion-button>
  <ion-button v-if="question.responses.length <= 0" expand="block" size="large" color="outline-button" fill="outline" @click="checkAnswer">
    <span>{{$t('QUESTION.SIMPLE_QUESTION.FINISH')}}</span>
  </ion-button>
</common-question>

</template>

<style>
:host{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width:100%;
  overflow: hidden;
}

</style>
