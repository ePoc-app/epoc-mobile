<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonReorderGroup,
  IonItem,
  IonLabel,
  IonReorder,
  IonIcon
} from '@ionic/vue';
import { ResponseItem, ReorderQuestion } from '@/types/contents/assessment';

const props = defineProps<{
  question: ReorderQuestion;
  disabled: boolean;
}>();

const emit = defineEmits(['userHasResponded']);

const responses = ref<ResponseItem[]>([]);

const arrayEquals = (a: any[], b: any[]) => {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
};

const shuffleArray = (array: ResponseItem[]) => {
  const newArray = [...array];
  do {
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
  } while (arrayEquals(array, newArray));
  return newArray;
};

onMounted(() => {
  responses.value = shuffleArray(props.question.responses);
});

const doReorder = (ev: CustomEvent) => {
  // The .complete() method performs the actual array move and returns the updated array
  responses.value = ev.detail.complete(responses.value);

  const answer = responses.value.map(r => r.value);
  emit('userHasResponded', answer);
};
</script>

<template>
  <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="disabled">
    <div
        class="item"
        v-for="(response, index) in responses"
        :key="response.value"
    >
      <span class="item-index">{{ index + 1 }}</span>

      <ion-item lines="none">
        <ion-label class="ion-text-wrap">
          {{ response.label }}
        </ion-label>

        <ion-reorder slot="end">
          <ion-icon src="/assets/icon/slider.svg"></ion-icon>
        </ion-reorder>
      </ion-item>
    </div>
  </ion-reorder-group>
</template>

<style scoped lang="scss">
div.item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: none !important;

  ion-item {
    flex-grow: 1;
    margin-left: .5rem;
    padding: .5rem 0 .5rem 1rem;
    border-radius: .5rem;
    box-shadow: 0 1px 7px 0 var(--ion-color-reader-action-shadow-2);
    background: var(--ion-color-contrast-3);
    --padding-start: 0;
    --min-height: 0;
    --background: var(--ion-color-contrast-3);

    ion-label {
      margin: .5rem .5rem .5rem 0;
    }

    ion-icon {
      color: var(--ion-color-text-2);
    }
  }
}

.item-index {
  width: 1.2rem;
  height: 1.2rem;
  padding-top: .1rem;
  font-size: .8rem;
  font-weight: bold;
  line-height: 1.2rem;
  text-align: center;
  border-radius: 1.2rem;
  background: var(--ion-color-contrast);
  flex-shrink: 0;
}

ion-reorder {
  padding: .5rem;
  margin-inline-start: 0;
  margin-inline-end: 0;
}
</style>