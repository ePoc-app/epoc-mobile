<template>
  <div class="loading-container" :class="{ 'fullscreen': fullscreen, 'overlay': overlay }">
    <div class="spinner-container">
      <ion-spinner :name="type" :color="color"></ion-spinner>
      <div v-if="message" class="loading-message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonSpinner } from '@ionic/vue';

// Props
interface Props {
  message?: string;
  fullscreen?: boolean;
  overlay?: boolean;
  type?: 'lines' | 'lines-small' | 'dots' | 'bubbles' | 'circles' | 'crescent';
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: '',
  fullscreen: false,
  overlay: false,
  type: 'crescent',
  color: 'primary'
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.loading-container.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--ion-background-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-message {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  text-align: center;
}
</style>
