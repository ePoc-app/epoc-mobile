<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { ref } from 'vue';
import { Zip } from '@epoc/capacitor-zip';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileTransfer } from '@capacitor/file-transfer';
import { Capacitor } from '@capacitor/core';

// États réactifs
const isDownloading = ref<boolean>(false);
const isExtracting = ref<boolean>(false);
const statusMessage = ref<string>('');

// Fonction pour télécharger et extraire le ZIP
const downloadAndExtractZip = async (): Promise<void> => {
  try {
    console.log('Début du téléchargement et de l\'extraction du ZIP');
    isDownloading.value = true;
    statusMessage.value = 'Téléchargement du fichier ZIP en cours...';

    // URL du fichier ZIP
    const zipUrl: string = 'https://scorm.com/wp-content/assets/golf_examples/PIFS/ContentPackagingSingleSCO_SCORM12.zip';
    const zipFileName: string = 'example.zip';

    // 1. Télécharger le fichier ZIP s'il n'existe pas déjà
    const savedZipFile = await Filesystem.getUri({
      directory: Directory.Data,
      path: zipFileName
    });

    console.log('Téléchargement du fichier ZIP depuis :', zipUrl);
    // Then use the FileTransfer plugin to download
    await FileTransfer.downloadFile({
      url: zipUrl,
      path: savedZipFile.uri
    });

    console.log('Fichier ZIP sauvegardé localement à :', savedZipFile.uri);

    statusMessage.value = 'Fichier ZIP téléchargé. Extraction en cours...';
    isDownloading.value = false;
    isExtracting.value = true;

    console.log('Début de l\'extraction du fichier ZIP');

    // 3. Extraire le fichier ZIP avec votre plugin
    const extractPath = await Filesystem.getUri({
      directory: Directory.Data,
      path: zipFileName.replace('.zip', '').replace('.epoc', '').replace('.epocproject', '')
    });

    console.log('Extraction vers le chemin :', extractPath.uri);

    const extractResult = await Zip.unzip({
      source: savedZipFile.uri,
      destination: extractPath.uri
    });

    const ls = await Filesystem.readdir({path:'', directory: Directory.Data});

    console.log('Résultat de l\'extraction :', extractResult, ls);

    if (extractResult.success) {
      statusMessage.value = 'Fichier ZIP extrait avec succès !';
    } else {
      throw new Error(extractResult.message || 'Échec de l\'extraction');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    statusMessage.value = `Erreur : ${errorMessage}`;
  } finally {
    isDownloading.value = false;
    isExtracting.value = false;
  }
};
</script>

<template>
  <ion-button @click="downloadAndExtractZip" :disabled="isDownloading || isExtracting">
    {{ isDownloading ? 'Downloading...' : isExtracting ? 'Extracting...' : 'Download and Extract ZIP' }}
  </ion-button>
  <p>{{ statusMessage }}</p>
</template>
