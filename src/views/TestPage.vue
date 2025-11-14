<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonToolbar, IonIcon, IonBackButton, IonButton } from '@ionic/vue';
  import {informationCircleOutline } from 'ionicons/icons';
  import {useEpocStore} from '@/stores/epocStore';
  import {useRoute} from 'vue-router';
  import {onMounted} from 'vue';

  const epocStore = useEpocStore();
  const route = useRoute();
  const epoc = epocStore.epoc;

  console.log(route.params.id);

  onMounted(async () => {
    await epocStore.getEpocById(route.params.id);
  });

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
      <div v-if="epocStore.epoc">
        epoc.title : {{epocStore.epoc.title}} <br/>
        epoc.id : {{epocStore.epoc.id}} <br/>
        epoc.description : {{epocStore.epoc.description}} <br/>
        epoc.author : {{epocStore.epoc.authors}} <br/>
      </div>
      
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>
