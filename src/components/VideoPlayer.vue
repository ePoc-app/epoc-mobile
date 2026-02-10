<script setup lang="ts">
import { IonIcon, IonSelect, IonSelectOption, IonItem, IonLabel, toastController, createGesture } from '@ionic/vue';
import { ref, onMounted, onUnmounted, PropType } from 'vue';
import { logoClosedCaptioning, pause, play as playIcon, expand } from 'ionicons/icons';
import { useMediaPlayerStore } from '@/stores/mediaPlayerStore';
import { PlayPauseEvent } from '@/types/contents/media';
import { ScreenOrientation } from '@capacitor/screen-orientation';

const props = defineProps({
    src: String,
    poster: String,
    subtitles: {
        type: Array as PropType<{ label: string; lang: string; src: string }[]>,
        default: () => [],
    },
    title: String,
    controls: {
        type: Object as PropType<{
            show?: boolean;
            timeline?: boolean;
            subtitles?: boolean;
            playbutton?: boolean;
            fullscreen?: boolean;
            overlay?: boolean;
        }>,
        default: () => ({
            show: true,
            timeline: true,
            playbutton: true,
            fullscreen: true,
            subtitles: true,
        }),
    },
});

const emit = defineEmits<{
    (e: 'playPause', event: PlayPauseEvent): void;
}>();

// Store Pinia
const mediaPlayerStore = useMediaPlayerStore();

// Générer un ID unique pour ce lecteur
const playerId = `video-player-${Math.random().toString(36).substring(2, 9)}`;

// Références
const video = ref<HTMLVideoElement | null>(null);
const trackSelectRef = ref<typeof IonSelect | null>(null);
const timelineProgress = ref<HTMLElement | null>(null);
const timelineCursor = ref<HTMLElement | null>(null);

// État local
const hasPlayed = ref(false);
const playing = ref(false);
const trackSelected = ref('none');
const progress = ref(0);

// Méthodes
const play = () => {
    if (!video.value) return;
    if (video.value.paused) {
        video.value.play();
    } else {
        video.value.pause();
    }
};

const jump = (delta: number) => {
    if (!video.value) return;
    video.value.currentTime += delta;
    video.value.play();
};

const fullscreen = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!video.value) return;
    if (typeof video.value.requestFullscreen === 'function') {
        video.value.requestFullscreen();
    } else if (typeof (video.value as any).webkitEnterFullscreen === 'function') {
        (video.value as any).webkitEnterFullscreen();
    } else {
        presentToast('Fullscreen not supported on your phone');
    }
};

const seek = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!video.value) return;
    const timeline = (event.target as HTMLElement).closest('.video-timeline');
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const progressValue = (event.clientX - rect.left) / rect.width;
    video.value.currentTime = Math.round(progressValue * video.value.duration);
};

const captions = () => {
    if (trackSelectRef.value) {
        trackSelectRef.value?.open();
    }
};

const changeSubtitles = (event: CustomEvent) => {
    if (!video.value) return;
    const value = event.detail.value;
    for (const track of Array.from(video.value.textTracks)) {
        if (value === 'none') {
            track.mode = 'disabled';
        } else if (track.language === value) {
            track.mode = 'showing';
        } else {
            track.mode = 'disabled';
        }
    }
    trackSelected.value = value;
};

const presentToast = async (text: string) => {
    const toast = await toastController.create({
        position: 'top',
        message: text,
        duration: 2000,
    });
    toast.present();
};

const handleFullScreenChange = async () => {
    const isFullscreen = document.fullscreenElement || (document as any).webkitFullScreenElement;

    if (isFullscreen) {
        await ScreenOrientation.unlock();
    } else {
        await ScreenOrientation.lock({ orientation: 'portrait' });
    }
};

// Cycle de vie
onMounted(() => {
    if (!video.value) return;

    video.value.addEventListener('error', () => {
        if (video.value && video.value.src.endsWith('loading')) return;
        presentToast('Error loading video');
    });

    video.value.addEventListener('loadedmetadata', () => {
        mediaPlayerStore.registerPlayer(playerId, video.value?.duration || 0);
    });

    video.value.addEventListener('play', () => {
        hasPlayed.value = true;
        playing.value = true;
        mediaPlayerStore.setPlayerState(playerId, { isPlaying: true, currentTime: video.value?.currentTime || 0 });
        emit('playPause', { isPlaying: true, playerId });
    });

    video.value.addEventListener('pause', () => {
        playing.value = false;
        mediaPlayerStore.setPlayerState(playerId, { isPlaying: false, currentTime: video.value?.currentTime || 0 });
        emit('playPause', { isPlaying: false, playerId });
    });

    video.value.addEventListener('timeupdate', () => {
        if (!video.value) return;
        progress.value = (video.value.currentTime / video.value.duration) * 100;
        mediaPlayerStore.setPlayerState(playerId, {
            isPlaying: !video.value.paused,
            currentTime: video.value.currentTime,
        });
    });

    video.value.addEventListener('fullscreenchange', () => {
        if (!video.value) return;
        if (document.fullscreenElement) {
            video.value.setAttribute('controls', 'true');
        } else {
            video.value.removeAttribute('controls');
        }
    });

    video.value.addEventListener('fullscreenchange', handleFullScreenChange);
    video.value.addEventListener('webkitfullscreenchange', handleFullScreenChange);

    video.value.textTracks.addEventListener('change', () => {
        if (!video.value) return;
        trackSelected.value = 'none';
        for (const track of Array.from(video.value.textTracks)) {
            if (track.mode === 'showing') {
                trackSelected.value = track.language;
            }
        }
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
            if (!startCursorPos || !timelinePos || !video.value || !timelineProgress.value || !timelineCursor.value)
                return;
            const newX = Math.min(Math.max(startCursorPos.left - timelinePos.left + ev.deltaX, 0), timelinePos.width);
            const progressValue = newX / timelinePos.width;
            hasPlayed.value = true;
            timelineProgress.value.style.width = progressValue * 100 + '%';
            timelineCursor.value.style.left = progressValue * 100 + '%';
            video.value.currentTime = Math.round(progressValue * video.value.duration);
        },
    });
    gesture.enable(true);
});

