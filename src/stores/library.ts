import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { useSettingsStore } from './settings';
import { useReadingStore } from './reading';
import { actionSheetController, alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Types
interface EpocLibrary {
  id: string;
  title: string;
  image: string;
  download: string;
  lastModified: string;
  downloading: boolean;
  downloaded: boolean;
  unzipping: boolean;
  opened: boolean;
  updateAvailable: boolean;
}

interface CustomLibrary {
  name: string;
  url: string;
  epocs: EpocLibrary[];
}

export const useLibraryStore = defineStore('library', () => {
  // State
  const library = ref<EpocLibrary[]>([]);
  const customLibraries = ref<Record<string, CustomLibrary>>({});
  const epocProgresses = ref<Record<string, number>>({});
  
  // Router and i18n
  const router = useRouter();
  const { t } = useI18n();
  
  // Other stores
  const settingsStore = useSettingsStore();
  const readingStore = useReadingStore();
  
  // Computed
  const libraryUrl = computed(() => {
    return settingsStore.settings?.libraryMode || '';
  });
  
  // Actions
  function updateEpocLibraryState(epocId: string, {
    downloading = false,
    unzipping = false,
    downloaded = false,
    opened,
    updateAvailable = false
  }: {
    downloading?: boolean,
    unzipping?: boolean,
    downloaded?: boolean,
    opened?: boolean,
    updateAvailable?: boolean
  }, libraryId?: string) {
    if (libraryId) {
      const customLibs = customLibraries.value;
      const epocIndex = customLibs[libraryId]?.epocs.findIndex(item => item.id === epocId);
      if (epocIndex === -1) return;
      const epoc = customLibs[libraryId].epocs[epocIndex];
      epoc.downloading = downloading;
      epoc.downloaded = downloaded;
      epoc.unzipping = unzipping;
      epoc.opened = typeof opened !== 'undefined' ? opened : epoc.opened;
      epoc.updateAvailable = updateAvailable;
      customLibraries.value = { ...customLibs };
    } else {
      const epocIndex = library.value.findIndex(item => item.id === epocId);
      if (epocIndex === -1) return;
      const epoc = library.value[epocIndex];
      epoc.downloading = downloading;
      epoc.downloaded = downloaded;
      epoc.unzipping = unzipping;
      epoc.opened = typeof opened !== 'undefined' ? opened : epoc.opened;
      epoc.updateAvailable = updateAvailable;
      library.value = [...library.value];
    }
  }
  
  function addEpocProgress(epocId: string) {
    updateEpocProgress(epocId, 0);
  }
  
  function updateEpocProgress(epocId: string, progress: number) {
    epocProgresses.value = {
      ...epocProgresses.value,
      [epocId]: progress
    };
  }
  
  async function fetchLibrary() {
    try {
      // Get cached library first
      const cachedLibrary = JSON.parse(localStorage.getItem('library') || '[]');
      if (cachedLibrary.length > 0) {
        library.value = cachedLibrary.map((item: EpocLibrary) => ({
          ...item,
          downloading: false,
          downloaded: false,
          unzipping: false,
          opened: false
        }));
      }
      
      // Fetch from server
      const response = await axios.get<EpocLibrary[]>(libraryUrl.value);
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Cache the response
        localStorage.setItem('library', JSON.stringify(response.data));
        
        // Update the library
        library.value = response.data.map((item: EpocLibrary) => ({
          ...item,
          downloading: false,
          downloaded: false,
          unzipping: false,
          opened: false
        }));
        
        // Check for downloaded epocs
        library.value.forEach(epoc => {
          readEpocContent(epoc.id).then(localEpoc => {
            const downloadDate = localEpoc.lastModif ? new Date(localEpoc.lastModif.replace(/-/g, '/')) : new Date();
            const updateAvailable = new Date(epoc.lastModified) > downloadDate;
            updateEpocLibraryState(epoc.id, { downloaded: true, updateAvailable });
          }).catch(() => {
            // Not downloaded
          });
        });
        
        // Check for opened epocs
        const readings = readingStore.readings;
        if (readings) {
          library.value.forEach(epoc => {
            updateEpocLibraryState(
              epoc.id,
              {
                downloaded: epoc.downloaded,
                opened: readings.findIndex(reading => reading.epocId === epoc.id) !== -1
              }
            );
          });
        }
      }
    } catch (error) {
      console.error('Error fetching library:', error);
    }
  }
  
  async function fetchCustomLibraries() {
    try {
      const customLibs: Record<string, CustomLibrary> = {};
      
      // Process each custom library
      for (const library of settingsStore.settings?.customLibrairies || []) {
        try {
          const response = await axios.get<EpocLibrary[]>(library.url);
          const libraryId = hashString(library.url);
          
          const customLib: CustomLibrary = {
            ...library,
            epocs: response.data.map(epoc => {
              const epocWithId = {
                ...epoc,
                id: `${libraryId}-${epoc.id}`, // prefix ePoc id by library id
                downloading: false,
                downloaded: false,
                unzipping: false,
                opened: false,
                updateAvailable: false
              };
              
              // Check if downloaded
              readEpocContent(epocWithId.id).then(localEpoc => {
                const downloadDate = localEpoc.lastModif ? new Date(localEpoc.lastModif.replace(/-/g, '/')) : new Date();
                const updateAvailable = new Date(epoc.lastModified) > downloadDate;
                updateEpocLibraryState(epocWithId.id, { downloaded: true, updateAvailable }, libraryId);
              }).catch(() => {
                // Not downloaded
              });
              
              return epocWithId;
            })
          };
          
          customLibs[libraryId] = customLib;
        } catch (error) {
          console.error(`Error fetching custom library ${library.url}:`, error);
        }
      }
      
      customLibraries.value = customLibs;
    } catch (error) {
      console.error('Error fetching custom libraries:', error);
    }
  }
  
  async function readEpocContent(epocId: string) {
    try {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        const file = await Filesystem.readFile({
          path: `../Library/NoCloud/epocs/${epocId}/content.json`,
          directory: Directory.Data,
          encoding: Encoding.UTF8
        });
        return JSON.parse(file.data);
      } else {
        const rootDirectory = Capacitor.isNativePlatform() ? Capacitor.convertFileSrc('file:///data/user/0/fr.inria.epoc/files/') : 'assets/demo/';
        const url = `${rootDirectory}epocs/${epocId}/content.json`;
        const response = await axios.get(url);
        return response.data;
      }
    } catch (error) {
      throw new Error(`Error reading epoc content: ${error}`);
    }
  }
  
  function downloadEpoc(epoc: EpocLibrary, libraryId?: string) {
    // This is a placeholder for the actual download implementation
    // In a real app, you would use Capacitor plugins to download and unzip files
    console.log(`Downloading epoc ${epoc.id} from ${epoc.download}`);
    
    updateEpocLibraryState(epoc.id, { downloading: true }, libraryId);
    addEpocProgress(epoc.id);
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateEpocProgress(epoc.id, progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        updateEpocLibraryState(epoc.id, { downloading: false, unzipping: true }, libraryId);
        
        // Simulate unzipping
        setTimeout(() => {
          updateEpocLibraryState(epoc.id, { unzipping: false, downloaded: true }, libraryId);
        }, 1000);
      }
    }, 500);
  }
  
  function deleteEpoc(epoc: EpocLibrary, libraryId?: string) {
    // This is a placeholder for the actual delete implementation
    console.log(`Deleting epoc ${epoc.id}`);
    
    // In a real app, you would use Capacitor plugins to delete files
    setTimeout(() => {
      updateEpocLibraryState(epoc.id, { downloaded: false, opened: false }, libraryId);
    }, 500);
  }
  
  async function epocLibraryMenu(epoc: EpocLibrary, libraryId?: string) {
    const buttons = [
      {
        text: t('FLOATING_MENU.TOC'),
        icon: 'list-circle-outline',
        handler: () => {
          router.push(`/epoc/toc/${epoc.id}`);
        }
      },
      {
        text: t('FLOATING_MENU.CERTIFICATE'),
        icon: 'star-outline',
        handler: () => {
          router.push(`/epoc/score/${epoc.id}`);
        }
      },
      {
        text: t('FLOATING_MENU.LICENSE'),
        icon: 'receipt-outline',
        handler: () => {
          // TODO: Implement license display
          console.log('Display license for', epoc.id);
        }
      }
    ];
    
    if (epoc.updateAvailable) {
      buttons.push({
        text: t('FLOATING_MENU.UPDATE'),
        icon: 'cloud-download-outline',
        handler: () => {
          deleteEpoc(epoc, libraryId);
          downloadEpoc(epoc, libraryId);
        }
      });
    }
    
    if (epoc.opened) {
      buttons.push({
        text: t('FLOATING_MENU.RESET'),
        icon: 'refresh-outline',
        handler: () => {
          confirmReset(epoc, libraryId);
        }
      });
    }
    
    buttons.push({
      text: t('FLOATING_MENU.DELETE'),
      icon: 'trash',
      handler: () => {
        confirmDelete(epoc, libraryId);
      }
    });
    
    buttons.push({
      text: 'Fermer',
      role: 'cancel'
    });
    
    const actionSheet = await actionSheetController.create({
      header: epoc.title,
      cssClass: 'custom-action-sheet',
      mode: 'ios',
      buttons
    });
    
    await actionSheet.present();
  }
  
  async function confirmReset(epoc: EpocLibrary, libraryId?: string) {
    const alert = await alertController.create({
      header: 'Confirmation',
      message: `Attention la réinitialisation de l'ePoc <b>"${epoc.title}"</b> supprimera toute votre progression`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Confirmer',
          handler: () => {
            readingStore.removeReading(epoc.id);
            updateEpocLibraryState(epoc.id, {
              downloaded: epoc.downloaded,
              opened: false
            }, libraryId);
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async function confirmDelete(epoc: EpocLibrary, libraryId?: string) {
    const alert = await alertController.create({
      header: 'Confirmation',
      message: `Merci de confimer la suppresion de l'ePoc <b>"${epoc.title}"</b>`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Confirmer',
          handler: () => {
            deleteEpoc(epoc, libraryId);
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  // Helper function to hash a string
  function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
  
  return {
    library,
    customLibraries,
    epocProgresses,
    fetchLibrary,
    fetchCustomLibraries,
    downloadEpoc,
    deleteEpoc,
    epocLibraryMenu,
    updateEpocLibraryState,
    updateEpocProgress
  };
});
