<script setup lang="ts">
import { Video } from '@/types/contents/video';
import { ContentRuntime } from '@/types/contents/content';
import { PropType, ref } from 'vue';
import { useEpocStore } from '@/stores/epocStore';
import { useReadingStore } from '@/stores/readingStore';
import { srcConvert } from '@/utils/pipes';
import HtmlContent from './HtmlContent.vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import { Capacitor } from '@capacitor/core';

const epocStore = useEpocStore()
const readingStore = useReadingStore()

// PROPS
const props = defineProps({
  content: {
    type : Object as PropType<(Video & ContentRuntime)>,
    required: true
  },
})
const emit = defineEmits(['timelineDragging'])

// DATA
const videoData = ref()
const tracker = ref()
const startTime = ref()
const elapsed = ref()
const source = ref()

// METHODS
const setVideoData = (data) => {
    videoData.value = data;
}

const forwardEvent = (event) => {
    emit('timelineDragging',event)
}

const playPause = (playing: boolean) => {
  const epocId = epocStore.epoc.id;
  if (playing) {
    readingStore.saveStatement(epocId, 'contents', props.content.id, 'played', true);
    tracker.value.trackEvent('Video', 'played', `User played video ${epocId} ${props.content.id}`);
    startTime.value = performance.now();
  } else {
    elapsed.value += Math.round((performance.now() - startTime.value) / 1000);
    if (elapsed.value > Math.round(videoData.value.duration/2)) {
        readingStore.saveStatement(epocId, 'contents', props.content.id, 'watched', true);
    }
  }
}

</script>

<template>
  <template v-if="content">
   <video-player 
      :src="Capacitor.convertFileSrc(epocStore.rootFolder + content.source)" :poster="Capacitor.convertFileSrc(epocStore.rootFolder + content.poster)"
      :subtitles="content.subtitles" :title="content.title"
      @timelineDragging="forwardEvent($event)" @videoData="setVideoData($event)" @playPause="playPause($event)">
    </video-player>
    <template v-if="content.summary">
      <h4>{{$t('PLAYER.VIDEO.SUMMARY')}}</h4>
      <div class="video-summary">
        <html-content :html="srcConvert(content.summary, epocStore.rootFolder)" v-if="content.summary && content.summary.length > 0"></html-content>
        <p v-if="!content.summary || content.summary.length <= 0">{{$t('PLAYER.VIDEO.NO_SUMMARY')}}</p>
      </div>
    </template>
  </template>
</template>

<style>
video-player{
  position: relative;
  display: block;
  left: -1rem;
  width: calc(100% + 2rem);
}

h4{
  margin-top: 0;
  padding: .5em 0 .25em 0;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--ion-color-inria);
  border-bottom: 1px solid var(--ion-color-contrast);
}
</style>
