import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMediaPlayerStore = defineStore('mediaPlayer', () => {
    // État global
    const players = ref<Map<string, { duration: number; isPlaying: boolean; currentTime: number }>>(new Map());
    const activePlayerId = ref<string | null>(null);
    const isTimelineDragging = ref<boolean>(false);
    const activeMediaElement = ref<HTMLMediaElement | null>(null);
    const activeMediaTitle = ref<string | null>(null);
    const showDetachedPlayer = ref(false);
    const pipDetachedElement = ref<HTMLVideoElement | null>(null);
    const audioDetachedElement = ref<HTMLAudioElement | null>(null);
    const originalMediaElement = ref<HTMLMediaElement | null>(null);

    // Actions
    const registerPlayer = (id: string, duration: number) => {
        players.value.set(id, { duration, isPlaying: false, currentTime: 0 });
    };

    const unregisterPlayer = (id: string) => {
        players.value.delete(id);
        if (activePlayerId.value === id) {
            activePlayerId.value = null;
        }
    };

    const setPlayerState = (id: string, state: { isPlaying: boolean; currentTime: number }) => {
        const player = players.value.get(id);
        if (player) {
            player.isPlaying = state.isPlaying;
            player.currentTime = state.currentTime;
        }
    };

    const setActivePlayer = (id: string) => {
        activePlayerId.value = id;
    };

    const exitPipIfActive = async (mediaEl: HTMLMediaElement) => {
        if (!(mediaEl instanceof HTMLVideoElement)) return;

        const el = mediaEl as HTMLVideoElement & {
            webkitPresentationMode?: string;
            webkitSetPresentationMode?: (mode: string) => void;
        };

        if (document.pictureInPictureElement === mediaEl) {
            try {
                await document.exitPictureInPicture();
            } catch {
                // nothing to exit
            }
        } else if (el.webkitPresentationMode === 'picture-in-picture' && el.webkitSetPresentationMode) {
            el.webkitSetPresentationMode('inline');
        }
    };

    const setActiveMedia = async (mediaEl: HTMLMediaElement, title: string | null = null) => {
        const previous = activeMediaElement.value;

        // Commit the new session immediately, before awaiting any cleanup of the
        // previous one: exiting PiP is async and fires 'leavepictureinpicture' on its
        // own delay, so its handler must be able to see that this media is no longer
        // the active one (see DetachedVideoPlayer.vue) instead of racing past us and
        // tearing down the media we just started.
        if (mediaEl !== audioDetachedElement.value && mediaEl !== pipDetachedElement.value) {
            originalMediaElement.value = null;
        }
        activeMediaElement.value = mediaEl;
        activeMediaTitle.value = title;
        showDetachedPlayer.value = false;

        if (previous && previous !== mediaEl) {
            previous.pause();
            await exitPipIfActive(previous);
        }
    };

    const clearActiveMedia = (mediaEl: HTMLMediaElement) => {
        if (activeMediaElement.value === mediaEl) {
            activeMediaElement.value = null;
            activeMediaTitle.value = null;
            showDetachedPlayer.value = false;
        }
    };

    const stopActiveMedia = async () => {
        const mediaEl = activeMediaElement.value;
        if (!mediaEl) return;

        mediaEl.pause();
        await exitPipIfActive(mediaEl);

        if (originalMediaElement.value && originalMediaElement.value !== mediaEl) {
            originalMediaElement.value.currentTime = mediaEl.currentTime;
        }
        originalMediaElement.value = null;

        activeMediaElement.value = null;
        activeMediaTitle.value = null;
        showDetachedPlayer.value = false;
    };

    const registerPipDetached = (el: HTMLVideoElement) => {
        pipDetachedElement.value = el;
    };

    const enterPip = async (sourceVideo: HTMLVideoElement): Promise<boolean> => {
        const detachedMedia = pipDetachedElement.value;
        if (!detachedMedia) return false;

        detachedMedia.innerHTML = '';
        Array.from(sourceVideo.querySelectorAll('track')).forEach((track) => {
            detachedMedia.appendChild(track.cloneNode(true));
        });

        const srcToLoad = sourceVideo.currentSrc || sourceVideo.src;
        const seekTo = sourceVideo.currentTime;

        if (detachedMedia.src !== srcToLoad) {
            detachedMedia.src = srcToLoad;
            await new Promise<void>((resolve) => {
                if (detachedMedia.readyState >= 1) return resolve();
                detachedMedia.addEventListener('loadedmetadata', () => resolve(), { once: true });
            });
        }
        detachedMedia.currentTime = seekTo;

        const detachedVideo = detachedMedia as HTMLVideoElement & {
            webkitSupportsPresentationMode?: (mode: string) => boolean;
            webkitSetPresentationMode?: (mode: string) => void;
        };

        try {
            await detachedMedia.play();

            if (detachedVideo.webkitSupportsPresentationMode?.('picture-in-picture')) {
                detachedVideo.webkitSetPresentationMode?.('picture-in-picture');
            } else if (document.pictureInPictureEnabled && typeof detachedMedia.requestPictureInPicture === 'function') {
                await detachedMedia.requestPictureInPicture();
            } else {
                return false;
            }
        } catch {
            return false;
        }

        sourceVideo.pause();
        originalMediaElement.value = sourceVideo;
        await setActiveMedia(detachedMedia, activeMediaTitle.value);
        return true;
    };

    const registerAudioDetached = (el: HTMLAudioElement) => {
        audioDetachedElement.value = el;
    };

    const moveAudioToDetached = async (sourceAudio: HTMLAudioElement): Promise<void> => {
        const detachedMedia = audioDetachedElement.value;
        if (!detachedMedia || detachedMedia === sourceAudio) return;

        const srcToLoad = sourceAudio.currentSrc || sourceAudio.src;
        const seekTo = sourceAudio.currentTime;

        if (detachedMedia.src !== srcToLoad) {
            detachedMedia.src = srcToLoad;
            await new Promise<void>((resolve) => {
                if (detachedMedia.readyState >= 1) return resolve();
                detachedMedia.addEventListener('loadedmetadata', () => resolve(), { once: true });
            });
        }
        detachedMedia.currentTime = seekTo;

        try {
            await detachedMedia.play();
        } catch {
            return;
        }

        sourceAudio.pause();
        originalMediaElement.value = sourceAudio;
        await setActiveMedia(detachedMedia, activeMediaTitle.value);
        showDetachedPlayer.value = true;
    };

    const handleMediaOnNavigate = () => {
        const el = activeMediaElement.value;
        if (!el || el.paused) return;

        if (el instanceof HTMLVideoElement) {
            if (document.pictureInPictureElement === el) return; // explicit PiP: keep playing
            el.pause();
            return;
        }

        if (el === audioDetachedElement.value) return; // explicit mini player: keep playing
        el.pause();
    };

    // Getters
    const getPlayerState = computed(() => (id: string) => {
        return players.value.get(id);
    });

    const getActivePlayerState = computed(() => {
        if (!activePlayerId.value) return null;
        return players.value.get(activePlayerId.value);
    });

    return {
        players,
        activePlayerId,
        isTimelineDragging,
        activeMediaElement,
        activeMediaTitle,
        showDetachedPlayer,
        pipDetachedElement,
        registerPipDetached,
        enterPip,
        audioDetachedElement,
        registerAudioDetached,
        moveAudioToDetached,
        originalMediaElement,
        registerPlayer,
        unregisterPlayer,
        setPlayerState,
        setActivePlayer,
        setActiveMedia,
        clearActiveMedia,
        stopActiveMedia,
        handleMediaOnNavigate,
        getPlayerState,
        getActivePlayerState,
    };
});
