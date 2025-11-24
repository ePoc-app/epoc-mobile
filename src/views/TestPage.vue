<script setup lang="ts">
import {IonBackButton, IonButton, IonContent, IonHeader, IonIcon, IonPage, IonToolbar} from '@ionic/vue';
import {informationCircleOutline} from 'ionicons/icons';
import {useEpocStore} from '@/stores/epocStore';
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {useConvertFileSrc} from '@/composables/useConvertFileSrc';
import FlipCard from '@/components/FlipCard.vue';

const flipCardRef = ref<InstanceType<typeof FlipCard> | null>(null);

const epocStore = useEpocStore();
  const route = useRoute();
  const epoc = epocStore.epoc;
  const files = ref<string[]>([]);
  const { convertFileSrc } = useConvertFileSrc();

  console.log(route.params.id);

  onMounted(async () => {
    await epocStore.getEpocById(route.params.id);
    const result = await Filesystem.readdir({
      path: '/epocs/E006PE/images',
      directory: Directory.LibraryNoCloud
    })

    for (const file of result.files) {
      if (file.type !== 'file' || !file.uri.endsWith('.png')) {
        continue;
      }
      files.value.push(file.uri);
    }

    console.log('Files in epoc directory:', files.value);
  });

const flip = (): void => {
  if (flipCardRef.value) {
    flipCardRef.value.flip();
  }
};

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

      <FlipCard ref="flipCardRef" :init-flipped="true" @click="flip">
        <template #front>
          <div v-for="(file, index) in files" :key="index" style="margin-bottom: 16px;">
            <img :src="convertFileSrc(file)" alt="Image" style="width: 100%; height: auto;" />
          </div>
        </template>
        <template #back>
          <div style="padding: 16px;">
            <h2>Description</h2>
            <p>{{ epoc?.description }}</p>
          </div>
        </template>
      </FlipCard>
      
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>
