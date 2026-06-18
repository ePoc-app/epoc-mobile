<script setup lang="ts">
import {
  IonContent,
  IonButton,
  IonHeader,
  IonPage,
  IonBackButton,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButtons
} from '@ionic/vue';
import {
  informationCircleOutline,
  cloudDownloadOutline,
  arrowForwardOutline,
  cogOutline,
  syncOutline,
  mailOutline,
  linkOutline,
} from 'ionicons/icons';
import { useLibraryStore } from '@/stores/libraryStore';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const libraryStore = useLibraryStore();
const route = useRoute();
const router = useRouter();
const collection = computed(() => {
    const collectionId = route.params.collection_id?.toString();

    return collectionId ? libraryStore.officialCollections[collectionId] : undefined;
});
</script>

<template>
    <ion-page v-if="collection">
        <ion-header class="mobile-only" :translucent="true">
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button text="" defaultHref="/library" color="inria-icon"></ion-back-button>
              </ion-buttons>
                <ion-title>{{ collection.title }}</ion-title>
                <ion-button role="button" class="icon-btn" @click="libraryStore.openAboutPublisher(collection.publisher)" slot="end">
                    <ion-icon
                        aria-label="Informations"
                        slot="icon-only"
                        :icon="informationCircleOutline"
                        color="inria-icon"
                    />
                </ion-button>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="mobile-only publisher-logo">
                <div
                    class="logo"
                    v-if="collection.publisher.logo"
                    :style="'background-image:url(' + collection.publisher.logo + ')'"
                />
                <div class="publisher-name" v-else>{{ collection.publisher.name }}</div>
            </div>

            <div class="web-only">
              <div class="web-page-header">
                <div class="web-page-header-logo" v-if="collection.publisher.logo">
                  <div
                      class="logo"
                      :style="'background-image:url(' + collection.publisher.logo + ')'"
                  />
                </div>
                <div class="web-page-header-info">
                  <h1>{{ collection.title }}</h1>
                  <p v-if="collection.publisher.description">{{ collection.publisher.description }}</p>
                  <div class="web-page-header-links">
                    <a v-if="collection.publisher.email" :href="`mailto:${collection.publisher.email}`"><ion-icon :icon="mailOutline"></ion-icon>{{ collection.publisher.email }}</a>
                    <a v-if="collection.publisher.website" :href="collection.publisher.website" target="_blank" rel="noopener"><ion-icon :icon="linkOutline"></ion-icon>{{ collection.publisher.website }}</a>
                  </div>
                </div>
              </div>
            </div>

            <div id="container">
                <div class="library-line-separator" />
                <div class="library-items" tabindex="-1">
                    <div class="library-item" v-for="epoc in Object.values(collection.ePocs)" :key="epoc.id">
                        <RouterLink
                            :to="{ name: 'EpocOverviewPage', params: { libraryId: collection.id, id: epoc.id } }"
                        >
                            <div
                                :aria-label="epoc.title"
                                class="library-item-image"
                                :style="'background-image:url(' + epoc.image + ')'"
                            />
                        </RouterLink>

                        <h3 aria-hidden="true" class="library-item-title">{{ epoc.title }}</h3>

                        <div class="library-item-toolbar" v-if="epoc.downloaded">
                            <ion-button
                                class="expanded"
                                color="inria"
                                @click="router.push({ name: 'TocPage', params: { epoc_id: epoc.id } })"
                            >
                                <span v-if="epoc.opened">{{ $t('LIBRARY_PAGE.CONTINUE') }}</span>
                                <ion-icon
                                    aria-hidden="true"
                                    v-if="epoc.opened"
                                    :icon="arrowForwardOutline"
                                    slot="end"
                                />
                                <span v-if="!epoc.opened">{{ $t('LIBRARY_PAGE.DISCOVER') }}</span>
                            </ion-button>

                            <ion-button
                                class="round"
                                :class="{ 'update-available': epoc.updateAvailable }"
                                color="inria-base-button"
                                @click="libraryStore.epocLibraryMenu(epoc, collection.id)"
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
                                @click="libraryStore.downloadEpoc(epoc, collection.id)"
                            >
                                <ion-icon aria-hidden="true" :icon="cloudDownloadOutline" slot="start" />
                                <span class="base-btn">{{ $t('LIBRARY_PAGE.DOWNLOAD') }}</span>
                            </ion-button>
                        </div>

                        <div class="library-item-toolbar" v-if="epoc.downloading">
                            <ion-button class="expanded" :disabled="true" color="inria-base-button">
                                <ion-icon aria-hidden="true" :icon="syncOutline" class="spin" slot="start" />
                                <span class="base-btn">
                                    {{ $t('LIBRARY_PAGE.DOWNLOADING') }}
                                    <!--<template v-if="epocProgresses[epoc.id]">({{epocProgresses[epoc.id]}}%)</template>-->
                                </span>
                            </ion-button>
                        </div>

                        <div class="library-item-toolbar" v-if="epoc.unzipping">
                            <ion-button class="expanded" :disabled="true" color="inria-base-button">
                                <ion-icon aria-hidden="true" :icon="cogOutline" class="spin" slot="start" />
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

.web-page-header {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem 1.5rem 1rem;
    border-bottom: 1px solid var(--ion-color-item);

    &-logo {
        flex-shrink: 0;
        width: 120px;
        height: 80px;

        .logo {
            width: 100%;
            height: 100%;
            background-size: contain;
            background-position: center left;
            background-repeat: no-repeat;
        }
    }

    &-info {
        flex: 1;
        min-width: 0;

        h1 {
            margin: 0 0 0.5rem;
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--ion-color-inria-blue);
            line-height: 1.2;
        }

        p {
            margin: 0 0 0.5rem;
            font-size: 0.9rem;
            color: var(--ion-color-text-2);
        }
    }

    &-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1.5rem;
        margin-top: 0.5rem;

        a {
            font-size: 0.875rem;
            color: var(--ion-color-inria);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }

            ion-icon {
              display: inline-block;
              vertical-align: middle;
              font-size: 1rem;
              margin-right: 5px;
            }
        }
    }
}
</style>
