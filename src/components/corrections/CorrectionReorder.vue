<script setup lang="ts">
import type { DragAndDropQuestion } from '@/types/contents/assessment';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { IonIcon, IonItem, IonLabel, IonReorder } from '@ionic/vue';
import { checkmarkOutline, closeOutline, chevronDownOutline } from 'ionicons/icons';

const props = defineProps<{
    question: DragAndDropQuestion;
    userResponses: any[];
}>();

const { t } = useI18n();

const correction = computed(() =>
    props.userResponses.map((response, index) => {
        const rightIndex = props.question.responses.findIndex((r) => r.value === response);
        const correct = rightIndex === index;

        return {
            correct,
            label: response.label,
            correctResponse: t('QUESTION.CORRECTION.POSITION') + (rightIndex + 1),
            feedback: props.question.responses[rightIndex].feedback,
        };
    })
);

const rightResponses = computed(() => correction.value.filter((c) => c.correct).length);
const wrongResponses = computed(() => correction.value.filter((c) => !c.correct).length);
</script>

<template>
    <div v-if="correction">
        <div class="correction-specs">
            <div class="correction-spec">
                <div class="correction-spec-icon">
                    <IonIcon aria-hidden="true" :icon="checkmarkOutline" />
                </div>
                <div class="correction-spec-value">
                    {{ rightResponses }} {{ t('QUESTION.CORRECTION.CORRECT_ANSWERS', rightResponses) }}
                </div>
            </div>

            <div class="correction-spec">
                <div class="correction-spec-icon">
                    <IonIcon aria-hidden="true" :icon="closeOutline" />
                </div>
                <div class="correction-spec-value">
                    {{ wrongResponses }} {{ t('QUESTION.CORRECTION.WRONG_ANSWERS', wrongResponses) }}
                </div>
            </div>
        </div>

        <h4>{{ t('QUESTION.CORRECTION.RESPONDED') }}</h4>

        <div v-for="(response, index) of correction" :key="index" class="item">
            <span class="item-index">{{ Number(index) + 1 }}</span>

            <IonItem lines="none">
                <div v-if="response.correct" class="correction-icon correct">
                    <IonIcon aria-hidden="true" :icon="checkmarkOutline" />
                </div>
                <div v-else class="correction-icon incorrect">
                    <IonIcon aria-hidden="true" :icon="closeOutline" />
                </div>

                <IonLabel class="ion-text-wrap" color="inria-blue">
                    {{ response.label }}
                    <div v-if="response.correct" class="correction-right">
                        {{ t('QUESTION.CORRECTION.TRUE') }}
                    </div>
                    <template v-else>
                        <div class="correction-wrong">
                            {{ t('QUESTION.CORRECTION.FALSE') }}
                        </div>

                        <div class="correction-right-answer">
                            <b>{{ t('QUESTION.CORRECTION.CORRECT') }}</b>
                            <span>{{ response.correctResponse }}</span>
                        </div>
                    </template>

                    <details v-if="response.feedback" :open="!response.correct">
                        <summary>
                            {{ t('QUESTION.PREVIEW.EXPLANATION') }}
                            <IonIcon :icon="chevronDownOutline" />
                        </summary>
                        <div>{{ response.feedback }}</div>
                    </details>
                </IonLabel>
            </IonItem>
        </div>

        <h4>{{ t('QUESTION.CORRECTION.CORRECT_RANKING') }}</h4>
        <div v-for="(response, index) of question.responses" :key="index" class="item">
            <span class="item-index correct">{{ Number(index) + 1 }}</span>

            <IonItem lines="none">
                <IonLabel class="ion-text-wrap">{{ response.label }}</IonLabel>
                <IonReorder slot="end">
                    <IonIcon aria-hidden="true" src="/assets/icon/slider.svg" />
                </IonReorder>
            </IonItem>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/theme/correction.scss';

div.item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    box-shadow: none !important;
    ion-item {
        flex-grow: 1;
        margin-left: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        background: var(--ion-color-item);
        --padding-start: 0;
        --padding-top: 0;
        --padding-bottom: 0;
        --min-height: 0;
        --background: var(--ion-color-item);

        ion-label {
            margin: 0 0.5rem 0 0;
        }
    }
}

.item-index {
    width: 1.2rem;
    height: 1.2rem;
    padding-top: 0.1rem;
    font-size: 0.8rem;
    font-weight: bold;
    line-height: 1.2rem;
    text-align: center;
    border-radius: 1.2rem;
    background: var(--ion-color-item);

    &.correct {
        background: var(--ion-color-inria-correct);
        color: white;
    }
}
</style>
