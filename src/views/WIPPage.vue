<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonBackButton, IonButton } from '@ionic/vue';
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
       WORK IN PROGRESS : {{$route.params.any}}
      </div>
      
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>
