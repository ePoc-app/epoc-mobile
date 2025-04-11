<template>
  <ion-page>
    <app-header 
      :title="$t('SETTINGS_PAGE.TITLE')" 
      show-back-button
    />

    <ion-content>
      <ion-list>
        <!-- Theme settings -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>{{ $t('SETTINGS_PAGE.THEME') }}</ion-label>
          </ion-item-divider>
          
          <ion-radio-group v-model="theme">
            <ion-item>
              <ion-label>{{ $t('SETTINGS_PAGE.THEME_LIGHT') }}</ion-label>
              <ion-radio slot="end" value="light"></ion-radio>
            </ion-item>
            
            <ion-item>
              <ion-label>{{ $t('SETTINGS_PAGE.THEME_DARK') }}</ion-label>
              <ion-radio slot="end" value="dark"></ion-radio>
            </ion-item>
            
            <ion-item>
              <ion-label>{{ $t('SETTINGS_PAGE.THEME_AUTO') }}</ion-label>
              <ion-radio slot="end" value="auto"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-item-group>
        
        <!-- Language settings -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>{{ $t('SETTINGS_PAGE.LANGUAGE') }}</ion-label>
          </ion-item-divider>
          
          <ion-radio-group v-model="language">
            <ion-item v-for="lang in availableLanguages" :key="lang.code">
              <ion-label>{{ lang.name }}</ion-label>
              <ion-radio slot="end" :value="lang.code"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-item-group>
        
        <!-- Font settings -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>{{ $t('SETTINGS_PAGE.FONT') }}</ion-label>
          </ion-item-divider>
          
          <ion-radio-group v-model="font">
            <ion-item>
              <ion-label>{{ $t('SETTINGS_PAGE.FONT_DEFAULT') }}</ion-label>
              <ion-radio slot="end" value="default"></ion-radio>
            </ion-item>
            
            <ion-item>
              <ion-label class="font-dyslexic">{{ $t('SETTINGS_PAGE.FONT_DYSLEXIC') }}</ion-label>
              <ion-radio slot="end" value="dyslexic"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-item-group>
        
        <!-- Analytics settings -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>{{ $t('SETTINGS_PAGE.ANALYTICS') }}</ion-label>
          </ion-item-divider>
          
          <ion-item>
            <ion-label>
              <h2>{{ $t('SETTINGS_PAGE.ANALYTICS') }}</h2>
              <p>{{ $t('SETTINGS_PAGE.ANALYTICS_DESCRIPTION') }}</p>
            </ion-label>
            <ion-toggle v-model="analytics" slot="end"></ion-toggle>
          </ion-item>
        </ion-item-group>
        
        <!-- Libraries settings -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>{{ $t('SETTINGS_PAGE.LIBRARIES') }}</ion-label>
          </ion-item-divider>
          
          <ion-item v-for="(library, index) in customLibraries" :key="index">
            <ion-label>{{ library.name }}</ion-label>
            <ion-button 
              fill="clear" 
              color="danger" 
              slot="end"
              @click="removeLibrary(library.url)"
            >
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-button>
          </ion-item>
          
          <ion-item button @click="showAddLibraryModal = true">
            <ion-icon name="add-circle-outline" slot="start" color="primary"></ion-icon>
            <ion-label>{{ $t('SETTINGS_PAGE.ADD_LIBRARY') }}</ion-label>
          </ion-item>
        </ion-item-group>
        
        <!-- About section -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>{{ $t('SETTINGS_PAGE.ABOUT') }}</ion-label>
          </ion-item-divider>
          
          <ion-item button router-link="/about">
            <ion-icon name="information-circle-outline" slot="start" color="medium"></ion-icon>
            <ion-label>{{ $t('SETTINGS_PAGE.ABOUT') }}</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-icon name="code-outline" slot="start" color="medium"></ion-icon>
            <ion-label>{{ $t('SETTINGS_PAGE.VERSION') }}</ion-label>
            <ion-note slot="end">1.0.0</ion-note>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
    
    <!-- Add Library Modal -->
    <ion-modal :is-open="showAddLibraryModal" @didDismiss="showAddLibraryModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ $t('SETTINGS_PAGE.ADD_LIBRARY') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showAddLibraryModal = false">
              <ion-icon slot="icon-only" name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="ion-padding">
        <form @submit.prevent="addLibrary">
          <ion-list>
            <ion-item>
              <ion-label position="floating">{{ $t('SETTINGS_PAGE.LIBRARY_NAME') }}</ion-label>
              <ion-input v-model="newLibrary.name" required></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="floating">{{ $t('SETTINGS_PAGE.LIBRARY_URL') }}</ion-label>
              <ion-input v-model="newLibrary.url" type="url" required></ion-input>
            </ion-item>
          </ion-list>
          
          <div class="ion-padding">
            <ion-button expand="block" type="submit">
              {{ $t('COMMON.SAVE') }}
            </ion-button>
          </div>
        </form>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  IonPage, 
  IonContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonToggle,
  IonButton,
  IonIcon,
  IonNote,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  toastController
} from '@ionic/vue';

