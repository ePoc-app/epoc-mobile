<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { ref, computed, onMounted, onUnmounted, PropType } from 'vue';
import { createGesture } from '@ionic/vue';
import { useMediaPlayerStore } from '@/stores/mediaPlayerStore';
import { PlayPauseEvent } from '@/types/contents/media';
import { pause, play as playIcon, copyOutline } from 'ionicons/icons';
import playSvg from '@/assets/icon/play.svg?url';

// Props
const props = defineProps({
  src: String,
  title: String,
  controls: {
    type: Object as PropType<{
      show?: boolean;
      timeline?: boolean;
      playbutton?: boolean;
    }>,
    default: () => ({
      show: true,
      timeline: true,
      playbutton: true,
    }),
  },
});

const emit = defineEmits<{
  (e: 'playPause', event: PlayPauseEvent): void
}>();

// Store Pinia
const mediaPlayerStore = useMediaPlayerStore();

// Générer un ID unique pour ce lecteur
const playerId = `audio-player-${Math.random().toString(36).substring(2, 9)}`;

// Références
const audio = ref<HTMLAudioElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const timelineProgress = ref<HTMLElement | null>(null);
const timelineCursor = ref<HTMLElement | null>(null);

// État local
const hasPlayed = ref(false);
const playing = ref(false);
const progress = ref(0);
const audioCtx = ref<AudioContext | null>(null);
const analyser = ref<AnalyserNode | null>(null);
const canvasCtx = ref<CanvasRenderingContext2D | null>(null);

const isDetached = computed(() => {
  return (
    !!audio.value &&
    mediaPlayerStore.activeMediaElement === mediaPlayerStore.audioDetachedElement &&
    mediaPlayerStore.originalMediaElement === audio.value
  );
});

// Méthodes
const play = () => {
  if (!audio.value || isDetached.value) return;
  if (audio.value.paused) {
    audio.value.play();
    if (audioCtx.value?.state === 'suspended') {
      audioCtx.value.resume();
    }
  } else {
    audio.value.pause();
  }
};

const jump = (delta: number) => {
  if (!audio.value || isDetached.value) return;
  audio.value.currentTime += delta;
  audio.value.play();
};

const seek = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  if (!audio.value) return;
  const timeline = (event.target as HTMLElement).closest('.audio-timeline');
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const progressValue = (event.clientX - rect.left) / rect.width;
  audio.value.currentTime = Math.round(progressValue * audio.value.duration);
};

const toggleDetachedPlayer = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!audio.value) return;

  if (isDetached.value) {
    await mediaPlayerStore.stopActiveMedia();
    return;
  }

  await mediaPlayerStore.moveAudioToDetached(audio.value);
};

const presentToast = async (text: string) => {
  const toast = document.createElement('ion-toast');
  toast.message = text;
  toast.duration = 2000;
  toast.position = 'top';
  document.body.appendChild(toast);
  return toast.present();
};

// Animation du visualiseur audio
const setupAudioVisualizer = () => {
  if (!audio.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  canvasCtx.value = canvas.getContext('2d');
  audioCtx.value = new (window.AudioContext || (window as any).webkitAudioContext)();
  analyser.value = audioCtx.value.createAnalyser();

  const source = audioCtx.value.createMediaElementSource(audio.value);
  source.connect(analyser.value);
  analyser.value.connect(audioCtx.value.destination);

  analyser.value.fftSize = 32;
  const bufferLength = analyser.value.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const barWidth = canvas.width / bufferLength;
  let x = 0;
  let barHeight = 0;

  const animate = () => {
    x = 0;
    if (!canvasCtx.value) return;
    canvasCtx.value.clearRect(0, 0, canvas.width, canvas.height);
    analyser.value?.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = (canvas.height * dataArray[i]) / 255;
      canvasCtx.value.fillStyle = 'rgba(55,63,91,1)';
      canvasCtx.value.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 5;
    }
    requestAnimationFrame(animate);
  };
  animate();
};

// Cycle de vie
onMounted(() => {
  if (!audio.value || !canvasRef.value) return;
  setupAudioVisualizer();

  audio.value.addEventListener('error', () => {
    if (audio.value && audio.value.src.endsWith('loading')) return;
    presentToast('Error loading video');
  });

  audio.value.addEventListener('loadedmetadata', () => {
    mediaPlayerStore.registerPlayer(playerId, audio.value?.duration || 0);
  });

  audio.value.addEventListener('play', () => {
    hasPlayed.value = true;
    playing.value = true;
    mediaPlayerStore.setActiveMedia(audio.value!, props.title || null);
    mediaPlayerStore.setPlayerState(playerId, { isPlaying: true, currentTime: audio.value?.currentTime || 0 });
    emit('playPause', { playerId, isPlaying: true });
  });

  audio.value.addEventListener('pause', () => {
    playing.value = false;
    mediaPlayerStore.setPlayerState(playerId, { isPlaying: false, currentTime: audio.value?.currentTime || 0 });
    emit('playPause', { playerId, isPlaying: false });
  });

  audio.value.addEventListener('timeupdate', () => {
    if (!audio.value) return;
    progress.value = (audio.value.currentTime / audio.value.duration) * 100;
    mediaPlayerStore.setPlayerState(playerId, { isPlaying: !audio.value.paused, currentTime: audio.value.currentTime });
  });

  // Gestion du geste sur la timeline
  if (!timelineCursor.value) return;
  let startCursorPos: DOMRect | null = null;
  let timelinePos: DOMRect | null = null;

  const gesture = createGesture({
    el: timelineCursor.value,
    threshold: 0,
    gestureName: 'my-gesture',
    onStart: () => {
      if (!timelineCursor.value) return;
      startCursorPos = timelineCursor.value.getBoundingClientRect();
      timelinePos = timelineCursor.value.parentElement?.getBoundingClientRect() || null;
      mediaPlayerStore.isTimelineDragging = true;
    },
    onEnd: () => {
      mediaPlayerStore.isTimelineDragging = false;
    },
    onMove: (ev) => {
      if (!startCursorPos || !timelinePos || !audio.value || !timelineProgress.value || !timelineCursor.value) return;
      const newX = Math.min(
          Math.max(startCursorPos.left - timelinePos.left + ev.deltaX, 0),
          timelinePos.width
      );
      const progressValue = newX / timelinePos.width;
      hasPlayed.value = true;
      timelineProgress.value.style.width = progressValue * 100 + '%';
      timelineCursor.value.style.left = progressValue * 100 + '%';
      audio.value.currentTime = Math.round(progressValue * audio.value.duration);
    },
  });
  gesture.enable(true);
});

