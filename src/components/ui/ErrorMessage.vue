<template>
  <div class="error-container" :class="{ 'fullscreen': fullscreen }">
    <div class="error-content">
      <ion-icon :name="icon" :color="color" size="large"></ion-icon>
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      <ion-button v-if="showRetry" @click="$emit('retry')" :color="buttonColor">
        {{ retryText }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';

// Props
interface Props {
  title?: string;
  message?: string;
  icon?: string;
  color?: string;
  fullscreen?: boolean;
  showRetry?: boolean;
  retryText?: string;
  buttonColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Error',
  message: 'An error occurred. Please try again.',
  icon: 'alert-circle-outline',
  color: 'danger',
  fullscreen: false,
  showRetry: true,
  retryText: 'Try Again',
  buttonColor: 'primary'
});

// Emits
defineEmits(['retry']);
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.error-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: var(--ion-background-color);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.error-title {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-bottom: 1.5rem;
}

ion-icon {
  font-size: 4rem;
}
</style>
