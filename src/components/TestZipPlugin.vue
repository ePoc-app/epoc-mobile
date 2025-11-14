<script setup lang="ts">
import {ref} from 'vue';
import {Zip} from '@epoc/capacitor-zip';
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {FileTransfer} from '@capacitor/file-transfer';
import {useConvertFileSrc} from '@/composables/useConvertFileSrc';

// États réactifs
const isDownloading = ref<boolean>(false);
const isExtracting = ref<boolean>(false);
const statusMessage = ref<string>('');
const videos = ref<string[]>([]);
const { convertFileSrc } = useConvertFileSrc();

// Fonction pour télécharger et extraire le ZIP
const downloadAndExtractZip = async (): Promise<void> => {
  try {
    console.log('Début du téléchargement et de l\'extraction du ZIP');
    isDownloading.value = true;
    statusMessage.value = 'Téléchargement du fichier ZIP en cours...';

    // URL du fichier ZIP
    const zipUrl: string = 'https://epoc.inria.fr/dl/E001DB/E001DB.zip';
    const zipFileName: string = 'E001DB.zip';

    // 1. Télécharger le fichier ZIP s'il n'existe pas déjà
    const savedZipFile = await Filesystem.getUri({
      directory: Directory.Data,
      path: zipFileName
    });

    for (const dir of Object.values(Directory)) {
      console.log('Création de fichier de test dans le répertoire :', dir);
      try {
        await Filesystem.appendFile({
          directory: dir,
          data: `TEST in ${dir}`,
          path: `test-${dir}.txt`,
          encoding: Encoding.UTF8
        });
      } catch (error) {
        console.log(`Error appending file in directory ${dir}:`, error);
      }
    }

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

    const ls = await Filesystem.readdir({path:'E001DB/videos', directory: Directory.Data});


    videos.value = await Promise.all(ls.files.map(async file => {
      return await convertFileSrc(file.uri);
    }));

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
  <div>
    <ion-button @click="downloadAndExtractZip" :disabled="isDownloading || isExtracting">
      {{ isDownloading ? 'Downloading...' : isExtracting ? 'Extracting...' : 'Download and Extract ZIP' }}
    </ion-button>
    <p>{{ statusMessage }}</p>
    <video v-for="video in videos" :src="video" controls />
  </div>
</template>

<style>
div {
  text-align: center;
  margin-top: 20px;
}
video {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}
</style>
