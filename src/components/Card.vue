<script setup lang="ts">
import { ref, Ref } from 'vue';

interface SwiperInstance {
  allowTouchMove: boolean;
  [key: string]: any;
}

interface TouchEvent extends Event {
  deltaX?: number;
  deltaY?: number;
  tapCount?: number;
  scale?: number;
}

const card: Ref<HTMLElement | null> = ref(null);
const pinching = ref(false);
const zoomedIn = ref(false);
const initScale = ref(1);
const scale = ref(1);
const panning = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const panStartX = ref(0);
const panStartY = ref(0);

const getSwiperInstance = (): SwiperInstance | null => {
  if (!card.value) return null;
  const swiperContainer = card.value.closest('swiper-container:not(.assessment-swiper)');
  return swiperContainer ? (swiperContainer as any).swiper : null;
};

const zoomStart = (e: Event): void => {
  initScale.value = scale.value;
  zoomedIn.value = true;
  pinching.value = true;
  const swiper = getSwiperInstance();
  if (swiper) swiper.allowTouchMove = false;
};

const zoomInOut = (e: TouchEvent): void => {
  e.preventDefault();
  e.stopPropagation();
  if (e.scale !== undefined) {
    scale.value = initScale.value * e.scale;
  }
};

const zoomEnd = (): void => {
  pinching.value = false;
  if (scale.value < 1.1) {
    resetZoom();
  }
};

const panStart = (): void => {
  if (!zoomedIn.value) return;
  panning.value = true;
  panStartX.value = offsetX.value;
  panStartY.value = offsetY.value;
};

const panMove = (e: TouchEvent): void => {
  if (!zoomedIn.value || !panning.value || e.deltaX === undefined || e.deltaY === undefined) return;
  offsetX.value = panStartX.value + (e.deltaX / scale.value);
  offsetY.value = panStartY.value + (e.deltaY / scale.value);

  const maxX = window.innerWidth / 2;
  const maxY = window.innerHeight / 2;
  if (offsetX.value > maxX) offsetX.value = maxX;
  if (offsetX.value < -maxX) offsetX.value = -maxX;
  if (offsetY.value > maxY) offsetY.value = maxY;
  if (offsetY.value < -maxY) offsetY.value = -maxY;
};

const panEnd = (): void => {
  panning.value = false;
};

const tap = (e: TouchEvent): void => {
  if (e.tapCount !== undefined && e.tapCount >= 2) {
    resetZoom();
  }
};

const resetZoom = (): void => {
  scale.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
  const swiper = getSwiperInstance();
  if (swiper) swiper.allowTouchMove = true;
  zoomedIn.value = false;
};
</script>

<template>
  <div class="card-host">
    <div
        ref="card"
        class="card app-card"
        :style="{
        transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
        touchAction: pinching ? 'pinch-zoom' : 'pan-y pan-x'
      }"
        @touchstart.passive="panStart"
        @touchmove.passive="panMove"
        @touchend.passive="panEnd"
        @gesturestart="zoomStart"
        @gesturechange="zoomInOut"
        @gestureend="zoomEnd"
        @dblclick="resetZoom"
    >
      <div class="card-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-host {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
  touch-action: pan-y;
}

.card {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 1rem;
  padding: 1rem;
  background: var(--ion-color-content);
  box-shadow: 0 1px 7px 0 var(--ion-color-shadow);
  border-radius: 1rem;
}

.card-content {
  /* Styles spécifiques si nécessaire */
}
</style>
