<template>
  <div class="empty-container" :class="{ 'fullscreen': fullscreen }">
    <div class="empty-content">
      <ion-icon v-if="icon" :name="icon" :color="color" size="large"></ion-icon>
      <img v-if="image" :src="image" :alt="title" class="empty-image" />
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <ion-button v-if="actionText" @click="$emit('action')" :color="buttonColor">
        {{ actionText }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';

// Props
interface Props {
  title: string;
  message?: string;
  icon?: string;
  image?: string;
  color?: string;
  fullscreen?: boolean;
  actionText?: string;
  buttonColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'No Data',
  message: 'There is no data to display.',
  icon: 'document-outline',
  image: '',
  color: 'medium',
  fullscreen: false,
  actionText: '',
  buttonColor: 'primary'
});

// Emits
defineEmits(['action']);
</script>

<style scoped>
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.empty-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: var(--ion-background-color);
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.empty-title {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.empty-message {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-bottom: 1.5rem;
}

.empty-image {
  max-width: 200px;
  max-height: 200px;
  margin-bottom: 1rem;
}

ion-icon {
  font-size: 4rem;
}
</style>
