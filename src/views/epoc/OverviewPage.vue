<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonToolbar, IonIcon, IonBackButton, IonButton } from '@ionic/vue';
  import { informationCircleOutline } from 'ionicons/icons';
  import { useRoute } from 'vue-router';
  import { useLibraryStore } from '@/stores/libraryStore';
  import { EpocLibrary } from '@/types/epoc';

  const route = useRoute()
  const libraryStore = useLibraryStore()

  // WIP SECTION //////
  const getLocalEpoc = (dir: string) => {
    return getEpocFromCollection(dir, "not implemented yet");
  }
  //////

  const getEpoc = () : EpocLibrary | undefined => {
    let epoc = undefined;
    if (route.params.dir) {
      epoc = getLocalEpoc(route.params.dir.toString())
    } else {
      const collectionId = route.params.libraryId.toString()
      const epocId = route.params.id.toString()
      epoc = getEpocFromCollection(collectionId, epocId)
    }
    return epoc
  };

  const getEpocFromCollection = (collectionId : string, epocId: string) : EpocLibrary | undefined =>  {
    const collections = { ...libraryStore.customCollections, ...libraryStore.officialCollections };
    const collection = collections[collectionId];
    if (collection && collection.ePocs[epocId]) {
        return collection.ePocs[epocId];
    }
  };

  const epoc: EpocLibrary | undefined = getEpoc()


  // this.libraryService.epocProgresses$.subscribe((epocProgresses) => {
  // this.epocProgresses = epocProgresses;
  // this.ref.detectChanges();

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div aria-hidden="true" class="logo" slot="start">
          <div class="epoc-logo"></div>
          <div class="by-inria"></div>
        </div>
        <RouterLink to="library" slot="end">
          <ion-button role="button" class="icon-btn">
            <ion-back-button :aria-label="$t('RETURN')" text="" color="inria-icon"></ion-back-button>
          </ion-button>
        </RouterLink>
        <RouterLink :to="{ name: 'WIP', params: {any: '/about'}}" slot="end">
          <ion-button role="button" class="icon-btn">
            <ion-icon aria-label="Informations" slot="icon-only" :icon="informationCircleOutline" color="inria-icon"></ion-icon>
          </ion-button>
        </RouterLink>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
       WORK IN PROGRESS : {{epoc}}
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>