// Nettoyage
onUnmounted(() => {
    mediaPlayerStore.unregisterPlayer(playerId);

    video.value?.removeEventListener('fullscreenchange', handleFullScreenChange);
    video.value?.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
});
</script>

<template>
    <div class="video-player">
        <div aria-hidden="true" class="video-container" :class="{ playing }" @click="play">
            <video ref="video" disablePictureInPicture playsinline preload="metadata" :src="src">
                <track
                    v-for="sub in subtitles"
                    :key="sub.lang"
                    kind="subtitles"
                    :label="sub.label"
                    :srclang="sub.lang"
                    :src="sub.src"
                />
            </video>
            <div v-if="!hasPlayed" class="poster">
                <h4 class="title">{{ title }}</h4>
                <img v-if="poster" :src="poster" />
            </div>
            <div v-if="src">
                <div class="video-play-overlay">
                    <ion-icon src="/assets/icon/play.svg"></ion-icon>
                </div>
                <div v-if="controls.timeline" class="video-timeline" @click="seek">
                    <div
                        class="video-timeline-progress"
                        :style="{ width: progress + '%' }"
                        ref="timelineProgress"
                    ></div>
                    <div class="video-timeline-cursor" :style="{ left: progress + '%' }" ref="timelineCursor"></div>
                </div>
                <div v-if="controls.overlay" class="video-overlay-controls">
                    <ion-icon :icon="expand" @click="fullscreen"></ion-icon>
                </div>
            </div>
        </div>
        <div v-if="src && controls.show" class="video-actions">
            <div class="video-actions-left">
                <button
                    v-if="controls.subtitles && subtitles && subtitles.length > 0"
                    class="video-action"
                    @click="captions"
                >
                    <ion-icon :icon="logoClosedCaptioning"></ion-icon>
                </button>
            </div>
            <div v-if="controls.playbutton" class="video-actions-center">
                <button class="video-action" aria-label="-10s" @click="jump(-10)">-10</button>
                <button class="video-action" aria-label="Lancer la lecture" @click="play">
                    <ion-icon :icon="playing ? pause : playIcon"></ion-icon>
                </button>
                <button class="video-action" aria-label="+10s" @click="jump(10)">+10</button>
            </div>
            <div v-if="controls.fullscreen" class="video-actions-right">
                <button class="video-action" aria-label="Plein écran" @click="fullscreen">
                    <ion-icon :icon="expand"></ion-icon>
                </button>
            </div>
        </div>
        <ion-item v-if="controls.subtitles && subtitles && subtitles.length > 0" class="hidden-select">
            <ion-label>Sous-titres</ion-label>
            <ion-select ref="trackSelectRef" :value="trackSelected" @ionChange="changeSubtitles">
                <ion-select-option value="none">Aucun</ion-select-option>
                <ion-select-option v-for="sub in subtitles" :key="sub.lang" :value="sub.lang">
                    {{ sub.label }}
                </ion-select-option>
            </ion-select>
        </ion-item>
    </div>
</template>

<style scoped lang="scss">
.video-player {
    .video-container {
        position: relative;
        min-height: 210px;
    }
    .video-container .poster {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: var(--ion-color-inria-blue);
    }
    .video-container .poster .title {
        padding: 20px;
        color: white;
        text-align: center;
    }
    .video-container .poster img {
        position: absolute;
        width: 100%;
        height: auto;
        object-fit: cover;
    }
    .video-container .video-play-overlay {
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
    .video-container .video-play-overlay ion-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .video-container.playing .video-play-overlay {
        opacity: 0;
    }
    .video-container .video-overlay-controls {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 5px;
        z-index: 2;
    }
    .video-container .video-overlay-controls ion-icon {
        font-size: 20px;
        line-height: 1;
        color: white;
        cursor: pointer;
        filter: drop-shadow(0 0 2px var(--ion-color-inria-blue));
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    video {
        display: block;
        width: 100%;
        height: auto;
        margin: 0;
        background: none;
    }
    .video-actions {
        display: flex;
        font-size: 25px;
        justify-content: space-between;
        padding: 16px;
    }
    .video-actions .video-action {
        position: relative;
        display: block;
        width: 30px;
        height: 30px;
        margin: 0;
        padding: 0;
        border-radius: 5px;
        background: var(--ion-color-contrast);
        color: var(--ion-color-inria);
        text-align: center;
        line-height: 35px;
    }
    .video-actions .video-action ion-icon {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
    }
    .video-actions-left {
        display: flex;
        width: 30px;
    }
    .video-actions-center {
        display: flex;
        text-align: center;
    }
    .video-actions-center .video-action {
        margin: 0 5px;
    }
    .video-actions-right {
        display: flex;
        width: 30px;
    }
    .video-timeline {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10px;
        z-index: 2;
    }
    .video-timeline:before {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(var(--ion-color-inria-light-rgb), 0.5);
    }
    .video-timeline-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--ion-color-inria);
    }
    .video-timeline-cursor {
        position: absolute;
        top: calc(50% + 3.5px);
        padding: 8px;
        z-index: 10;
        transform: translate(-50%, -50%);
        transform-origin: center center;
        opacity: 0;
    }
    .video-timeline-cursor:before {
        content: '';
        display: block;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: white;
        border: 1px solid var(--ion-color-light-shade);
    }
}
.hidden-select {
    display: none;
}
</style>
