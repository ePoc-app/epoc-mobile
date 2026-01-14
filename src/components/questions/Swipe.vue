<script setup lang="ts">
import { Question } from '@/types/contents/assessment';
import { computed, onMounted, PropType, ref, useTemplateRef } from 'vue';
import { book } from 'ionicons/icons'; 
import { SwipeQuestion } from '@/types/contents/assessment';
import { clamp, shuffleArray, sleep } from '@/utils/utils';
import { createGesture, createAnimation } from '@ionic/vue';
import { removeSecableSpace, srcConvert } from '@/utils/transform';
type CardType = {label:string, value:string, selectedSide?: string}

const props = defineProps({
    question: { type : Object as PropType<(SwipeQuestion)>, required: true},
    disabled: Boolean,
    userPreviousResponse: Array<String>,
})

const emits = defineEmits<{
  userHasResponded: [userResponses: any[]]; 
  dragging: [event: string]
}>()

enum SIDE {
  Left = 'left',
  Right = 'right',
}

// ref
const swipeCardComponents = useTemplateRef<HTMLDivElement[]>('swipe-cards')
const sides = ref<string[]>(props.question.correctResponse.map(response => response.label));
const cardsRemaining = ref<Array<CardType>>(shuffleArray(props.question.responses));
const cardsSorted = ref<Array<CardType>>([]);

// Sent to parent
const answers = ref<{left : CardType[], right: CardType[]}>({left: [], right: []})

// Related to animation
const step = ref<number>(0);
const undoDisabled = ref<boolean>(false);
const isDragging = ref(false);

const currentCard = computed(() => (cardsRemaining.value.length > 0) ? cardsRemaining.value[cardsRemaining.value.length -1] : undefined)
const currentSwipeCard = computed(() => swipeCardComponents.value?.find((swipeCard) => swipeCard.id == currentCard.value?.label))

onMounted(() => {
    initSwipe()
});

const initSwipe = () => {
    const threshold = window.innerWidth / 3;
    const thresholdVelocity = 0.4;
    swipeCardComponents.value?.forEach((card, index) => {
        const elem = card;
        const swipeCard = cardsRemaining.value[index];
        const gesture = createGesture({
            el: elem,
            threshold: 0,
            gestureName: 'swipe',
            onMove: ev => {
                applyAnimation(`translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`)
                swipeCard.selectedSide = (ev.deltaX > 0) ? sides.value[0] : sides.value[1];
            },
            onEnd: ev => {
                if (ev.deltaX > threshold || ev.velocityX > thresholdVelocity) {
                    applyCompleteAnimation(SIDE.Right)
                    .then(() => selectSide(SIDE.Right)
                    );
                } else if (ev.deltaX < -threshold || ev.velocityX < -thresholdVelocity) {
                    applyCompleteAnimation(SIDE.Left)
                    .then(() => selectSide(SIDE.Left))
                } else {
                  swipeCard.selectedSide = undefined;
                  applyAnimation(`translateX(0px) rotate(0deg)`)
                  elem.style.transition = 'transform .3s ease-in-out';
                }
            },
        });

        gesture.enable(true);
    })
}

const undo = () => {
    if (cardsSorted.value.length > 0) {
        const lastCardSorted = cardsSorted.value.pop() as CardType;
        removeFromAnswers(lastCardSorted)
        cardsRemaining.value.push(lastCardSorted!);
        initSwipe();
        emits('userHasResponded', []);
    }
}

const removeFromAnswers= (card: CardType) => {
  if (answers.value[SIDE.Left][answers.value[SIDE.Left].length] == card) {
    answers.value[SIDE.Left].pop()
  } else if (answers.value[SIDE.Right][answers.value[SIDE.Right].length] == card) {
    answers.value[SIDE.Right].pop()
  }
}

const swipe = async (side : SIDE) => {
  if (currentCard.value) {
    currentCard.value.selectedSide = side
    applyCompleteAnimation(side)
    .then(()=> selectSide(side))
  }
}

const applyCompleteAnimation = async (animationState: SIDE) => {
    const translate = (animationState == SIDE.Left) ? `translateX(-100vh) rotate(-50deg)` : `translateX(100vh) rotate(50deg)`
    await applyAnimation(translate)
}


const applyAnimation = async(translate:string) => {
  if (currentSwipeCard.value) {
    let animation = createAnimation()
        .addElement(currentSwipeCard.value)
        .duration(300)
        .to('transform', translate);
    animation.play()
    await sleep(300) // wait until animation is done
  }
}

const selectSide = (side: SIDE) => {
    if (cardsRemaining.value.length > 0) {;
      const sortedCard = cardsRemaining.value.pop();
      cardsSorted.value.push(sortedCard!);
      answers.value[side].push({label:sortedCard!.label,value:sortedCard!.value})
    }
    if (cardsRemaining.value.length === 0) {
        emits('userHasResponded',[answers.value[SIDE.Left], answers.value[SIDE.Right]]);
    }
}
</script>

<template>
<p class="swipe-instruction" v-if="!disabled">
  <div v-if="question.statement">
    <span class="custom" v-if="!disabled" :innerHTML="removeSecableSpace(question.statement)"></span>
  </div>
  <div v-if="!question.statement">
    <ion-icon aria-hidden="true" src="/assets/icon/glisser2.svg"></ion-icon>
    <span>{{$t("QUESTION.SWIPE.INSTRUCTION")}}</span>
  </div>
