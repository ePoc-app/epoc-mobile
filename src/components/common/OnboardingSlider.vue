<template>
  <swiper-container 
    v-if="items && items.length" 
    aria-hidden="true" 
    class="onboarding" 
    :slides-per-view="slidesPerView" 
    :space-between="spaceBetween" 
    :pagination="items.length > 1 ? 'true' : ''"
  >
    <swiper-slide 
      class="onboarding-item" 
      :class="item.image ? 'with-image' : ''" 
      v-for="item in items" 
      :key="item.id"
    >
      <div 
        class="onboarding-item-image" 
        v-if="item.image" 
        :style="{ backgroundImage: `url(${item.image})` }"
      ></div>
      <div class="onboarding-item-title">{{ item.title }}</div>
      <div class="onboarding-item-text">{{ item.text }}</div>
      <router-link 
        :to="item.link.url" 
        v-if="item.link"
      >
        {{ item.link.text }}
      </router-link>
      <div 
        class="onboarding-item-close" 
        @click="$emit('remove', item.id)"
      >
        <ion-icon name="close-outline"></ion-icon>
      </div>
    </swiper-slide>
  </swiper-container>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

// Props
interface OnboardingLink {
  text: string;
  url: string;
}

interface OnboardingItem {
  id: string;
  title: string;
  text: string;
  image?: string;
  link?: OnboardingLink;
}

interface Props {
  items: OnboardingItem[];
  slidesPerView?: number;
  spaceBetween?: number;
}

const props = withDefaults(defineProps<Props>(), {
  slidesPerView: 1,
  spaceBetween: 16
});

// Emits
defineEmits(['remove']);
</script>

<style scoped>
.onboarding {
  margin: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.onboarding-item {
  background-color: var(--ion-color-light);
  padding: 16px;
  border-radius: 8px;
  position: relative;
}

.onboarding-item.with-image {
  padding-left: 120px;
  min-height: 100px;
}

.onboarding-item-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.onboarding-item-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.onboarding-item-text {
  font-size: 14px;
  color: var(--ion-color-medium);
}

.onboarding-item-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.onboarding-item-close ion-icon {
  font-size: 16px;
  color: var(--ion-color-medium);
}
</style>
