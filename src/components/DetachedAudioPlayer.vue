<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { play as playIcon, pause, close } from 'ionicons/icons';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useMediaPlayerStore } from '@/stores/mediaPlayerStore';

const mediaPlayerStore = useMediaPlayerStore();
const hostAudio = ref<HTMLAudioElement | null>(null);

onMounted(() => {
    if (hostAudio.value) mediaPlayerStore.registerAudioDetached(hostAudio.value);
});

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const audioEl = computed(() => {
    const el = mediaPlayerStore.activeMediaElement;
    return el instanceof HTMLAudioElement ? el : null;
});

const visible = computed(() => !!audioEl.value && mediaPlayerStore.showDetachedPlayer);

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));

const onPlay = () => {
    isPlaying.value = true;
};
const onPause = () => {
    isPlaying.value = false;
};
const onTimeUpdate = () => {
    currentTime.value = audioEl.value?.currentTime ?? 0;
};
const onDurationChange = () => {
    duration.value = audioEl.value?.duration ?? 0;
};

watch(
    audioEl,
    (newEl, oldEl) => {
        oldEl?.removeEventListener('play', onPlay);
        oldEl?.removeEventListener('pause', onPause);
        oldEl?.removeEventListener('timeupdate', onTimeUpdate);
        oldEl?.removeEventListener('durationchange', onDurationChange);

        if (newEl) {
            isPlaying.value = !newEl.paused;
            currentTime.value = newEl.currentTime;
            duration.value = newEl.duration || 0;
            newEl.addEventListener('play', onPlay);
            newEl.addEventListener('pause', onPause);
            newEl.addEventListener('timeupdate', onTimeUpdate);
            newEl.addEventListener('durationchange', onDurationChange);
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    audioEl.value?.removeEventListener('play', onPlay);
    audioEl.value?.removeEventListener('pause', onPause);
    audioEl.value?.removeEventListener('timeupdate', onTimeUpdate);
    audioEl.value?.removeEventListener('durationchange', onDurationChange);
});

const togglePlay = () => {
    if (!audioEl.value) return;
    if (audioEl.value.paused) {
        audioEl.value.play();
    } else {
        audioEl.value.pause();
    }
};

const stop = () => {
    mediaPlayerStore.stopActiveMedia();
};

const barEl = ref<HTMLElement | null>(null);

const updateOffset = () => {
    const offset = visible.value && barEl.value ? Math.ceil(barEl.value.getBoundingClientRect().bottom) : 0;
    document.documentElement.style.setProperty('--detached-audio-player-offset', `${offset}px`);
};

watch(visible, () => nextTick(updateOffset));
onMounted(() => {
    updateOffset();
    window.addEventListener('resize', updateOffset);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', updateOffset);
    document.documentElement.style.setProperty('--detached-audio-player-offset', '0px');
});
</script>

<template>
    <audio ref="hostAudio"></audio>
    <div v-if="visible" ref="barEl" class="detached-audio-player" role="region" aria-label="Lecteur audio">
        <button class="detached-audio-player-action" :aria-label="isPlaying ? 'Pause' : 'Lecture'" @click="togglePlay">
            <ion-icon :icon="isPlaying ? pause : playIcon"></ion-icon>
        </button>
        <div class="detached-audio-player-info">
            <span class="detached-audio-player-title">{{ mediaPlayerStore.activeMediaTitle }}</span>
            <span class="detached-audio-player-time">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
        </div>
        <button class="detached-audio-player-action" aria-label="Arrêter" @click="stop">
            <ion-icon :icon="close"></ion-icon>
        </button>
    </div>
</template>

<style scoped lang="scss">
.detached-audio-player {
    position: fixed;
    top: var(--ion-safe-area-top);
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: var(--ion-color-inria);
    color: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.detached-audio-player-action {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 1.1rem;
}

.detached-audio-player-info {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.detached-audio-player-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9rem;
}

.detached-audio-player-time {
    font-size: 0.75rem;
    opacity: 0.8;
}
</style>