// Nettoyage
onUnmounted(() => {
  mediaPlayerStore.unregisterPlayer(playerId);
  if (audio.value) mediaPlayerStore.clearActiveMedia(audio.value);
  if (audioCtx.value?.state !== 'closed') {
    audioCtx.value?.close();
  }
});
</script>

<template>
  <div class="audio-player">
    <div
        aria-hidden="true"
        class="audio-container"
        :class="{ playing, detached: isDetached }"
        @click="play"
    >
      <audio ref="audio" :src="src" />
      <div v-if="isDetached" class="detached-overlay">
        <ion-icon :icon="copyOutline"></ion-icon>
        <p>{{ $t('PLAYER.VIDEO.DETACHED') }}</p>
      </div>
      <div v-else class="visualizer">
        <div v-if="!playing" class="play-overlay">
          <ion-icon :src="playSvg" />
        </div>
        <canvas ref="canvasRef" />
        <div v-if="src">
          <div
              v-if="controls.timeline"
              class="audio-timeline"
              @click="seek"
          >
            <div
                class="audio-timeline-progress"
                :style="{ width: progress + '%' }"
                ref="timelineProgress"
            />
            <div
                class="audio-timeline-cursor"
                :style="{ left: progress + '%' }"
                ref="timelineCursor"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="src && controls.show" class="audio-actions">
      <div class="audio-actions-left"></div>
      <div v-if="controls.playbutton && !isDetached" class="audio-actions-center">
        <button class="audio-action" aria-label="-10s" @click="jump(-10)">
          <span>-10</span>
        </button>
        <button class="audio-action" aria-label="Lancer la lecture" @click="play">
          <ion-icon :icon="playing ? pause : playIcon"></ion-icon>
        </button>
        <button class="audio-action" aria-label="+10s" @click="jump(10)">
          <span>+10</span>
        </button>
      </div>
      <div class="audio-actions-right">
        <button
            class="audio-action"
            :class="{ active: isDetached }"
            aria-label="Lecteur détaché"
            @click="toggleDetachedPlayer"
        >
          <ion-icon :icon="copyOutline"></ion-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visualizer {
  position: relative;
  width: 100%;
  padding-bottom: 50%;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: rgba(var(--ion-color-inria-blue-rgb), 0.2);
  z-index: 1;
  font-size: 4rem;
}

.play-overlay ion-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.audio-container.detached {
  cursor: default;
}

.detached-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  aspect-ratio: 2 / 1;
  padding: 1rem;
  text-align: center;
  color: white;
  background: var(--ion-color-inria-blue);
}

.audio-actions {
  display: flex;
  align-items: center;
  font-size: 25px;
  padding: 10px 0;
}

.audio-actions-left,
.audio-actions-right {
  display: flex;
  flex: 0 0 auto;
  /* reserve the same width on both sides so the center group stays centered */
  min-width: 40px;
}

.audio-actions-right {
  justify-content: flex-end;
}

.audio-actions-center {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  text-align: center;
}

.audio-action {
  position: relative;
  display: block;
  width: 30px;
  height: 30px;
  margin: 0 5px;
  padding: 0;
  border-radius: 5px;
  background: var(--ion-color-contrast);
  color: var(--ion-color-inria);
  text-align: center;
  line-height: 35px;
  font-size: 0.8rem;
}

.audio-action.active {
  background: var(--ion-color-inria);
  color: white;
}

.audio-action ion-icon {
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  transform: translate(-50%, -50%);
}

.audio-timeline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  z-index: 2;
}

.audio-timeline:before {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(var(--ion-color-inria-light-rgb), 0.5);
}

.audio-timeline-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--ion-color-inria);
}

.audio-timeline-cursor {
  position: absolute;
  top: calc(50% + 3.5px);
  padding: 8px;
  z-index: 10;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  opacity: 0;
}

.audio-timeline-cursor:before {
  content: '';
  display: block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: white;
  border: 1px solid var(--ion-color-light-shade);
}
</style>
