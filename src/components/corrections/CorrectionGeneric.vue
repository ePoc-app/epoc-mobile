<script setup lang="ts">
import { computed } from 'vue';
import { IonItem, IonLabel, IonIcon } from '@ionic/vue';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  question: {
    correctResponse: any;
    [key: string]: any;
  };
  userResponses: any[];
}>();

const { t } = useI18n();

const isCorrect = computed(() => {
  return props.question.correctResponse === props.userResponses[0];
});
</script>

<template>
  <div class="correction-container">
    <h4>{{ t('QUESTION.CORRECTION.CORRECTION') }}</h4>
    <ion-item lines="none">
      <div v-if="isCorrect" class="correction-icon correct">
        <ion-icon aria-hidden="true" :icon="checkmarkOutline"></ion-icon>
      </div>
      <div v-else class="correction-icon incorrect">
        <ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon>
      </div>

      <ion-label class="ion-text-wrap" color="inria-icon">
        <div v-if="isCorrect" class="correction-right">
          {{ t('QUESTION.CORRECTION.SUCCESS') }}
        </div>
        <div v-else class="correction-wrong">
          {{ t('QUESTION.CORRECTION.FAILURE') }}
        </div>
      </ion-label>
    </ion-item>
  </div>
</template>

<style scoped lang="scss">
h4 {
  font-size: 1rem;
  font-weight: bold;
  color: var(--ion-color-text-2);
  text-transform: uppercase;
}

ion-item {
  --padding-top: 0.8rem;
  --padding-bottom: 0.8rem;
  --padding-start: 0.8rem;
  --padding-end: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

ion-label {
  margin: 0;
}

.correction-specs {
  display: flex;
  margin: 1.5rem 0;
  font-size: 0.85rem;
  line-height: 1rem;
  color: var(--ion-color-specs);
  text-align: center;
  justify-content: center;

  .correction-spec {
    flex: 1;
    padding: 0 1rem;
  }

  .correction-spec + .correction-spec {
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 3rem;
      width: 0;
      border-left: 1px solid var(--ion-color-unique-2);
    }
  }

  ion-icon {
    font-size: 1.5rem;
  }
}

.correction-icon {
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 2rem;
  background: var(--ion-color-inria-grey);
  color: white;

  &.correct {
    background: var(--ion-color-inria-correct);
    --ionicon-stroke-width: 64px;
  }

  &.incorrect {
    background: var(--ion-color-inria-incorrect);
    --ionicon-stroke-width: 64px;
  }
}

.correction-right {
  color: var(--ion-color-inria-correct);
  font-weight: bold;
}

.correction-wrong {
  color: var(--ion-color-inria-incorrect);
  font-weight: bold;
}

.correction-missing {
  color: var(--ion-color-inria-grey);
  font-weight: bold;
}

.correction-right-answer {
  b {
    color: var(--ion-color-text-2);
  }
  p {
    color: var(--ion-color-text);
  }
}

:deep(.sc-ion-label-md-h),
:deep(.sc-ion-label-ios-h) {
  color: var(--ion-color-text-2);
}

.correction-icon + ion-label {
  overflow: visible;
}

details {
  padding-top: 0.25rem;
  margin-top: 0.25rem;
  border-top: 1px solid var(--ion-color-close);
  summary {
    font-weight: bold;
    list-style: none;

    ion-icon {
      float: right;
      transform: translateY(3px) rotate(-90deg);
      transition: transform 0.3s ease-in-out;
      pointer-events: none;
    }
  }

  &[open] {
    summary {
      ion-icon {
        transform: translateY(3px) rotate(0deg);
      }
    }
  }
}
</style>