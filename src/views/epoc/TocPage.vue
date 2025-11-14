<script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonButtons, IonIcon, IonBackButton, IonButton } from '@ionic/vue';
  import { RouterLink, useRoute } from 'vue-router';
  import { informationCircleOutline } from 'ionicons/icons';
  import { useEpocStore } from '@/stores/epocStore';
  import {Epoc} from '@/types/epoc';
  import { ref } from 'vue';
  import { denormalize } from '@/utils/transform';
  import { onBeforeMount } from 'vue'; 

  const route = useRoute();
  const epocStore = useEpocStore();
  const epoc = epocStore.epoc;

  onBeforeMount(async () => {
    const id = route.params.id.toString()
    await epocStore.getEpocById(id)
  });

  const displayMenu = () => {
    epocStore.epocMainMenu;
  };
  
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
                    <ion-icon slot="icon-only" name="menu-outline" color="inria-icon"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <div class="wrapper">
            <div class="toc-header">
                <img aria-hidden="true" alt="ePoc Image" :src="epoc.rootFolder +  epoc.image">
                <div class="toc-header-title">{{epoc.title}}</div>
            </div>
            <div class="toc-content" tabindex="-1">
                <div class="toc-chapter" v-for="chapter of denormalize(epoc.chapters)">
                    <div class="toc-chapter-summary">
                        <div class="toc-chapter-progress" :class="{'done':chapter.done}">
                            <ion-icon aria-hidden="true" name="checkmark-outline" v-if="chapter.done"></ion-icon>
                            <ion-icon aria-hidden="true" name="arrow-forward-outline" v-if="!chapter.done && chapter.chapterOpened"></ion-icon>
                            <ion-icon aria-hidden="true" name="time-outline" v-if="!chapter.done && !chapter.chapterOpened"></ion-icon>
                        </div>
                        <div class="toc-chapter-info">
                            <div class="toc-chapter-info-title" [routerLink]="chapter.resumeLink">
                                <div class="toc-chapter-info-label">
                                    {{chapter.title}}
                                </div>
                                {{chapter.subtitle}}
                            </div>
                            <div class="toc-chapter-info-details" (click)="toggleDetails(chapter)">
                                <ng-container v-if="chapter.opened">{{$t('TOC_PAGE.VIEW_LESS')}}</ng-container>
                                <ng-container v-if="!chapter.opened">{{$t('TOC_PAGE.VIEW_MORE')}}</ng-container>
                            </div>
                        </div>
                        <div role="link" :aria-label="$t('TOC_PAGE.NEXT_CHAPTER')" class="toc-chapter-open" [routerLink]="chapter.resumeLink">
                            <ion-icon aria-hidden="true" name="chevron-forward-outline" color="inria"></ion-icon>
                        </div>
                    </div>
                    <div class="toc-chapter-details" v-if="chapter.opened">
                        <ng-container v-for="content of denormalize(chapter.contents, epoc.contents)">
                            <ng-container v-if="!content.hidden">
                                <div class="toc-chapter-details-item" :class="{'viewed':content.viewed}" [routerLink]="'/epoc/play/'+epoc.id+'/'+chapter.id+'/content/'+content.id">
                                    <div aria-hidden="true" class="toc-chapter-details-item-icon">
                                        <ion-icon v-if="content.type === 'html'" name="document-text-outline" slot="start"></ion-icon>
                                        <ion-icon v-if="content.type === 'video'" name="play-outline" slot="start"></ion-icon>
                                        <ion-icon v-if="content.type === 'audio'" name="musical-notes-outline" slot="start"></ion-icon>
                                        <ion-icon v-if="content.type === 'assessment'" name="checkbox-outline" slot="start"></ion-icon>
                                        <ion-icon v-if="content.type === 'simple-question' && !+epoc.questions[content.question].score"
                                                  name="bulb-outline" slot="start"></ion-icon>
                                        <ion-icon v-if="content.type === 'simple-question' && +epoc.questions[content.question].score"
                                                  name="checkbox-outline" slot="start"></ion-icon>
                                        <ion-icon v-if="content.type === 'choice'" name="git-branch-outline" slot="start"></ion-icon>
                                    </div>
                                    <div>{{content.title}}</div>
                                </div>
                            </ng-container>
                        </ng-container>
                    </div>
                </div>
            </div>
        </div>
    </ion-content>

    <ion-content>
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
      margin-right: 1rem;
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
