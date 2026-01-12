<script setup lang="ts">
import { Chapter } from '@/types/epoc';
import Card from '@/components/Card.vue';
import { PropType } from 'vue';
import { IonText, IonIcon } from '@ionic/vue';
import { useEpocStore } from '@/stores/epocStore';
import { checkmarkOutline, timeOutline, playCircleOutline, cubeOutline, schoolOutline} from 'ionicons/icons';
const epocStore = useEpocStore()

const prop = defineProps({
  chapter: {
    type : Object as PropType<Chapter>,
    required: true
  }
})
</script>



<template>
  <card class="chapter-info">
    <div class="title-container">
      <div class="title-icon">
        <ion-icon aria-hidden="true" :icon="schoolOutline"></ion-icon>
      </div>
      <h5 class="title">
        {{chapter.title}}
      </h5>
    </div>
    <div class="chapter-specs">
      <div class="chapter-spec">
        <div class="chapter-spec-icon"><ion-icon aria-hidden="true" :icon="timeOutline"></ion-icon></div>
        <div class="chapter-spec-value">{{chapter.time || epocStore.epoc.chapterDuration || 10}} min</div>
      </div>
      <div class="chapter-spec" v-if="chapter.mediaCount || 0 > 0">
        <div class="chapter-spec-icon"><ion-icon aria-hidden="true" :icon="playCircleOutline"></ion-icon></div>
        <div class="chapter-spec-value">{{chapter.mediaCount}} {{$t('PLAYER.VIDEOS', chapter.mediaCount || 1)}}</div>
      </div>
      <div class="chapter-spec" v-if="chapter.assessmentCount || 0 > 0">
        <div class="chapter-spec-icon"><ion-icon aria-hidden="true" :icon="cubeOutline"></ion-icon></div>
        <div class="chapter-spec-value">{{chapter.assessmentCount}} {{$t('OVERVIEW_PAGE.ACTIVITIES', chapter.assessmentCount || 1)}}</div>
      </div>
    </div>

    <template v-if="chapter.objectives && chapter.objectives.length > 0">
      <h4 class="chapter-objectives-label">{{$t('OVERVIEW_PAGE.OBJECTIVES', chapter.objectives.length)}}</h4>
      <div class="chapter-objectives">
        <div class="chapter-objective" v-for="objective of chapter.objectives">
          <div class="chapter-objective-icon"><ion-icon :icon="checkmarkOutline"></ion-icon></div>
          <ion-text>{{objective}}</ion-text>
        </div>
      </div>
    </template>
  </card>
</template>

<style lang="scss" scoped>
:host{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width:100%;
  overflow: hidden;
}

.title-container{
  margin-bottom: 1rem;
  text-align: center;

  .title-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width:5rem;
    height:5rem;
    margin: auto;
    font-size: 2.5rem;
    border-radius: 2rem;
  }

  .title{
    font-size: 1.5rem;
    font-weight: bold;
  }

  &:after{
    content:'';
    display: block;
    width: 80px;
    height:4px;
    margin: 10px auto;
    border-radius: 2px;
    background: var(--ion-color-inria);
  }
}

.chapter-specs{
  display: flex;
  padding: 1rem 0;
  font-size: 0.85rem;
  color: var(--ion-color-specs);
  text-align: center;
  align-items: center;
  justify-content: center;

  .chapter-spec{
    padding: 0 1.5rem;
    border-right: 1px solid var(--ion-color-unique-2);
  }

  .chapter-spec:last-child{
    border-right: none;
  }

  ion-icon{
    font-size: 1.5rem;
  }
}

.chapter-objectives-label{
  margin-top: 0;
  padding: .5em 0 .25em 0;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--ion-color-icon-2);
  border-bottom: 1px solid var(--ion-color-contrast);
}

.chapter-objectives{

  .chapter-objective{
    display: flex;
    margin-bottom: 10px;

    &-icon{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      width: 2rem;
      height:2rem;
      margin-right: 1rem;
      border-radius: .8rem;
      color: var(--ion-color-icon-2);
      background: var(--ion-color-contrast);
    }

    ion-text{
      display: inline-block;
      vertical-align: middle;
      width: calc(100% - 3em);
    }
  }
}
</style>
