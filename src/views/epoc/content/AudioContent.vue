<script setup lang="ts">
import { Audio } from '@/types/contents/audio';
import { ContentRuntime } from '@/types/contents/content';
import { PropType, ref } from 'vue';
import { useEpocStore } from '@/stores/epocStore';
import { useReadingStore } from '@/stores/readingStore';
import { srcConvert } from '@/utils/pipes';
import HtmlContent from './HtmlContent.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import { PlayPauseEvent } from '@/types/contents/media';
import { useMediaPlayerStore } from '@/stores/mediaPlayerStore';
import { trackEvent } from '@/utils/matomo';

const epocStore = useEpocStore()
const readingStore = useReadingStore()
const mediaPlayerStore = useMediaPlayerStore()

// PROPS
const props = defineProps({
  content: {
    type : Object as PropType<(Audio & ContentRuntime)>,
    required: true
  },
})

// DATA
const startTime = ref(0)
const elapsed = ref(0)

// METHODS
const playPause = (event: PlayPauseEvent) => {
  if (!epocStore.epoc) return;
  const epocId = epocStore.epoc.id;
  const player = mediaPlayerStore.getPlayerState(event.playerId);

  if (event.isPlaying) {
    readingStore.saveStatement(epocId, 'contents', props.content.id, 'played', true);
    trackEvent('Audio', 'played', `User played video ${epocId} ${props.content.id}`);
    startTime.value = performance.now();
  } else {
    elapsed.value += Math.round((performance.now() - startTime.value) / 1000);

    if (!player) return;

    if (elapsed.value > Math.round(player.duration/2)) {
      readingStore.saveStatement(epocId, 'contents', props.content.id, 'watched', true);
    }
  }
}

</script>

<template>
  <template v-if="content">
   <audio-player 
      :src="epocStore.rootFolder + content.source" :poster="epocStore.rootFolder + content.poster"
      :subtitles="content.subtitles" :title="content.title" @playPause="playPause($event)">
    </audio-player>
    <template v-if="content.summary">
      <h4>{{$t('PLAYER.AUDIO.SUMMARY')}}</h4>
      <div class="audio-summary">
        <html-content :html="srcConvert(content.summary, epocStore.rootFolder)" v-if="content.summary && content.summary.length > 0"></html-content>
        <p v-if="!content.summary || content.summary.length <= 0">{{$t('PLAYER.AUDIO.NO_SUMMARY')}}</p>
      </div>
    </template>
  </template>
</template>

<style>
audio-player{
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
