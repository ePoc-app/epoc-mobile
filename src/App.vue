<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@/stores/settings';

// Get settings store
const settingsStore = useSettingsStore();

// Get i18n instance
const { locale } = useI18n();

// Initialize settings and apply them
onMounted(() => {
  // Initialize settings
  settingsStore.initSettings();
  
  // Apply settings
  if (settingsStore.settings) {
    // Set language
    locale.value = settingsStore.settings.lang;
    
    // Apply theme
    applyTheme(settingsStore.settings.theme);
  }
});

// Watch for settings changes
watch(() => settingsStore.settings, (newSettings) => {
  if (newSettings) {
    // Update language if changed
    locale.value = newSettings.lang;
    
    // Update theme if changed
    applyTheme(newSettings.theme);
  }
}, { deep: true });

// Apply theme based on settings
function applyTheme(themeName: string) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (themeName === 'dark' || (themeName === 'auto' && prefersDark)) {
    document.body.setAttribute('color-scheme', 'dark');
  } else {
    document.body.setAttribute('color-scheme', 'light');
  }
}
</script>

<style>
/* Global styles can be added here */
</style>
