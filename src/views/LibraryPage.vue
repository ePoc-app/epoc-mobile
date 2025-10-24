<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
  import { settingsOutline, informationCircleOutline } from 'ionicons/icons';
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
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
p {
  color: $inria-red
}
</style>