</p>
<div class="swipe-cards">
    <div class="swipe-card" v-for="(card, cardIndex) of cardsRemaining"
         style="{transform: card.transform}"
         ref='swipe-cards'
         :id="card.label"
    >
      <div class="swipe-card-choice" v-if="card.selectedSide">
        {{card.selectedSide}}
      </div>
      <div :aria-hidden="cardsRemaining.length-1 !== cardIndex" class="swipe-card-content">
        <ion-icon aria-hidden="true" src="/assets/icon/citation.svg"></ion-icon>
        <div>« {{card.label}} »</div>
      </div>
    </div>
  <div v-if="cardsRemaining.length <= 0">{{$t('QUESTION.SWIPE.FINISH')}}</div>
</div>
<ion-range class="progress-indicator" disabled="true" mode="md" step="1" min="0"
           :max="question.responses.length" :value="question.responses.length - cardsRemaining.length" snaps="true"></ion-range>

<div class="swipe-actions">
  <div :aria-hidden="cardsRemaining.length < 1" role="button" class="swipe-action" @click="swipe(SIDE.Left)" :class="{'hidden' : cardsRemaining.length <= 0 || undoDisabled}">
    <ion-icon aria-hidden="true" class="swipe-right" src="/assets/icon/gauche.svg"></ion-icon>
    <span>{{sides[1]}}</span>
  </div>
  <div :aria-hidden="cardsSorted.length < 1" aria-roledescription="Retour" role="button" class="swipe-action small" :class="{'hidden' : cardsSorted.length <= 0 || undoDisabled}" @click="undo">
    <ion-icon aria-hidden="true" src="/assets/icon/annuler.svg"></ion-icon>
  </div>
  <div :aria-hidden="cardsRemaining.length < 1" role="button" class="swipe-action" @click="swipe(SIDE.Right)" :class="{'hidden' : cardsRemaining.length <= 0 || undoDisabled}">
    <ion-icon aria-hidden="true" src="/assets/icon/droite.svg"></ion-icon>
    <span>{{sides[0]}}</span>
  </div>
</div>

</template>

<style>
.swipe-instruction{
  display: flex;
  align-items: center;
  justify-content: center;
  margin:0 0 1rem 0;
  padding: 1rem;
  color: var(--ion-color-text-2);

  ion-icon{
    flex-shrink: 0;
    margin-right: 1rem;
  }

  span{
    font-size: 0.875rem;
  }

  .custom {
    display: block;
    text-align: center;
  }
}

.statement{
  color: var(--ion-color-inria-grey);
  font-size: 0.875rem;
}

.swipe-cards {
  flex: 1;
  position:relative;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 32vh;
  height: 32vh;
  text-align: center;

  &-progress{
    padding: 0;
    margin: 1rem;
    --knob-size:0;
    --knob-background:transparent;
    --knob-box-shadow: none;
    --bar-height:10px;
    --bar-border-radius:5px;
    overflow: hidden;
    border-radius: 1rem;

    &::part(bar){
      background: var(--ion-color-specs);
    }

    &::part(bar-active){
      background: var(--ion-color-inria-spe);
    }

    &::part(tick), &::part(tick-active){
      top: calc((var(--height) - var(--bar-height) + 4px) / 2);
      width: calc(var(--bar-height) - 4px);
      height: calc(var(--bar-height) - 4px);
      border-radius: 50%;
      background: #D0D7E1;
      transform: translateX(calc(-100% - 4px));
    }

    &::part(tick-active){
      background: white;
    }

    &::part(knob){
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
  left:0;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border-radius: 1rem;
  background-color: var(--ion-color-inria-spe);
  box-shadow: 0 1px 8px 0 var(--ion-color-shadow);
  font-weight: bold;
  font-size: clamp(12px, 2.3vh, 18px);
  color:white;
  z-index:10;
  touch-action: none;

  &:before {
    content:'';
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 1rem;
    background-color: rgba(var(--ion-color-inria-spe-rgb), 0);
    transform: rotate(5deg);
    transition: all .3s ease;
    z-index:-1;
  }

  &:nth-last-child(2):before {
    background-color: rgba(var(--ion-color-inria-spe-rgb), 0.3);
  }

  ion-icon{
    font-size: 2rem;
  }

  .swipe-card-choice{
    position: absolute;
    top:50%;
    left:50%;
    padding: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--ion-color-inria-blue);
    background: white;
    border-radius: 1rem;
    transform: translate(-50%, -50%);
    z-index:1;
    opacity: 0.8;
  }
}

.swipe-actions{
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--ion-color-specs);

  .swipe-action{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width:4rem;
    height:4rem;
    margin: .2rem;
    background: var(--ion-color-contrast);
    border-radius: 4rem;
    font-size: 2rem;

    &.small{
      width:2rem;
      height:2rem;
      font-size: 1rem;
    }

    &.hidden{
      opacity: 0;
    }

    span{
      position: absolute;
      top:100%;
      left:50%;
      transform: translateX(-50%);
      font-size: .75rem;
      color: var(--ion-color-specs);
      white-space: nowrap;
    }
  }
}
</style>
