<script setup lang="ts">
import { computed, ref } from 'vue';

// Props
const props = defineProps({
    progress: { type: Number, required: true },
    delta: { type: Number, required: true },
    treshold: { type: Number, required: true },
    minLabel: { type: Number, required: true },
    maxLabel: { type: Number, required: true },
});

let currentDelta = ref<Number>(0);
let thresholdPoints = computed(Math.round((props.threshold / 100) * props.maxLabel));

setTimeout(() => {
    currentDelta.value = props.delta;
}, 200);
</script>

<template>
    <div class="progress-container">
        <div class="progress-track">
            <div class="progress" :style="{ width: progress + '%' }"></div>
            <div class="progress-delta" :style="{ left: progress + '%', width: currentDelta + '%' }"></div>
        </div>
        <div class="progress-threshold" :style="{ left: 'calc(' + threshold + '% - 0.9rem)' }" :v-if="threshold < 100">
            <div class="progress-threshold-label">
                {{ $t('QUESTION.CERTIFICATE') }}<br />
                {{ thresholdPoints }} {{ $t('PLAYER.SCORE.PTS') }}
            </div>
            <ion-icon src="/assets/icon/badge.svg"></ion-icon>
        </div>
        <div class="progress-labels">
            <div class="progress-min">{{ minLabel }}</div>
            <div class="progress-max">{{ maxLabel }}</div>
        </div>
    </div>
</template>

<style>
.progress-container {
    position: relative;
    padding: 1rem 1rem 2rem 1rem;
}

.progress-track {
    position: relative;
    width: 100%;
    height: 50px;
    background: var(--ion-color-contrast);
    border-radius: 10px;
    overflow: hidden;
}

.progress {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: var(--ion-color-inria-correct-shade);
}

.progress-delta {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 60%;
    width: 0;
    background: var(--ion-color-inria-correct);
    transition: width 2s ease-in-out;
}

.progress-threshold {
    position: absolute;
    top: 0.5rem;
    height: calc(50px + 1rem);
    border-left: 4px solid var(--ion-color-inria-certificate);
    border-radius: 4px;

    &-label {
        position: absolute;
        top: calc(100% + 5px);
        right: 50%;
        color: var(--ion-color-inria-certificate);
        transform: translateX(50%);
        text-transform: uppercase;
        text-align: center;
        font-size: 0.75rem;
        font-weight: bold;
        line-height: 1;
    }

    ion-icon {
        display: block;
        position: absolute;
        top: calc(50% - 1.1rem);
        left: calc(50% - 1.1rem);
        font-size: 2rem;
    }
}

.progress-labels {
    display: flex;
    font-size: 12px;
    font-weight: bold;
    color: var(--ion-color-medium);
    justify-content: space-between;

    .progress-min {
    }

    .progress-max {
        text-align: right;
    }
}
</style>
