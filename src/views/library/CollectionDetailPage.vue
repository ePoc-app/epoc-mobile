<script setup lang="ts">
import { IonContent, IonButton, IonHeader, IonPage, IonBackButton, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
import {
    informationCircleOutline,
    cloudDownloadOutline,
    arrowForwardOutline,
    cogOutline,
    syncOutline,
} from 'ionicons/icons';
import { useLibraryStore } from '@/stores/libraryStore';
import { RouterLink, useRoute } from 'vue-router';
import { EpocCollection } from '@/types/epoc';

const libraryStore = useLibraryStore();
const collectionId: string = useRoute().params.collection_id.toString();
const collection: EpocCollection = libraryStore.officialCollections[collectionId];
</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <RouterLink to="library" slot="start">
                    <ion-button role="button" class="icon-btn">
                        <ion-back-button
                            :aria-label="$t('MISSING.RETURN')"
                            text=""
                            color="inria-icon"
                        ></ion-back-button>
                    </ion-button>
                </RouterLink>
                <ion-title>{{ collection.title }}</ion-title>
                <RouterLink :to="{ name: 'WIP', params: { any: '/about' } }" slot="end">
                    <ion-button role="button" class="icon-btn">
                        <ion-icon
                            aria-label="Informations"
                            slot="icon-only"
                            :icon="informationCircleOutline"
                            color="inria-icon"
                        ></ion-icon>
                    </ion-button>
                </RouterLink>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="publisher-logo">
                <div
                    class="logo"
                    v-if="collection.publisher.logo"
                    :style="'background-image:url(' + collection.publisher.logo + ')'"
                ></div>
                <div class="publisher-name" v-else>{{ collection.publisher.name }}</div>
            </div>
            <div id="container">
                <div class="library-line-separator"></div>
                <div class="library-items" tabindex="-1">
                    <div class="library-item" v-for="epoc in Object.values(collection.ePocs)" :key="epoc.id">
                        <RouterLink
                            :to="{ name: 'EpocOverviewPage', params: { libraryId: collection.id, id: epoc.id } }"
                        >
                            <div
                                :aria-label="epoc.title"
                                class="library-item-image"
                                :style="'background-image:url(' + epoc.image + ')'"
                            ></div>
                        </RouterLink>
                        <h3 aria-hidden="true" class="library-item-title">{{ epoc.title }}</h3>
                        <div class="library-item-toolbar" v-if="epoc.downloaded">
                            <RouterLink :to="{ name: 'TocPage', params: { id: epoc.id } }">
                                <ion-button class="expanded" color="inria">
                                    <span v-if="epoc.opened">{{ $t('LIBRARY_PAGE.CONTINUE') }}</span>
                                    <ion-icon
                                        aria-hidden="true"
                                        v-if="epoc.opened"
                                        :icon="arrowForwardOutline"
                                        slot="end"
                                    ></ion-icon>
                                    <span v-if="!epoc.opened">{{ $t('LIBRARY_PAGE.DISCOVER') }}</span>
                                </ion-button>
                            </RouterLink>
                            <ion-button
                                class="round"
                                :class="{ 'update-available': epoc.updateAvailable }"
                                color="inria-base-button"
                                v-on:click="libraryStore.epocLibraryMenu(epoc, collection.id)"
                            >
                                <span aria-label="Option du chapitre" class="ellipsis base-btn">...</span>
                            </ion-button>
                        </div>
                        <div
                            class="library-item-toolbar"
                            v-if="!epoc.downloading && !epoc.downloaded && !epoc.unzipping"
                        >
                            <ion-button
                                class="expanded"
                                color="inria-base-button"
                                v-on:click="libraryStore.downloadEpoc(epoc, collection.id)"
                            >
                                <ion-icon aria-hidden="true" :icon="cloudDownloadOutline" slot="start"></ion-icon>
                                <span class="base-btn">{{ $t('LIBRARY_PAGE.DOWNLOAD') }}</span>
                            </ion-button>
                        </div>
                        <div class="library-item-toolbar" v-if="epoc.downloading">
                            <ion-button class="expanded" :disabled="true" color="inria-base-button">
                                <ion-icon aria-hidden="true" :icon="syncOutline" class="spin" slot="start"></ion-icon>
                                <span class="base-btn">
                                    {{ $t('LIBRARY_PAGE.DOWNLOADING') }}
                                    <!--<template v-if="epocProgresses[epoc.id]">({{epocProgresses[epoc.id]}}%)</template>-->
                                </span>
                            </ion-button>
                        </div>
                        <div class="library-item-toolbar" v-if="epoc.unzipping">
                            <ion-button class="expanded" :disabled="true" color="inria-base-button">
                                <ion-icon aria-hidden="true" :icon="cogOutline" class="spin" slot="start"></ion-icon>
                                <span class="base-btn">
                                    {{ $t('LIBRARY_PAGE.OPEN_ZIP') }}
                                    <!--<template v-if="epocProgresses[epoc.id]">({{epocProgresses[epoc.id]}}%)</template>-->
                                </span>
                            </ion-button>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped lang="scss">
@use '@/theme/library.scss';

ion-toolbar {
    .title-default {
        text-transform: none;
        text-align: center;
    }
}

.publisher-logo {
    position: relative;
    width: 100%;
    height: 180px;

    .logo {
        position: absolute;
        top: 1rem;
        left: 1rem;
        width: calc(100% - 2rem);
        height: calc(100% - 2rem);
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
}
</style>
