<script setup lang="ts">
import { SimpleChoiceQuestion } from '@/types/contents/assessment';
import { PropType, ref } from 'vue';
import { IonRadioGroup, IonRadio, IonLabel, IonItem } from '@ionic/vue';

const props = defineProps({
    question: {
        type: Object as PropType<SimpleChoiceQuestion>,
        required: true,
    },
    disabled: {
        type: Boolean,
        required: true,
    },
    userPreviousResponse: {
        type: Object as PropType<string[]>,
        required: true,
    },
});

const emits = defineEmits<{
    userHasResponded: [answer: string[]];
}>();

const selectedAnswer = ref<string>(props.userPreviousResponse[0]);

const selectAnswer = (answer: string) => {
    selectedAnswer.value = answer;
    emits('userHasResponded', [selectedAnswer.value]);
};
</script>

<template>
    <ion-radio-group :value="selectedAnswer">
        <ion-item
            v-for="response of question.responses"
            :key="response.value"
            lines="none"
            color="inria-contrast-button"
            @click="selectAnswer(response.value)"
        >
            <ion-radio mode="md" slot="start" :disabled="disabled" :value="response.value" />
            <ion-label class="ion-text-wrap">
                {{ response.label }}
            </ion-label>
        </ion-item>
    </ion-radio-group>
</template>

<style scoped>
ion-radio-group {
    display: block;
    margin-top: 2rem;
}

ion-item {
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    --min-height: 3.2rem;

    &:last-child {
        margin-bottom: 0;
    }
}

ion-radio {
    --color: var(--ion-color-inria-lightgrey);
    --color-checked: var(--ion-color-inria-spe);
    background: white;
    border-radius: 1.5rem;

    & + ion-label {
        padding-top: 0.2em;
        color: var(--ion-color-text);
    }
}
</style>
