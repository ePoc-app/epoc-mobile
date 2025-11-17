<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonButtons, IonIcon, IonBackButton, IonButton } from '@ionic/vue';
  import { RouterLink, useRoute } from 'vue-router';
  import { checkmarkOutline, menuOutline, arrowForwardOutline, timeOutline, documentTextOutline,playOutline,musicalNotesOutline,checkboxOutline,bulbOutline, gitBranchOutline, chevronForwardOutline } from 'ionicons/icons';
  import { useEpocStore } from '@/stores/epocStore';
  import {Epoc} from '@/types/epoc';
  import { ref } from 'vue';
  import { denormalize } from '@/utils/transform';
  import { onBeforeMount } from 'vue'; 

  const route = useRoute();
  const epocStore = useEpocStore();

  onBeforeMount(async () => {
    const id = route.params.id.toString();
    await epocStore.getEpocById(id);
  });

  const displayMenu = () => {
    epocStore.epocMainMenu;
  };

  const toggleDetails = (chapter) => {
    chapter.opened = !chapter.opened;
  }
  
  // WIP //
  /////////

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
            <ion-buttons slot="start">
                <ion-back-button text="" defaultHref="/home" color="inria-icon"></ion-back-button>
            </ion-buttons>
            <ion-title>{{$t('TOC_PAGE.HEADER')}}</ion-title>
            <ion-buttons slot="end">
                <ion-button v-on:click="displayMenu()">
                    <ion-icon slot="icon-only" :icon="menuOutline" color="inria-icon"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <div v-if="epocStore.epoc" class="wrapper">
            <div class="toc-header">
                <img aria-hidden="true" alt="ePoc Image" :src="epocStore.rootFolder +  epocStore.epoc.image">
                <div class="toc-header-title">{{epocStore.epoc.title}}</div>
            </div>
            <div class="toc-content" tabindex="-1">
                <div class="toc-chapter" v-for="chapter of denormalize(epocStore.epoc.chapters)">
                    <div class="toc-chapter-summary">
                        <div class="toc-chapter-progress" :class="{'done':chapter.done}">
                            <ion-icon aria-hidden="true" :icon="checkmarkOutline" v-if="chapter.done"></ion-icon>
                            <ion-icon aria-hidden="true" :icon="arrowForwardOutline" v-if="!chapter.done && chapter.chapterOpened"></ion-icon>
                            <ion-icon aria-hidden="true" :icon="timeOutline" v-if="!chapter.done && !chapter.chapterOpened"></ion-icon>
                        </div>
                        <div class="toc-chapter-info">
                            <RouterLink :to="{ name: 'WIP', params: {any: chapter.resumeLink}}" class="toc-chapter-info-title">
                                <div class="toc-chapter-info-label">
                                    {{chapter.title}}
                                </div>
                                {{chapter.subtitle}}
                            </RouterLink>
                            <div class="toc-chapter-info-details" v-on:click="toggleDetails(chapter)">
                                <template v-if="chapter.opened">{{$t('TOC_PAGE.VIEW_LESS')}}</template>
                                <template v-if="!chapter.opened">{{$t('TOC_PAGE.VIEW_MORE')}}</template>
                            </div>
                        </div>
                        <RouterLink :to="{ name: 'WIP', params: {any: chapter.resumeLink}}" class="toc-chapter-open" :aria-label="$t('TOC_PAGE.NEXT_CHAPTER')">
                            <ion-icon aria-hidden="true" :icon="chevronForwardOutline" color="inria"></ion-icon>
                        </RouterLink>

                    </div>
                    <div class="toc-chapter-details" v-if="chapter.opened">
                        <template v-for="content of denormalize(chapter.contents, epocStore.epoc.contents)">
                            <template v-if="!content.hidden">
                              <RouterLink :to="{ name: 'WIP', params: {any: '/epoc/play/'+epocStore.epoc.id+'/'+chapter.id+'/content/'+content.id}}" class="toc-chapter-details-item" :class="{'viewed':content.viewed}">
                                  <div aria-hidden="true" class="toc-chapter-details-item-icon">
                                      <ion-icon v-if="content.type === 'html'" :icon="documentTextOutline" slot="start"></ion-icon>
                                      <ion-icon v-if="content.type === 'video'" :icon="playOutline" slot="start"></ion-icon>
                                      <ion-icon v-if="content.type === 'audio'" :icon="musicalNotesOutline" slot="start"></ion-icon>
                                      <ion-icon v-if="content.type === 'assessment'" :icon="checkboxOutline" slot="start"></ion-icon>
                                      <ion-icon v-if="content.type === 'simple-question' && !+epocStore.epoc.questions[content.question].score"
                                                :icon="bulbOutline" slot="start"></ion-icon>
                                      <ion-icon v-if="content.type === 'simple-question' && +epocStore.epoc.questions[content.question].score"
                                                :icon="checkboxOutline" slot="start"></ion-icon>
                                      <ion-icon v-if="content.type === 'choice'" :icon="gitBranchOutline" slot="start"></ion-icon>
                                  </div>
                                  <div>{{content.title}}</div>
                              </RouterLink>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.wrapper{
  max-width: 600px;
  margin:auto;
  padding: 1rem;

  .toc-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-bottom: 1em;

    img {
      height: 4rem;
      width: 4rem;
      margin-right: 1rem;
      object-fit: cover;
      box-shadow: 0 0 1px 0 rgba(0,0,0,0.33), 0 3px 4px 0 rgba(0,0,0,0.16);
      border-radius: .25rem;
    }

    .toc-header-title {
      font-size: 1.1rem;
      font-weight: bold;
    }
  }
}

.toc-chapter {
  margin-bottom: 1rem;
  padding: .5rem;
  background: var(--ion-color-content);
  box-shadow: 0 6px 10px 0 var(--ion-color-shadow);
  border-radius: .5rem;

  &-summary{
    display: flex;
  }

  &-progress{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    width: 2.5rem;
    height:2.5rem;
    margin-right: .75rem;
    border-radius: 1rem;
    color: var(--ion-color-inria-icon);
    background: var(--ion-color-contrast);

    &.done{
      color: var(--ion-color-inria-correct);
      background: var(--ion-color-correct-background);
    }
  }

  &-info{
    display: block;
    flex:1;
    &-label{
      font-weight: bold;
      line-height: 1.2;
    }
    &-title{
      line-height: 1.2;
    }
    &-details{
      color:var(--ion-color-inria);
    }
  }

  &-open{
    align-self: center;

    ion-icon{
      display: block;
    }
  }

  &-details{
    border-top: 1px solid var(--ion-color-contrast);

    &-item{
      display: flex;
      align-items: center;
      padding: .5rem;
      margin-top: .5rem;
      border-radius: 8px;
      background: var(--ion-color-contrast-2);

      &.viewed{
        background: var(--ion-color-correct-background);
        
        .toc-chapter-details-item-icon{
          background: var(--ion-color-icon-correct-background);
        }
      }

      &-icon{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        width: 2rem;
        height:2rem;
        margin-right: 1rem;
        border-radius: .8rem;
        background: var(--ion-color-contrast);
      }
    }
  }
}

</style>
