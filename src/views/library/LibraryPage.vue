<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
  import { settingsOutline, informationCircleOutline } from 'ionicons/icons';
  import {useLibraryStore} from '@/stores/libraryStore';
  import { RouterLink } from 'vue-router';

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
        <div v-for="collection in libraryStore.officialCollections" :key="collection.id">
          <div class="library-line-separator"></div>
          <div class="library-items" tabindex="-1">
            <div class="library-header">
              <span>{{collection.title}}</span>
              <RouterLink :to="collection.id">{{$t('LIBRARY_PAGE.VIEW_ALL')}} <ion-icon name="chevron-forward-outline"></ion-icon></RouterLink>
            </div>
            <div class="library-item" v-for="epoc in Object.values(collection.ePocs).slice(0,4)" :key="epoc.id">
              <div role="link" :aria-label="epoc.title" class="library-item-image" :routerLink="'/library/'+collection.id+'/'+epoc.id" :style="'background-image:url('+epoc.image+')'"></div>
              <h3 aria-hidden="true" class="library-item-title">{{epoc.title}}</h3>
              <div class="library-item-toolbar" v-if="epoc.downloaded">
                <ion-button  class="expanded" color="inria" :routerLink="'/epoc/toc/'+epoc.id">
                  <span v-if="epoc.opened">{{$t('LIBRARY_PAGE.CONTINUE')}}</span>
                  <ion-icon aria-hidden="true" v-if="epoc.opened" name="arrow-forward-outline" slot="end"></ion-icon>
                  <span v-if="!epoc.opened">{{$t('LIBRARY_PAGE.DISCOVER')}}</span>
                </ion-button>
                <ion-button class="round" :class="{'update-available': epoc.updateAvailable}" color="inria-base-button" v-on:click="libraryStore.epocLibraryMenu(epoc, collection.id)">
                  <span aria-label="Option du chapitre" class="ellipsis base-btn">...</span>
                </ion-button>                
              </div>
              <div class="library-item-toolbar" v-if="!epoc.downloading && !epoc.downloaded && !epoc.unzipping">
                <ion-button class="expanded" color="inria-base-button" v-on:click="libraryStore.downloadEpoc(epoc, collection.id)">
                  <ion-icon aria-hidden="true" name="cloud-download-outline" slot="start"></ion-icon>
                  <span class="base-btn">{{$t('LIBRARY_PAGE.DOWNLOAD')}}</span>
                </ion-button>
              </div>
              <div class="library-item-toolbar" v-if="epoc.downloading">
                <ion-button class="expanded" disabled="true" color="inria-base-button">
                  <ion-icon aria-hidden="true" name="sync-outline" class="spin" slot="start"></ion-icon>
                  <span class="base-btn">
                    {{$t('LIBRARY_PAGE.DOWNLOADING')}} 
                    <!--<template v-if="epocProgresses[epoc.id]">({{epocProgresses[epoc.id]}}%)</template>-->
                  </span>
                </ion-button>
              </div>
              <div class="library-item-toolbar" v-if="epoc.unzipping">
                <ion-button class="expanded" disabled="true" color="inria-base-button">
                  <ion-icon aria-hidden="true" name="cog-outline" class="spin" slot="start"></ion-icon>
                  <span class="base-btn">
                    {{$t('LIBRARY_PAGE.OPEN_ZIP')}}
                    <!--<template v-if="epocProgresses[epoc.id]">({{epocProgresses[epoc.id]}}%)</template>-->
                  </span>
                </ion-button>
              </div>
            </div>
            <div class="library-footer" v-if="Object.keys(collection.ePocs).length > 4">
              <RouterLink :to="collection.id">{{$t('LIBRARY_PAGE.VIEW_ALL')}} <ion-icon name="chevron-forward-outline"></ion-icon></RouterLink>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
@use "@/theme/library.scss"
</style>
