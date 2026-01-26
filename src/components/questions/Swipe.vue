<script setup lang="ts">
import { createGesture, Gesture, IonIcon, IonRange } from '@ionic/vue';
import { ref, PropType, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { SwipeQuestion } from '@/types/contents/assessment';
import { removeSecableSpace } from '@/utils/transform';
import { Motion } from 'motion-v';

interface Card {
    id: string;
    label: string | undefined;
    animationState: 'initial' | 'swipeRight' | 'swipeLeft';
    manualX: number;
    selectedSide: string | null;
}

const props = defineProps({
    question: { type: Object as PropType<SwipeQuestion>, required: true },
    disabled: Boolean,
    userPreviousResponse: Array<string>,
});

const emit = defineEmits<{
    (e: 'dragging', value: 'dragstart' | 'dragend'): void;
    (e: 'userHasResponded', userResponses: any[] | null): void;
}>();

const cardsRemaining = ref<Card[]>([]);
const cardsSorted = ref<Card[]>([]);
const isDragging = ref(false);
const topCardRef = ref(null);
let gesture: Gesture | null = null;

const totalCards = computed(() => props.question.responses.length);
const isEmpty = computed(() => cardsRemaining.value.length === 0);
const sides = computed(() => props.question.correctResponse.map((r) => r.label));

function initCards() {
    const responses = [...props.question.responses];

    cardsRemaining.value = responses
        .sort(() => Math.random() - 0.5)
        .map((r, i) => ({
            ...r,
            id: `card-${i}-${Math.random()}`,
            animationState: 'initial',
            manualX: 0,
            selectedSide: null,
        }));
}

function setupGesture() {
    if (gesture) gesture.destroy();
    if (isEmpty.value || !topCardRef.value) return;

    const card = cardsRemaining.value[cardsRemaining.value.length - 1];
    const threshold = window.innerWidth / 3;

    gesture = createGesture({
        el: topCardRef.value,
        gestureName: 'swipe-gesture',
        onStart: () => {
            isDragging.value = true;
            emit('dragging', 'dragstart');
        },
        onMove: (event) => {
            card.manualX = event.deltaX;
            card.selectedSide = event.deltaX > 20 ? sides.value[0] : event.deltaX < -20 ? sides.value[1] : null;
        },
        onEnd: (event) => {
            isDragging.value = false;
            emit('dragging', 'dragend');

            if (Math.abs(event.deltaX) > threshold || Math.abs(event.velocityX) > 0.4) {
                completeSwipe(event.deltaX > 0 ? 'swipeRight' : 'swipeLeft');
            } else {
                card.manualX = 0;
                card.selectedSide = null;
            }
        },
    });

    gesture.enable();
}

function completeSwipe(direction: 'swipeRight' | 'swipeLeft') {
    const card = cardsRemaining.value[cardsRemaining.value.length - 1];
    card.animationState = direction;

    card.manualX = direction === 'swipeRight' ? 1000 : -1000;

    setTimeout(() => {
        const movedCard = cardsRemaining.value.pop();
        if (!movedCard) return;

        cardsSorted.value.push(movedCard);

        if (isEmpty.value) {
            const lefts = cardsSorted.value.filter((c) => c.animationState === 'swipeRight');
            const rights = cardsSorted.value.filter((c) => c.animationState === 'swipeLeft');
            emit('userHasResponded', [lefts, rights]);
        }
    }, 300);
}

function manualSwipe(direction: 'swipeRight' | 'swipeLeft') {
    const card = cardsRemaining.value[cardsRemaining.value.length - 1];
    card.selectedSide = direction === 'swipeRight' ? sides.value[0] : sides.value[1];
    completeSwipe(direction);
}

async function undo() {
    if (cardsSorted.value.length === 0) return;

    const card = cardsSorted.value.pop();
    if (!card) return;

    cardsRemaining.value.push(card);

    await nextTick();

    setTimeout(() => {
        card.animationState = 'initial';
        card.manualX = 0;
        card.selectedSide = null;
    }, 30);

    emit('userHasResponded', null);
}

watch([cardsRemaining, topCardRef], () => {
    nextTick(setupGesture);
});

onMounted(initCards);
onBeforeUnmount(() => gesture?.destroy());
</script>

<template>
    <p v-if="!disabled" class="swipe-instruction">
        <span v-if="question.statement" class="custom" :innerHTML="removeSecableSpace(question.statement)" />

        <template v-else>
            <IonIcon src="/assets/icon/glisser2.svg" aria-hidden />
            <span>{{ $t('QUESTION.SWIPE.INSTRUCTION') }}</span>
        </template>
    </p>

    <div class="swipe-cards">
        <Motion
            v-for="(card, index) in cardsRemaining"
            :key="card.id"
            :ref="el => { if (index === cardsRemaining.length - 1) topCardRef = (el as any)?.$el || el }"
            class="swipe-card"
            :initial="{
                x: card.animationState === 'swipeRight' ? 500 : card.animationState === 'swipeLeft' ? -500 : 0,
                rotate: card.animationState === 'swipeRight' ? 45 : card.animationState === 'swipeLeft' ? -45 : 0,
                opacity: card.animationState === 'initial' ? 1 : 0,
            }"
            :animate="{
                x: card.manualX,
                rotate: card.manualX / 10,
                scale: index === cardsRemaining.length - 1 ? 1 : 0.95,
            }"
            :transition="{
                type: 'spring',
                stiffness: isDragging ? 1000 : 300,
                damping: 30,
            }"
            :style="{ zIndex: index }"
        >
            <div v-if="card.selectedSide" class="swipe-card-choice">
                {{ card.selectedSide }}
            </div>

            <div :aria-hidden="index !== cardsRemaining.length - 1" class="swipe-card-content">
                <IonIcon src="/assets/icon/citation.svg" aria-hidden />
                <p>« {{ card.label }} »</p>
            </div>
        </Motion>

        <div v-if="isEmpty">{{ $t('QUESTION.SWIPE.FINISH') }}</div>
    </div>

    <IonRange
        class="progress-indicator"
        disabled
        mode="md"
        :max="totalCards"
        :value="totalCards - cardsRemaining.length"
        snaps
    />

    <div class="swipe-actions">
        <button class="swipe-action" :class="{ hidden: isEmpty }" @click="manualSwipe('swipeLeft')">
            <IonIcon src="/assets/icon/gauche.svg" aria-hidden class="swipe-right" />
            <span>{{ sides[1] }}</span>
        </button>

        <button class="swipe-action small" :class="{ hidden: cardsSorted.length === 0 }" @click="undo">
            <IonIcon aria-hidden src="/assets/icon/annuler.svg" />
        </button>

        <button class="swipe-action" :class="{ hidden: isEmpty }" @click="manualSwipe('swipeRight')">
            <IonIcon aria-hidden src="/assets/icon/droite.svg" />
            <span>{{ sides[0] }}</span>
        </button>
    </div>
