<template>
  <ion-page>
    <app-header 
      show-logo 
      show-settings-button 
      show-info-button
      custom-class="home"
      title="Test"
    ></app-header>

    <ion-content>
      <ion-refresher slot="fixed" snapback-duration="1000ms" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
      <!-- Onboarding slider -->
      <onboarding-slider 
        v-if="onboarding && onboarding.length" 
        :items="onboarding" 
        @remove="removeMessage"
      />
      
      <!-- Loading state -->
      <loading-spinner 
        v-if="isLoading" 
        :message="$t('COMMON.LOADING')"
      />
      
      <!-- Error state -->
      <error-message 
        v-else-if="hasError" 
        :message="errorMessage" 
        @retry="fetchData"
      />
      
      <!-- Main library content -->
      <template v-else>
        <!-- Main library -->
        <div class="library-items" tabindex="-1">
          <epoc-card 
            v-for="epoc in library" 
            :key="epoc.id" 
            :epoc="epoc" 
            :progress="epocProgresses[epoc.id]"
            @download="downloadEpoc" 
            @menu="openEpocMenu"
          />
        </div>
        
        <!-- Custom libraries -->
        <template v-for="(library, key) in customLibraries" :key="key">
          <div class="library-separator"><span>{{ library.name }}</span></div>
          <div class="library-items" tabindex="-1">
            <epoc-card 
              v-for="epoc in library.epocs" 
              :key="epoc.id" 
              :epoc="epoc" 
              :progress="epocProgresses[epoc.id]"
              :library-id="key"
              @download="(epoc) => downloadEpoc(epoc, key)" 
              @menu="(epoc) => openEpocMenu(epoc, key)"
            />
          </div>
        </template>
        
        <!-- Local epocs -->
        <div class="library-separator"><span>Mes ePocs</span></div>
        <div class="library-items">
          <epoc-card 
            v-for="epoc in localEpocs" 
            :key="epoc.id" 
            :epoc="epoc" 
            @menu="localEpocsStore.localEpocLibraryMenu"
          />
          
          <!-- Import items -->
          <div class="library-item library-item-import" v-for="(value, key) in localEpocsStore.imports" :key="key">
            <div class="library-item-image"></div>
            <h3 aria-hidden="true" class="library-item-title">{{ value }}</h3>
          </div>
          
          <!-- Add button -->
          <div class="library-item library-item-add" @click="openAddMenu()">
            <div class="library-item-image">
              <ion-icon aria-hidden="true" src="/assets/icon/ajouter.svg" size="large"></ion-icon>
            </div>
            <h3 aria-hidden="true" class="library-item-title">{{ $t('LIBRARY_PAGE.ADD_EPOC') }}</h3>
          </div>
          
          <!-- Hidden file input -->
          <input 
            type="file" 
            accept="application/octet-stream,application/zip" 
            hidden 
            @change="fileHandler($event)" 
            ref="fileInput"
          >
        </div>
        
        <!-- Empty state -->
        <empty-state 
          v-if="!library.length && !Object.keys(customLibraries).length && !localEpocs.length" 
          :title="$t('LIBRARY_PAGE.TITLE')" 
          :message="$t('LIBRARY_PAGE.ADD_EPOC')" 
          icon="library-outline"
          :action-text="$t('LIBRARY_PAGE.ADD_EPOC')"
          @action="openAddMenu()"
        />
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  IonPage, 
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  actionSheetController,
  alertController
} from '@ionic/vue';
import { useRouter } from 'vue-router';

// Components
import AppHeader from '@/components/layout/AppHeader.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import ErrorMessage from '@/components/ui/ErrorMessage.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import EpocCard from '@/components/common/EpocCard.vue';
import OnboardingSlider from '@/components/common/OnboardingSlider.vue';

// Stores
import { useLibraryStore } from '@/stores/library';
import { useOnboardingStore } from '@/stores/onboarding';
import { useLocalEpocsStore } from '@/stores/localEpocs';

// Setup i18n
const { t } = useI18n();

// Setup router
const router = useRouter();

// Setup stores
const libraryStore = useLibraryStore();
const onboardingStore = useOnboardingStore();
const localEpocsStore = useLocalEpocsStore();

// File input ref
const fileInput = ref<HTMLInputElement | null>(null);

// State
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

// Computed properties
const library = computed(() => libraryStore.library);
const customLibraries = computed(() => libraryStore.customLibraries);
const localEpocs = computed(() => localEpocsStore.localEpocs);
const onboarding = computed(() => onboardingStore.onboarding);
const epocProgresses = computed(() => libraryStore.epocProgresses);

// Methods
const fetchData = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    
    // Initialize stores
    onboardingStore.initOnboarding();
    
    // Fetch data
    await Promise.all([
      libraryStore.fetchLibrary(),
      libraryStore.fetchCustomLibraries(),
      localEpocsStore.fetchLocalEpocs()
    ]);
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error);
    isLoading.value = false;
    hasError.value = true;
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred while fetching data';
  }
};

const doRefresh = async (event: any) => {
  try {
    await fetchData();
  } finally {
    event.target.complete();
  }
};

const removeMessage = (id: string) => {
  onboardingStore.remove(id);
};

const downloadEpoc = (epoc: any, libraryId?: string) => {
  libraryStore.downloadEpoc(epoc, libraryId);
};

const openEpocMenu = async (epoc: any, libraryId?: string) => {
  await libraryStore.epocLibraryMenu(epoc, libraryId);
};

const openAddMenu = async () => {
  const buttons = [
    {
      text: t('FLOATING_MENU.IMPORT_FILE'),
      icon: '/assets/icon/importer.svg',
      handler: () => {
        fileInput.value?.click();
      }
    },
    {
      text: t('FLOATING_MENU.IMPORT_LINK'),
      icon: '/assets/icon/lien.svg',
      handler: () => {
        linkInputAlert();
      }
    },
    {
      text: t('FLOATING_MENU.IMPORT_QR'),
      icon: '/assets/icon/qr.svg',
      handler: () => {
        router.push('/library/qr');
      }
    },
    {
      text: t('COMMON.CLOSE'),
      role: 'cancel'
    }
  ];
  
  const actionSheet = await actionSheetController.create({
    header: '',
    cssClass: 'custom-action-sheet',
    mode: 'ios',
    buttons
  });
  
  await actionSheet.present();
};

const fileHandler = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    localEpocsStore.importFile(file);
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const linkInputAlert = async () => {
  const alert = await alertController.create({
    header: t('FLOATING_MENU.IMPORT_LINK'),
    buttons: [
      {
        text: t('COMMON.CANCEL'),
        role: 'cancel'
      },
      {
        text: t('COMMON.CONFIRM'),
        handler: (data) => {
          localEpocsStore.downloadLocalEpoc(data.link);
        }
      }
    ],
    inputs: [
      {
        name: 'link',
        placeholder: 'https://example.com/epoc.zip',
      }
    ],
  });

  await alert.present();
};

// Lifecycle hooks
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>
