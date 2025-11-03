<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
  import { settingsOutline, informationCircleOutline } from 'ionicons/icons';
  import {useLibraryStore} from '@/stores/libraryStore';

  const libraryStore = useLibraryStore();
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div aria-hidden="true" class="logo" slot="start">
          <div class="epoc-logo"></div>
          <div class="by-inria"></div>
        </div>
        <ion-button role="button" class="icon-btn" slot="end" routerLink="/settings" routerDirection="forward">
          <ion-icon aria-label="Paramètre" slot="icon-only" :icon="settingsOutline" color="inria-icon"></ion-icon>
        </ion-button>
        <ion-button role="button" class="icon-btn" slot="end" routerLink="/about" routerDirection="forward">
          <ion-icon aria-label="Informations" slot="icon-only" :icon="informationCircleOutline" color="inria-icon"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>Ready to create an app?</strong>
        <p class="test_library">Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>

        <ul>
          <li v-for="collection in libraryStore.officialCollections" :key="collection.id">
            {{ collection.id }}
            <ul>
              <li v-for="epoc in collection.ePocs" :key="epoc.id">
                {{ epoc.title }} : <a :href="epoc.download" target="_blank">{{ epoc.download }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
p {
  // TODO if this section stay empty, find a way to remove it properly
  // for now if no style, the imported global style is not imported either.
}
</style>
