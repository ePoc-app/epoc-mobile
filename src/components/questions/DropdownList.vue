<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { actionSheetController, IonIcon } from '@ionic/vue';
import { chevronDownOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';
import { Response } from '@epoc/epoc-types/dist/v1/question';
import { DropDownListQuestion, DropDownListResponseItem } from '@/types/contents/assessment';

const props = defineProps<{
  question: DropDownListQuestion;
  disabled: boolean;
}>();

const emit = defineEmits(['userHasResponded']);

const { t } = useI18n();
const selectChoices = ref<string[]>([]);
const userResponses = ref<DropDownListResponseItem[]>([]);

onMounted(() => {
  selectChoices.value = props.question.correctResponse.map((zone: {label: string, values: string[]}) => zone.label);

  userResponses.value = props.question.responses.map((response:Response) => ({
    label: response.label,
    value: response.value
  }));
});

// --- Methods ---
const selectCategory = (index: number, response: DropDownListResponseItem) => {
  response.category = index;

  const allAnswered = userResponses.value.every((r:DropDownListResponseItem) => Object.prototype.hasOwnProperty.call(r, 'category'));

  if (allAnswered) {
    const answers = selectChoices.value.map((_:string, idx:number) => {
      return userResponses.value.filter((r:DropDownListResponseItem) => r.category === idx);
    });
    emit('userHasResponded', answers);
  }
};

const openActionSheet = async (response: DropDownListResponseItem) => {
  if (props.disabled) return;

  const buttons = [
    ...selectChoices.value.map((category: string, index: number) => ({
      text: category,
      handler: () => {
        selectCategory(index, response);
      }
    })),
    {
      text: t('CANCEL'),
      role: 'cancel'
    }
  ];

  const actionSheet = await actionSheetController.create({
    mode: 'ios',
    header: t('QUESTION.DROPDOWN_INSTRUCTION'),
    cssClass: 'custom-action-sheet dropdown-list',
    buttons
  });

  await actionSheet.present();
};
</script>

<template>
  <div class="list">
    <div v-for="(response, index) in userResponses" :key="index" class="item">
      <div class="ion-text-wrap">{{ response.label }}</div>

      <div
          class="select"
          :class="{ 'disabled': disabled }"
          @click="openActionSheet(response)"
      >
        <span v-if="response.category === undefined">
          {{ t('QUESTION.DROPDOWN_INSTRUCTION') }}
        </span>
        <span v-else>
          {{ question.correctResponse[response.category].label }}
        </span>

        <ion-icon :icon="chevronDownOutline" color="inria"></ion-icon>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  display: block;
  margin-top: 1rem;
}

.item {
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  min-height: 3.2rem;
  background: var(--ion-color-contrast-2);

  &:last-child {
    margin-bottom: 0;
  }
}

.select {
  display: flex;
  margin-top: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--ion-color-contrast-3);
  border: 1px solid var(--ion-color-border);
  border-radius: 6px;

  &.disabled {
    opacity: 0.7;
  }

  span {
    padding-top: 0.2rem;
    flex-grow: 1;
    font-size: 0.8rem;
  }

  ion-icon {
    flex-shrink: 0;
  }
}
</style>