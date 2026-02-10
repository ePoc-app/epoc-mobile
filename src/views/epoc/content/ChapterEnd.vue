<script setup lang="ts">
import { PropType } from 'vue';
import { Chapter, Epoc } from '@/types/epoc';
import { IonButton, IonIcon } from '@ionic/vue';
import { home } from 'ionicons/icons';

defineProps({
    epoc: {
        type: Object as PropType<Epoc>,
        required: true,
    },
    chapter: {
        type: Object as PropType<Chapter>,
        required: true,
    },
    nextChapter: {
        type: Object as PropType<Chapter>,
        required: true,
    },
});
</script>

<template>
    <template v-if="nextChapter">
        <p>
            <b class="ion-text-capitalize"> {{ $t('PLAYER.CHAPTER_END.FOLLOWING_NEXT') }}</b> {{ nextChapter.title }}
        </p>
        <ion-button
            expand="block"
            size="large"
            color="outline-button"
            fill="outline"
            :router-link="'/epoc/toc/' + epoc.id"
        >
            <span>{{ $t('FLOATING_MENU.TOC') }}</span>
        </ion-button>
        <ion-button
            expand="block"
            size="large"
            color="inria"
            :router-link="'/epoc/play/' + epoc.id + '/' + nextChapter.id"
        >
            <span> {{ $t('PLAYER.CHAPTER_END.NEXT') }}</span>
        </ion-button>
    </template>
    <template v-if="!nextChapter">
        <p v-html="$t('PLAYER.CHAPTER_END.MSG')"></p>
        <ion-button
            expand="block"
            size="large"
            color="outline-button"
            fill="outline"
            :router-link="'/epoc/toc/' + epoc.id"
        >
            <span>{{ $t('FLOATING_MENU.TOC') }}</span>
        </ion-button>
        <ion-button expand="block" size="large" color="inria" :router-link="'/epoc/score/' + epoc.id">
            <span>{{ $t('PLAYER.CHAPTER_END.SCORE') }}</span>
        </ion-button>
        <ion-button expand="block" size="large" color="inria-grey" routerLink="/">
            <ion-icon slot="start" :icon="home"></ion-icon>
            <span>{{ $t('FLOATING_MENU.HOME') }}</span>
        </ion-button>
    </template>
</template>

<style scoped lang="scss">
:host {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>
