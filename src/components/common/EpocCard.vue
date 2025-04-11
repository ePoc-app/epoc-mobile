<template>
  <div class="epoc-card" :class="{ 'update-available': epoc.updateAvailable }">
    <router-link 
      :to="detailsLink" 
      class="epoc-card-image" 
      :style="{ backgroundImage: `url(${epoc.image})` }"
      :aria-label="epoc.title"
      role="link"
    ></router-link>
    
    <h3 class="epoc-card-title" aria-hidden="true">{{ epoc.title }}</h3>
    
    <div class="epoc-card-toolbar" v-if="epoc.downloaded">
      <ion-button class="expanded" color="inria" :router-link="tocLink">
        <span v-if="!epoc.opened">{{ $t('LIBRARY_PAGE.DISCOVER') }}</span>
        <span v-if="epoc.opened">{{ $t('LIBRARY_PAGE.CONTINUE') }}</span>
        <ion-icon v-if="epoc.opened" name="arrow-forward-outline" slot="end" aria-hidden="true"></ion-icon>
      </ion-button>
      <ion-button 
        class="round" 
        :class="{'update-available': epoc.updateAvailable}" 
        color="inria-base-button" 
        @click="$emit('menu', epoc)"
      >
        <span aria-label="Options" class="ellipsis base-btn">...</span>
      </ion-button>
    </div>
    
    <div class="epoc-card-toolbar" v-if="!epoc.downloading && !epoc.downloaded && !epoc.unzipping">
      <ion-button class="expanded" color="inria-base-button" @click="$emit('download', epoc)">
        <ion-icon name="cloud-download-outline" slot="start" aria-hidden="true"></ion-icon>
        <span class="base-btn">{{ $t('LIBRARY_PAGE.DOWNLOAD') }}</span>
      </ion-button>
    </div>
    
    <div class="epoc-card-toolbar" v-if="epoc.downloading">
      <ion-button class="expanded" disabled="true" color="inria-base-button">
        <ion-icon name="sync-outline" class="spin" slot="start" aria-hidden="true"></ion-icon>
        <span class="base-btn">
          {{ $t('LIBRARY_PAGE.DOWNLOADING') }} 
          <template v-if="progress">({{ progress }}%)</template>
        </span>
      </ion-button>
    </div>
    
    <div class="epoc-card-toolbar" v-if="epoc.unzipping">
      <ion-button class="expanded" disabled="true" color="inria-base-button">
        <ion-icon name="cog-outline" class="spin" slot="start" aria-hidden="true"></ion-icon>
        <span class="base-btn">
          {{ $t('LIBRARY_PAGE.OPEN_ZIP') }}
          <template v-if="progress">({{ progress }}%)</template>
        </span>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { IonButton, IonIcon } from '@ionic/vue';

// i18n
const { t } = useI18n();

// Props
interface EpocItem {
  id: string;
  title: string;
  image: string;
  downloading: boolean;
  downloaded: boolean;
  unzipping: boolean;
  opened: boolean;
  updateAvailable: boolean;
  [key: string]: any;
}

interface Props {
  epoc: EpocItem;
  progress?: number;
  libraryId?: string;
}

const props = defineProps<Props>();

// Computed
const detailsLink = computed(() => {
  if (props.libraryId) {
    return `/library/${props.libraryId}/${props.epoc.id}`;
  }
  return `/library/${props.epoc.id}`;
});

const tocLink = computed(() => {
  return `/epoc/toc/${props.epoc.id}`;
});

// Emits
defineEmits(['download', 'menu']);
</script>

<style scoped>
.epoc-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--ion-background-color);
  position: relative;
}

.epoc-card.update-available::after {
  content: '';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background-color: var(--ion-color-danger);
  border-radius: 50%;
  z-index: 1;
}

.epoc-card-image {
  height: 120px;
  background-size: cover;
  background-position: center;
  background-color: #f5f5f5;
  display: block;
}

.epoc-card-title {
  padding: 8px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.epoc-card-toolbar {
  display: flex;
  padding: 8px;
  
  .expanded {
    flex: 1;
    margin: 0;
    --border-radius: 4px;
    font-size: 12px;
    height: 36px;
  }
  
  .round {
    width: 36px;
    height: 36px;
    --padding-start: 0;
    --padding-end: 0;
    --border-radius: 4px;
    margin: 0 0 0 8px;
    
    &.update-available::after {
      content: '';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 8px;
      height: 8px;
      background-color: var(--ion-color-danger);
      border-radius: 50%;
    }
  }
}
</style>
