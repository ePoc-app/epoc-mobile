<template>
  <ion-header :translucent="translucent" :mode="mode" :class="customClass">
    <ion-toolbar>
      Test
      <slot name="start" slot="start">
        <div v-if="showLogo" aria-hidden="true" class="logo">
          <div class="epoc-logo"></div>
          <div class="by-inria"></div>
        </div>
        <ion-back-button v-if="showBackButton" :default-href="defaultBackHref" :text="backText"></ion-back-button>
      </slot>
      
      <ion-title v-if="title">{{ title }}</ion-title>
      <slot name="title"></slot>
      
      <slot name="end" slot="end">
        <ion-button v-if="showSettingsButton" role="button" class="icon-btn" :router-link="settingsLink" router-direction="forward">
          <ion-icon aria-label="Settings" slot="icon-only" name="settings-outline" color="inria-icon"></ion-icon>
        </ion-button>
        <ion-button v-if="showInfoButton" role="button" class="icon-btn" :router-link="infoLink" router-direction="forward">
          <ion-icon aria-label="Information" slot="icon-only" name="information-circle-outline" color="inria-icon"></ion-icon>
        </ion-button>
      </slot>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonIcon,
  IonBackButton
} from '@ionic/vue';

// Props
interface Props {
  title?: string;
  translucent?: boolean;
  mode?: 'ios' | 'md' | undefined;
  customClass?: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  defaultBackHref?: string;
  backText?: string;
  showSettingsButton?: boolean;
  settingsLink?: string;
  showInfoButton?: boolean;
  infoLink?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  translucent: true,
  mode: 'ios',
  customClass: '',
  showLogo: false,
  showBackButton: false,
  defaultBackHref: '/',
  backText: '',
  showSettingsButton: false,
  settingsLink: '/settings',
  showInfoButton: false,
  infoLink: '/about'
});
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>