// Components
import AppHeader from '@/components/layout/AppHeader.vue';

// Stores
import { useSettingsStore } from '@/stores/settings';

// Environment
import { languages } from '@/environments/languages';

// i18n
const { t, locale } = useI18n();

// Settings store
const settingsStore = useSettingsStore();

// State
const theme = ref('auto');
const language = ref('fr');
const font = ref('default');
const analytics = ref(false);
const customLibraries = ref<{ name: string; url: string }[]>([]);
const showAddLibraryModal = ref(false);
const newLibrary = ref({ name: '', url: '' });
const availableLanguages = ref(languages);

// Initialize settings
onMounted(() => {
  settingsStore.initSettings();
  
  if (settingsStore.settings) {
    theme.value = settingsStore.settings.theme;
    language.value = settingsStore.settings.lang;
    analytics.value = settingsStore.settings.isUserOptIn;
    customLibraries.value = [...settingsStore.settings.customLibrairies];
  }
  
  // Apply theme
  applyTheme(theme.value);
  
  // Apply font
  if (document.body.classList.contains('font-dyslexic')) {
    font.value = 'dyslexic';
  } else {
    font.value = 'default';
  }
});

// Watch for changes
watch(theme, (newTheme) => {
  settingsStore.updateSetting('theme', newTheme);
  applyTheme(newTheme);
});

watch(language, (newLang) => {
  settingsStore.updateSetting('lang', newLang);
  locale.value = newLang;
});

watch(font, (newFont) => {
  if (newFont === 'dyslexic') {
    document.body.classList.add('font-dyslexic');
  } else {
    document.body.classList.remove('font-dyslexic');
  }
});

watch(analytics, (newValue) => {
  settingsStore.updateSetting('isUserOptIn', newValue);
});

// Methods
const applyTheme = (themeName: string) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (themeName === 'dark' || (themeName === 'auto' && prefersDark)) {
    document.body.setAttribute('color-scheme', 'dark');
  } else {
    document.body.setAttribute('color-scheme', 'light');
  }
};

const addLibrary = async () => {
  if (newLibrary.value.name && newLibrary.value.url) {
    // Check if library already exists
    const exists = customLibraries.value.some(lib => lib.url === newLibrary.value.url);
    
    if (exists) {
      const toast = await toastController.create({
        message: 'This library already exists',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }
    
    // Add library
    settingsStore.addCustomLibrary({
      name: newLibrary.value.name,
      url: newLibrary.value.url
    });
    
    // Update local state
    customLibraries.value = [...settingsStore.settings.customLibrairies];
    
    // Reset form and close modal
    newLibrary.value = { name: '', url: '' };
    showAddLibraryModal.value = false;
    
    // Show success toast
    const toast = await toastController.create({
      message: 'Library added successfully',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }
};

const removeLibrary = async (url: string) => {
  settingsStore.removeCustomLibrary(url);
  customLibraries.value = [...settingsStore.settings.customLibrairies];
  
  // Show success toast
  const toast = await toastController.create({
    message: 'Library removed',
    duration: 2000,
    color: 'success'
  });
  await toast.present();
};
</script>

<style scoped>
ion-item-divider {
  --background: var(--ion-color-light);
  --color: var(--ion-color-medium);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.font-dyslexic {
  font-family: 'OpenDyslexic', sans-serif;
}
</style>
