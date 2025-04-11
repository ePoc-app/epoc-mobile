import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// Types
interface CustomLibrary {
  name: string;
  url: string;
}

export interface Settings {
  theme: string;
  lang: string;
  isUserOptIn: boolean;
  libraryMode: string;
  customLibrairies: CustomLibrary[];
}

export const useSettingsStore = defineStore('settings', () => {
  // Default settings
  const defaultSettings: Settings = {
    theme: 'auto',
    lang: 'fr',
    isUserOptIn: false,
    libraryMode: 'https://learninglab.gitlabpages.inria.fr/epoc/epocs/list.json',
    customLibrairies: []
  };
  
  // State
  const settings = ref<Settings>({ ...defaultSettings });
  const settingsFetched = ref(false);
  
  // Initialize settings from localStorage
  function initSettings() {
    try {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        settings.value = { ...defaultSettings, ...JSON.parse(storedSettings) };
      }
      settingsFetched.value = true;
    } catch (error) {
      console.error('Error initializing settings:', error);
      settings.value = { ...defaultSettings };
      settingsFetched.value = true;
    }
  }
  
  // Save settings to localStorage whenever they change
  watch(settings, (newSettings) => {
    try {
      localStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, { deep: true });
  
  // Update a specific setting
  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    settings.value = {
      ...settings.value,
      [key]: value
    };
  }
  
  // Add a custom library
  function addCustomLibrary(library: CustomLibrary) {
    settings.value.customLibrairies = [
      ...settings.value.customLibrairies,
      library
    ];
  }
  
  // Remove a custom library
  function removeCustomLibrary(url: string) {
    settings.value.customLibrairies = settings.value.customLibrairies.filter(
      lib => lib.url !== url
    );
  }
  
  // Reset settings to defaults
  function resetSettings() {
    settings.value = { ...defaultSettings };
  }
  
  return {
    settings,
    settingsFetched,
    initSettings,
    updateSetting,
    addCustomLibrary,
    removeCustomLibrary,
    resetSettings
  };
});
