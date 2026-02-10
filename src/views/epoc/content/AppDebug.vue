<script setup lang="ts">
import { Settings } from '@/types/settings';

const props = defineProps({
    epocId: String,
    chapterId: String,
    contentId: String,
    settings: Settings,
});
</script>

<template>
    <div class="debug" v-if="settings && settings.debug">
        Debug id : {{ epocId }}-{{ chapterId }}-{{ contentId }}
        <a href="mailto">{{ $t('DEBUG_REPORT') }}</a>
    </div>
</template>

<style scoped></style>