</template>

<style scoped lang="scss">
.swipe-instruction {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 1rem 0;
    padding: 1rem;
    color: var(--ion-color-text-2);

    ion-icon {
        flex-shrink: 0;
        margin-right: 1rem;
    }

    span {
        font-size: 0.875rem;
    }

    .custom {
        display: block;
        text-align: center;
    }
}

.statement {
    color: var(--ion-color-inria-grey);
    font-size: 0.875rem;
}

.swipe-cards {
    flex: 1;
    position: relative;
    align-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    width: 32vh;
    height: 32vh;
    text-align: center;

    &-progress {
        padding: 0;
        margin: 1rem;
        --knob-size: 0;
        --knob-background: transparent;
        --knob-box-shadow: none;
        --bar-height: 10px;
        --bar-border-radius: 5px;
        overflow: hidden;
        border-radius: 1rem;

        &::part(bar) {
            background: var(--ion-color-specs);
        }

        &::part(bar-active) {
            background: var(--ion-color-inria-spe);
        }

        &::part(tick),
        &::part(tick-active) {
            top: calc((var(--height) - var(--bar-height) + 4px) / 2);
            width: calc(var(--bar-height) - 4px);
            height: calc(var(--bar-height) - 4px);
            border-radius: 50%;
            background: #d0d7e1;
            transform: translateX(calc(-100% - 4px));
        }

        &::part(tick-active) {
            background: white;
        }

        &::part(knob) {
            display: none;
        }
    }
}

.swipe-card {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--ion-color-inria-spe);
    box-shadow: 0 1px 8px 0 var(--ion-color-shadow);
    font-weight: bold;
    font-size: clamp(12px, 2.3vh, 18px);
    color: white;
    z-index: 10;
    touch-action: none;
    will-change: transform;

    &:before {
        content: '';
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: 1rem;
        background-color: rgba(var(--ion-color-inria-spe-rgb), 0);
        transform: rotate(5deg);
        transition: all 0.3s ease;
        z-index: -1;
    }

    &:nth-last-child(2):before {
        background-color: rgba(var(--ion-color-inria-spe-rgb), 0.3);
    }

    ion-icon {
        font-size: 2rem;
    }

    .swipe-card-choice {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        text-transform: uppercase;
        color: var(--ion-color-inria-blue);
        background: white;
        border-radius: 1rem;
        transform: translate(-50%, -50%);
        z-index: 1;
        opacity: 0.8;
    }
}

.swipe-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--ion-color-specs);

    .swipe-action {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4rem;
        height: 4rem;
        margin: 0.2rem;
        background: var(--ion-color-contrast);
        border-radius: 4rem;
        font-size: 2rem;

        color: var(--ion-color-text-2);

        &.small {
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
        }

        &.hidden {
            opacity: 0;
        }

        span {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.75rem;
            color: var(--ion-color-specs);
            white-space: nowrap;
        }
    }
}
</style>
