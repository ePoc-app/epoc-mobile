<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useMediaPlayerStore } from '@/stores/mediaPlayerStore';

const mediaPlayerStore = useMediaPlayerStore();
const video = ref<HTMLVideoElement | null>(null);
const handleLeavePip = () => {
    if (mediaPlayerStore.activeMediaElement === video.value) {
        mediaPlayerStore.stopActiveMedia();
    }
};

const handleWebkitPresentationModeChanged = () => {
    const el = video.value as (HTMLVideoElement & { webkitPresentationMode?: string }) | null;
    if (el && el.webkitPresentationMode !== 'picture-in-picture' && mediaPlayerStore.activeMediaElement === el) {
        mediaPlayerStore.stopActiveMedia();
    }
};

onMounted(() => {
    if (!video.value) return;

    mediaPlayerStore.registerPipDetached(video.value);
    video.value.addEventListener('leavepictureinpicture', handleLeavePip);
    video.value.addEventListener('webkitpresentationmodechanged', handleWebkitPresentationModeChanged);
});

onUnmounted(() => {
    video.value?.removeEventListener('leavepictureinpicture', handleLeavePip);
    video.value?.removeEventListener('webkitpresentationmodechanged', handleWebkitPresentationModeChanged);
});
</script>

<template>
    <video ref="video" playsinline class="pip-video-host"></video>
</template>

<style scoped>
.pip-video-host {
    position: fixed;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    opacity: 0;
    pointer-events: none;
}
</style>
