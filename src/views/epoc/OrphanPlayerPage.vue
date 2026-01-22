<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonSpinner } from '@ionic/vue';
import { useEpocStore } from '@/stores/epocStore';
import { useSettingsStore } from '@/stores/settingsStore';
import {storeToRefs} from 'pinia';
import {
  cubeOutline,
  documentTextOutline,
  gitBranchOutline,
  helpOutline,
  micOutline,
  playCircleOutline
} from 'ionicons/icons';
import {srcConvert} from '@/utils/pipes';
import CommonContent from '@/views/epoc/content/CommonContent.vue';
import HtmlContent from '@/views/epoc/content/HtmlContent.vue';
import AssessmentContent from '@/views/epoc/content/AssessmentContent.vue';
import AudioContent from '@/views/epoc/content/AudioContent.vue';
import VideoContent from '@/views/epoc/content/VideoContent.vue';
import SimpleQuestion from '@/views/epoc/content/SimpleQuestion.vue';

const epocStore = useEpocStore();
const settingsStore = useSettingsStore();
const route = useRoute();

const { epoc } = storeToRefs(epocStore);
const { settings } = storeToRefs(settingsStore);

const epocId = computed(() => route.params.epoc_id.toString());
const contentId = computed(() => route.params.content_id.toString());
const content = computed(() => epoc.value?.contents[contentId.value]);

const CONTENT_TYPE_ICONS = {
  html: documentTextOutline,
  assessment: cubeOutline,
  video: playCircleOutline,
  audio: micOutline,
  'simple-question': helpOutline,
  choice: gitBranchOutline,
} as const;

const readerStyles = computed(() => {
  const defaultStyles = {
    'font-family': 'Inria Sans',
    'font-size': '16px',
    'line-height': 1.4,
  };

  if (!settings.value) return defaultStyles;

  return {
    'font-family': settings.value.font,
    'font-size': `${settings.value.fontSize}px`,
    'line-height': settings.value.lineHeight,
  };
});
</script>

<template>
  <ion-content>
    <div class="reader" slot="fixed" :style="readerStyles" tabindex="-1">
      <template v-if="epoc && content">
        <common-content
            v-if="content.type !== 'simple-question'"
            :title="content.title"
            :subtitle="content.subtitle || ''"
            :icon="CONTENT_TYPE_ICONS[content.type]"
        >
          <html-content
              v-if="content.type === 'html'"
              :html="srcConvert(content.html, epocStore.rootFolder)"
          />
          <video-content v-else-if="content.type === 'video'" :content="content" />
          <audio-content v-else-if="content.type === 'audio'" :content="content" />
          <assessment-content v-else-if="content.type === 'assessment'" :content="content" />
        </common-content>

        <simple-question
            v-else
            :epocId="epocId"
            :content="content"
            :question="epoc.questions[content.question]"
        />
      </template>
    </div>
  </ion-content>
</template>

<style scoped lang="scss">
.reader-progress {
  width: 100%;
  top: var(--ion-safe-area-top);
  z-index: 1;
}

.reader {
  position: absolute;
  top: var(--ion-safe-area-top);
  height: calc(100% - var(--ion-safe-area-top));
  width: 100%;
  opacity: 1;
  transition: opacity .3s ease;
  background: var(--ion-color-contrast-2);

  ion-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .reader-slider {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  swiper-slide {
    flex-direction: column;
    background-color: var(--ion-color-contrast-2);
  }
}

.reader-actions {
  position: absolute;
  bottom: calc(.25rem + var(--ion-safe-area-bottom));
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(150px) translateX(-50%);
  transition: transform .3s;
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  z-index: 50;

  &.showing {
    transform: translateY(0) translateX(-50%);
  }

  .reader-action {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3.5rem;
    height: 3.5rem;
    margin: .2rem;
    background: var(--ion-color-contrast-3);
    box-shadow: -4px -4px 8px 0 var(--ion-color-reader-action-shadow-1), 4px 4px 8px 0 var(--ion-color-reader-action-shadow-2);
    border-radius: 4rem;
    font-size: 1.5rem;
    color: var(--ion-color-icon-2);

    &.disabled {
      color: var(--ion-color-reader-action-disabled);
    }

    &.small {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.25rem;
      color: var(--ion-color-icon);
    }

    &.hidden {
      opacity: 0;
    }
  }
}
</style>