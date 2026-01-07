<script setup lang="ts">
import { ref } from 'vue';
import Card from './Card.vue';

interface Props {
  initFlipped?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initFlipped: false,
});

const flipped = ref<boolean>(props.initFlipped);

const flip = (): void => {
  flipped.value = !flipped.value;
};

const showFront = (): void => {
  flipped.value = false;
};

const showBack = (): void => {
  flipped.value = true;
};

defineExpose({
  flip,
  showFront,
  showBack,
  flipped
});
</script>

<template>
  <div class="flip-card-host">
    <div class="flip-container" :class="{ 'flipped': flipped }">
      <div class="flipper">
        <div class="front">
          <Card>
            <slot name="front"></slot>
          </Card>
        </div>
        <div class="back">
          <Card>
            <slot name="back"></slot>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card-host {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  flex-grow: 1;
}

.flip-container {
  flex-grow: 1;
  perspective: 1000px;
}

.flip-container .flipper {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  animation: flashflip 0.05s;
  will-change: transform;
}

.flipper.notransition {
  transition: none !important;
}

.flip-container.flipped .flipper {
  transform: rotate3d(0, -1, 0, 180deg);
}

.flipper .front,
.flipper .back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  backface-visibility: hidden;
}

.flipper .front {
  transform: rotate3d(0, 0, 0, 0);
  z-index: 1;
}

.flipper .back {
  transform: rotate3d(0, -1, 0, 180deg);
}

.flip-container.flipped .back {
  z-index: 1;
}

@keyframes flashflip {
  0% { opacity: 0.8; }
  100% { opacity: 1; }
}
</style>
