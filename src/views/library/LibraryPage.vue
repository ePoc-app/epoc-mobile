<script setup lang="ts">
  import { actionSheetController, alertController, IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonToolbar, IonIcon, IonButton } from '@ionic/vue';
  import { settingsOutline, closeOutline, informationCircleOutline, cloudDownloadOutline, chevronForwardOutline,arrowForwardOutline, cogOutline, syncOutline} from 'ionicons/icons';
  import {useLibraryStore} from '@/stores/libraryStore';
  import { RouterLink, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n() 
  const router = useRouter()
  const libraryStore = useLibraryStore();

  /////// WIP SECTION ///////////
  import inria_collection from '@/assets/inria_collection.json'
  const localEpocs = Object.values(inria_collection.ePocs).slice(0,1)

  const localEpocsService = {
    imports : [{value : "HARD CODED"}],
    localEpocLibraryMenu: (epoc) => {libraryStore.epocLibraryMenu(t, epoc)},
    downloadLocalEpoc: (link) => {alert("TODO : download" + link )}
  }

  const fileHandler = (E006PEevent) => {console.log("TODO")}
  const doRefresh = (event) => {alert(event)}
  
  const onboarding = [
     {
      id: 'a',
      link: {
        url: '',
        text: ''
      },
      text: 'texte de onboarding 1',
      title: 'Bienvenue',
      image: '/assets/img/activity.jpg'
    },
    {
      id: 'b',
      link: {
        url: '',
        text: ''
      },
      text: 'texte de onboarding 2',
      title: 'Faites comme chez vous',
      image: 'https://ucopia.visiteurs.inrialpes.fr/101/portal/resources/_images/header.png'
    }
  ]
  const onboardingOptions = {
    slidesPerView: 1 ,
    spaceBetween: 10
  }
  const removeMessage = (id: string) => {
    alert(id)
  }
  ///////////////////////////////

  const openAddMenu = async () => {
    const buttons = [
      {
        text: 'ePoc',
        cssClass: 'separator'
      },
      {
        text: t('FLOATING_MENU.IMPORT_FILE'),
        icon: '/assets/icon/importer.svg',
        handler: () => {
          alert("TODO : import File" )
          //this.fileRef.nativeElement.click();
        }
      },
      {
        text: t('FLOATING_MENU.IMPORT_LINK'),
        icon: '/assets/icon/lien.svg',
        handler: () => {
          linkInputAlert();
        }
      },
      {
        text: t('FLOATING_MENU.IMPORT_QR'),
        icon: '/assets/icon/qr.svg',
        handler: () => {
          router.push({ name: 'WIP', params: { any: '/library/qr' } })
        }
      },
      {
        text: t('FLOATING_MENU.COLLECTION'),
        cssClass: 'separator'
      },
      {
        text: t('FLOATING_MENU.IMPORT_LINK'),
        icon: '/assets/icon/lien.svg',
        handler: () => {
          linkInputAlert();
        }
      },
      {
        text: t('FLOATING_MENU.IMPORT_QR'),
        icon: '/assets/icon/qr.svg',
        handler: () => {
          router.push({ name: 'WIP', params: { any: '/library/qr' } })
        }
      },
      {
        text: t('CLOSE'),
        role: 'cancel'
      }
    ];
    const actionSheet = await actionSheetController.create({
      header: t('FLOATING_MENU.IMPORT'),
      subHeader: t('FLOATING_MENU.IMPORT_SUBHEADER'),
      cssClass: 'custom-action-sheet import-action-sheet',
      mode: 'ios',
      buttons
    });
    await actionSheet.present();
  }

  const linkInputAlert = async () => {
    const alert = await alertController.create({
      header: t('FLOATING_MENU.IMPORT_FROM_LINK'),
      buttons: [
        {
          text: t('CANCEL'),
          role: 'cancel'
        },
        {
          text: t('CONFIRM'),
          handler: (e) => {
            if (e.link.endsWith('.json')) libraryStore.addCustomCollection(e.link);
            else localEpocsService.downloadLocalEpoc(e.link);
          }
        }
      ],
      inputs: [
        {
          name: 'link',
          placeholder: 'Saisissez le lien',
        }
      ],
    });

    await alert.present();
  }

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div aria-hidden="true" class="logo" slot="start">
          <div class="epoc-logo"></div>
          <div class="by-inria"></div>
        </div>
        <RouterLink :to="{ name: 'WIP', params: {any: '/settings'}}" slot="end">
          <ion-button role="button" class="icon-btn">
            <ion-icon aria-label="Paramètre" slot="icon-only" :icon="settingsOutline" color="inria-icon"></ion-icon>
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
      <ion-refresher slot="fixed" snapbackDuration="1000ms" v-on:ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <swiper-container v-if="onboarding && onboarding.length"
        modules="swiperModules" aria-hidden="true" class="onboarding" 
        :slidesPerView="onboardingOptions.slidesPerView" :spaceBetween="onboardingOptions.spaceBetween" 
        :pagination="onboarding.length > 1 ? 'true' : ''"
      >
        <swiper-slide v-for="item in onboarding" class="onboarding-item" :class="item.image ? 'with-image':''">
          <div class="onboarding-item-image" v-if="item.image" :style="'background-image:url('+item.image+')'"></div>
          <div class="onboarding-item-title">{{item.title}}</div>
          <div class="onboarding-item-text">{{item.text}}</div>
          <RouterLink :to="item.link.url" v-if="item.link">{{item.link.text}}</RouterLink>
          <div class="onboarding-item-close" v-on:click="removeMessage(item.id)">
            <ion-icon :icon="closeOutline"></ion-icon>
          </div>
        </swiper-slide>
      </swiper-container>
      <div id="container">
        <div v-for="collection in libraryStore.officialCollections" :key="collection.id">
          <div class="library-line-separator"></div>
          <div class="library-items" tabindex="-1">
            <div class="library-header">
              <span>{{collection.title}}</span>
              <RouterLink :to="collection.id">{{$t('LIBRARY_PAGE.VIEW_ALL')}} <ion-icon :icon="chevronForwardOutline"></ion-icon></RouterLink>
            </div>
            <div class="library-item" v-for="epoc in Object.values(collection.ePocs).slice(0,4)" :key="epoc.id">
              <RouterLink :to="{ name: 'EpocOverviewPage', params: {libraryId: collection.id, id: epoc.id}}">
                <div :aria-label="epoc.title" class="library-item-image" :style="'background-image:url('+epoc.image+')'"></div>
              </RouterLink>
              <h3 aria-hidden="true" class="library-item-title">{{epoc.title}}</h3>
              <div class="library-item-toolbar" v-if="epoc.downloaded">
                <RouterLink :to="{ name: 'TocPage', params: {id:epoc.id}}">
                  <ion-button  class="expanded" color="inria">
                    <span v-if="epoc.opened">{{$t('LIBRARY_PAGE.CONTINUE')}}</span>
                    <ion-icon aria-hidden="true" v-if="epoc.opened" :icon="arrowForwardOutline" slot="end"></ion-icon>
                    <span v-if="!epoc.opened">{{$t('LIBRARY_PAGE.DISCOVER')}}</span>
                  </ion-button>
                </RouterLink>
                <ion-button class="round" :class="{'update-available': epoc.updateAvailable}" color="inria-base-button" v-on:click="libraryStore.epocLibraryMenu(epoc, collection.id)">
                  <span aria-label="Option du chapitre" class="ellipsis base-btn">...</span>
                </ion-button>                
              </div>
              <div class="library-item-toolbar" v-if="!epoc.downloading && !epoc.downloaded && !epoc.unzipping">
                <ion-button class="expanded" color="inria-base-button" v-on:click="libraryStore.downloadEpoc(epoc, collection.id)">
                  <ion-icon aria-hidden="true" :icon="cloudDownloadOutline" slot="start"></ion-icon>
                  <span class="base-btn">{{$t('LIBRARY_PAGE.DOWNLOAD')}}</span>
                </ion-button>
              </div>
              <div class="library-item-toolbar" v-if="epoc.downloading">
                <ion-button class="expanded" :disabled="true" color="inria-base-button">
                  <ion-icon aria-hidden="true" :icon="syncOutline" class="spin" slot="start"></ion-icon>
                  <span class="base-btn">
                    {{$t('LIBRARY_PAGE.DOWNLOADING')}} 
                    <!--<template v-if="epocProgresses[epoc.id]">({{epocProgresses[epoc.id]}}%)</template>-->
                  </span>
                </ion-button>
              </div>
              <div class="library-item-toolbar" v-if="epoc.unzipping">
                <ion-button class="expanded" :disabled="true" color="inria-base-button">
                  <ion-icon aria-hidden="true" :icon="cogOutline" class="spin" slot="start"></ion-icon>
                  <span class="base-btn">
                    {{$t('LIBRARY_PAGE.OPEN_ZIP')}}
                    <!--<template v-if="epocProgresses[epoc.id]">({{epocProgresses[epoc.id]}}%)</template>-->
                  </span>
                </ion-button>
              </div>
            </div>
            <div class="library-footer" v-if="Object.keys(collection.ePocs).length > 4">
              <RouterLink :to="collection.id">{{$t('LIBRARY_PAGE.VIEW_ALL')}} <ion-icon :icon="chevronForwardOutline"></ion-icon></RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="library-separator"><span>{{$t('MISSING.MY_EPOCS')}}</span></div>
      <div class="library-items">
        <div class="library-item" v-for="epoc of localEpocs">
          <RouterLink :to="{ name: 'WIP', params: {any: '/library/'+ epoc.dir}}">
            <div role="link" :aria-label="epoc.title" class="library-item-image" :style="'background-image:url('+epoc.rootFolder+epoc.image+')'"></div>
          </RouterLink>
          <h3 aria-hidden="true" class="library-item-title">{{epoc.title}}</h3>
          <div class="library-item-toolbar">
            <RouterLink :to="{ name: 'TocPage', params: {id:epoc.id}}">
              <ion-button  class="expanded" color="inria">
                <span>{{$t('LIBRARY_PAGE.OPEN')}}</span>
              </ion-button>
            </RouterLink>
            <ion-button class="round" :class="{'update-available': epoc.updateAvailable}" color="inria-base-button" v-on:click="localEpocsService.localEpocLibraryMenu(epoc)">
              <span :aria-label="$t('MISSING.CHAPTER_OPTIONS')" class="ellipsis base-btn">...</span>
            </ion-button>
          </div>
        </div>
        <div class="library-item library-item-import" v-for="item of localEpocsService.imports">
          <div class="library-item-image"></div>
          <h3 aria-hidden="true" class="library-item-title">{{item.value}}</h3>
        </div>
        <div class="library-item library-item-add" v-on:click="openAddMenu()">
          <div class="library-item-image">
            <ion-icon aria-hidden="true" src="/assets/icon/ajouter.svg" size="large"></ion-icon>
          </div>
          <h3 aria-hidden="true" class="library-item-title">{{$t('LIBRARY_PAGE.ADD_EPOC')}}</h3>
        </div>
        <!--<input type="file" accept="application/octet-stream,application/zip" hidden v-on:change="fileHandler($event)" #file>-->
        <input type="file" accept="application/octet-stream,application/zip" hidden v-on:change="fileHandler($event)">
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
@use "@/theme/library.scss"
</style>
