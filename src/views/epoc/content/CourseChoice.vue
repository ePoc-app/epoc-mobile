<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { ChoiceCondition } from '@epoc/epoc-types/dist/v1';
import { Content } from '@/types/contents/content';
import { useReadingStore } from '@/stores/readingStore';
import {trackEvent} from '@/utils/matomo';

const props = defineProps<{
  content: Content;
  epocId: string;
}>();

const emit = defineEmits(['chosen']);

const readingStore = useReadingStore();
const { readings } = storeToRefs(readingStore);

const resolver = computed(() => (props.content as any).conditionResolver);
const reading = computed(() => readings.value.find((item) => item.epocId === props.epocId));
const answer = computed(() => {
  const choice = reading.value?.choices?.find((c) => c.id === props.content.id);
  return choice ? choice.responses : null;
});

const selectAnswer = (selectedAnswer: any) => {
  const choiceCondition = props.content as unknown as ChoiceCondition;

  const flags = choiceCondition.conditionResolver.conditionalFlag.find(
      condition => condition.value === selectedAnswer
  )?.flags || [];

  const flagsToRemove = choiceCondition.conditionResolver.conditionalFlag.reduce(
      (acc, condition) => acc.concat(condition.flags), [] as string[]
  );

  trackEvent(props.epocId, `${props.epocId} / CourseChoice chosen ${props.content.id} ${props.content?.title} / Selected answer : ${selectedAnswer}`);

  readingStore.saveChoices(
      props.epocId,
      props.content.id,
      selectedAnswer,
      flags,
      flagsToRemove
  );

  setTimeout(() => {
    emit('chosen');
  }, 200);
};
</script>

<template>
  <div v-if="resolver" class="container">
    <div class="statement">
      <b>{{ resolver.label }}</b>
    </div>

    <div class="choices">
      <button
          v-for="choice in resolver.choices"
          :key="choice.value"
          :class="{ 'selected': choice.value === answer }"
          @click="selectAnswer(choice.value)"
      >
        {{ choice.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.statement {
  margin: 2rem 0;
  text-align: center;
  b {
    line-height: 1;
  }
}

.choices {
  button {
    display: block;
    width: 100%;
    margin-top: 1em;
    padding: 1em;
    background: var(--ion-color-content);
    font-weight: bold;
    color: var(--ion-color-text);
    border-radius: 4px;
    border: 1px solid var(--ion-color-text);
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &.selected {
      color: var(--ion-color-content);
      background: var(--ion-color-text);
    }

    &:active {
      opacity: 0.7;
    }
  }
}
</style>