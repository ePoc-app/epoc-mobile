<script setup lang="ts">
import { MultipleChoiceQuestion } from '@/types/contents/assessment';
import { PropType, ref } from 'vue';
import { IonItem, IonCheckbox, IonLabel, IonList } from '@ionic/vue';

const props = defineProps({
    question: { type: Object as PropType<MultipleChoiceQuestion>, required: true },
    disabled: Boolean,
    userPreviousResponse: Array<string>,
});

const emits = defineEmits<{
    userHasResponded: [userResponses: any[]];
}>();

const selectedAnswers = ref<any[]>(
    props.userPreviousResponse && props.userPreviousResponse.length > 0 ? props.userPreviousResponse : []
);

function selectAnswer(value: string) {
    const index = selectedAnswers.value.indexOf(value);

    if (index === -1) {
        selectedAnswers.value.push(value);
    } else {
        selectedAnswers.value.splice(index, 1);
    }

    emits('userHasResponded', selectedAnswers.value);
}
</script>

<template>
    <ion-list>
        <ion-item
            v-for="response of question.responses"
            :key="response.value"
            lines="none"
            :class="{ disabled }"
            @click="selectAnswer(response.value)"
        >
            <ion-checkbox
                mode="ios"
                slot="start"
                :value="response.value"
                :checked="selectedAnswers.indexOf(response.value) !== -1"
                :disabled="disabled"
                @click.stop
            />
            <ion-label class="ion-text-wrap">{{ response.label }}</ion-label>
        </ion-item>
    </ion-list>
</template>

<style scoped lang="scss">
ion-list {
    display: block;
    margin-top: 2rem;
    background: var(--ion-color-content);
}

ion-item {
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    --min-height: 3.2rem;
    --background: var(--ion-color-contrast);
    &:last-child {
        margin-bottom: 0;
    }

    &.disabled {
        pointer-events: none;
    }
}

ion-checkbox {
    --border-color: white;
    --border-color-checked: white;
    --checkbox-background: white;
    --checkbox-background-checked: var(--ion-color-inria-spe);
    --border-radius: 0.375rem;
    --border-width: 0.25rem;
    --checkmark-color: transparent;
    background: white;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid var(--ion-color-unique-1);
    border-radius: 0.375rem;

    & + ion-label {
        padding-top: 0.2em;
        color: var(--ion-color-text);
    }
}
</style>
