<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonBackButton, IonButton } from '@ionic/vue';
  import { settingsOutline, informationCircleOutline } from 'ionicons/icons';
  import { useRoute } from 'vue-router';
  import { useLibraryStore } from '@/stores/libraryStore';
  const route = useRoute()
  const collectionId = route.params.libraryId 
  const epocId = route.params.id
  
  if (this.route.snapshot.paramMap.get('dir')) {
            this.localEpocsService.localEpocs$.subscribe((data: EpocLibrary[]) => {
                const dir = `local-epocs/${this.route.snapshot.paramMap.get('dir')}`;
                this.epoc = data.find(epoc => epoc.dir === dir);
                if (this.epoc) this.rootFolder = this.epoc.rootFolder;
            });
        } else {
            combineLatest([
                this.libraryService.officialCollections$,
                this.libraryService.customCollections$
            ]).subscribe(([officialCollections, customCollections]) => {
                const collections = { ...customCollections, ...officialCollections };
                const collection = collections[this.route.snapshot.paramMap.get('libraryId')];
                const ePocId = this.route.snapshot.paramMap.get('id');
                if (collection && collection.ePocs[ePocId]) {
                    this.epoc = collection.ePocs[ePocId];
                }
            });
        }
        this.libraryService.epocProgresses$.subscribe((epocProgresses) => {
            this.epocProgresses = epocProgresses;
            this.ref.detectChanges();
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
      <div id="container">
       WORK IN PROGRESS : {{$route.params.id}}
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>
