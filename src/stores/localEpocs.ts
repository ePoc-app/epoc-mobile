import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { actionSheetController, alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Types
interface LocalEpoc {
  id: string;
  dir: string;
  title: string;
  image: string;
  rootFolder: string;
  lastModified: string;
}

export const useLocalEpocsStore = defineStore('localEpocs', () => {
  // State
  const localEpocs = ref<LocalEpoc[]>([]);
  const imports = ref<Record<string, string>>({});
  
  // Router and i18n
  const router = useRouter();
  const { t } = useI18n();
  
  // Fetch local epocs
  async function fetchLocalEpocs() {
    try {
      if (Capacitor.isNativePlatform()) {
        // For native platforms, read from filesystem
        const result = await Filesystem.readdir({
          path: 'epocs',
          directory: Directory.Data
        });
        
        const epocs: LocalEpoc[] = [];
        
        for (const entry of result.files) {
          if (entry.type === 'directory') {
            try {
              const contentFile = await Filesystem.readFile({
                path: `epocs/${entry.name}/content.json`,
                directory: Directory.Data,
                encoding: 'utf8'
              });
              
              const content = JSON.parse(contentFile.data);
              epocs.push({
                id: entry.name,
                dir: entry.name,
                title: content.title || 'Unknown',
                image: content.image || '',
                rootFolder: Capacitor.convertFileSrc(`${Directory.Data}/epocs/${entry.name}/`),
                lastModified: content.lastModif || new Date().toISOString()
              });
            } catch (error) {
              console.error(`Error reading content for ${entry.name}:`, error);
            }
          }
        }
        
        localEpocs.value = epocs;
      } else {
        // For web, use demo data
        localEpocs.value = [
          {
            id: 'demo',
            dir: 'demo',
            title: 'Demo ePoc',
            image: '/assets/img/demo-epoc.jpg',
            rootFolder: '/assets/demo/',
            lastModified: new Date().toISOString()
          }
        ];
      }
    } catch (error) {
      console.error('Error fetching local epocs:', error);
      localEpocs.value = [];
    }
  }
  
  // Import a file
  async function importFile(file: File) {
    try {
      // Generate a unique ID for the import
      const importId = Date.now().toString();
      
      // Add to imports (to show in UI)
      imports.value = {
        ...imports.value,
        [importId]: file.name
      };
      
      if (Capacitor.isNativePlatform()) {
        // For native platforms, write to filesystem
        // This is a placeholder - in a real app, you would:
        // 1. Write the file to a temporary location
        // 2. Unzip it
        // 3. Process the contents
        // 4. Add it to localEpocs
        
        // Simulate success after a delay
        setTimeout(() => {
          // Remove from imports
          const { [importId]: _, ...rest } = imports.value;
          imports.value = rest;
          
          // Refresh local epocs
          fetchLocalEpocs();
        }, 2000);
      } else {
        // For web, just simulate success
        setTimeout(() => {
          // Remove from imports
          const { [importId]: _, ...rest } = imports.value;
          imports.value = rest;
          
          // Add a demo epoc
          localEpocs.value = [
            ...localEpocs.value,
            {
              id: `imported-${importId}`,
              dir: `imported-${importId}`,
              title: file.name.replace('.zip', ''),
              image: '/assets/img/demo-epoc.jpg',
              rootFolder: '/assets/demo/',
              lastModified: new Date().toISOString()
            }
          ];
        }, 2000);
      }
    } catch (error) {
      console.error('Error importing file:', error);
    }
  }
  
  // Download a local epoc from URL
  async function downloadLocalEpoc(url: string) {
    try {
      // Generate a unique ID for the download
      const downloadId = Date.now().toString();
      
      // Add to imports (to show in UI)
      imports.value = {
        ...imports.value,
        [downloadId]: url
      };
      
      if (Capacitor.isNativePlatform()) {
        // For native platforms, download and process
        // This is a placeholder - in a real app, you would:
        // 1. Download the file
        // 2. Unzip it
        // 3. Process the contents
        // 4. Add it to localEpocs
        
        // Simulate success after a delay
        setTimeout(() => {
          // Remove from imports
          const { [downloadId]: _, ...rest } = imports.value;
          imports.value = rest;
          
          // Refresh local epocs
          fetchLocalEpocs();
        }, 2000);
      } else {
        // For web, just simulate success
        setTimeout(() => {
          // Remove from imports
          const { [downloadId]: _, ...rest } = imports.value;
          imports.value = rest;
          
          // Add a demo epoc
          localEpocs.value = [
            ...localEpocs.value,
            {
              id: `downloaded-${downloadId}`,
              dir: `downloaded-${downloadId}`,
              title: url.split('/').pop()?.replace('.zip', '') || 'Downloaded ePoc',
              image: '/assets/img/demo-epoc.jpg',
              rootFolder: '/assets/demo/',
              lastModified: new Date().toISOString()
            }
          ];
        }, 2000);
      }
    } catch (error) {
      console.error('Error downloading epoc:', error);
    }
  }
  
  // Delete a local epoc
  async function deleteLocalEpoc(epoc: LocalEpoc) {
    try {
      if (Capacitor.isNativePlatform()) {
        // For native platforms, delete from filesystem
        await Filesystem.rmdir({
          path: `epocs/${epoc.dir}`,
          directory: Directory.Data,
          recursive: true
        });
      }
      
      // Remove from local epocs
      localEpocs.value = localEpocs.value.filter(e => e.id !== epoc.id);
    } catch (error) {
      console.error('Error deleting local epoc:', error);
    }
  }
  
  // Show menu for a local epoc
  async function localEpocLibraryMenu(epoc: LocalEpoc) {
    const buttons = [
      {
        text: t('FLOATING_MENU.TOC'),
        icon: 'list-circle-outline',
        handler: () => {
          router.push(`/epoc/toc/${epoc.id}`);
        }
      },
      {
        text: t('FLOATING_MENU.DELETE'),
        icon: 'trash',
        handler: () => {
          confirmDeleteLocalEpoc(epoc);
        }
      },
      {
        text: 'Fermer',
        role: 'cancel'
      }
    ];
    
    const actionSheet = await actionSheetController.create({
      header: epoc.title,
      cssClass: 'custom-action-sheet',
      mode: 'ios',
      buttons
    });
    
    await actionSheet.present();
  }
  
  // Confirm deletion of a local epoc
  async function confirmDeleteLocalEpoc(epoc: LocalEpoc) {
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
            deleteLocalEpoc(epoc);
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  return {
    localEpocs,
    imports,
    fetchLocalEpocs,
    importFile,
    downloadLocalEpoc,
    deleteLocalEpoc,
    localEpocLibraryMenu
  };
});
