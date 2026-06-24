<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import {
  libraryOutline,
  settingsOutline,
  informationCircleOutline,
  cubeOutline,
  starOutline,
  receiptOutline, listCircleOutline,
} from 'ionicons/icons';
import { RouterLink, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useEpocStore } from '@/stores/epocStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { displayLicence } from '@/utils/app';
import { useAppMode } from '@/composables/useAppMode';

const { t } = useI18n();
const route = useRoute();
const { isPreview } = useAppMode();
const epocStore = useEpocStore();
const libraryStore = useLibraryStore();
const { epoc, rootFolder } = storeToRefs(epocStore);

const isLibraryActive = computed(() =>
    route.path === '/library' ||
    route.path.startsWith('/library/') ||
    route.name === 'CollectionDetail'
);

const aboutEpocLink = computed(() => {
    if (!epoc.value) return '';
    if (isPreview.value) return '/';
    const id = epoc.value.id;
    const libraryId = id.startsWith('local-') ? 'local-epocs' : libraryStore.findCollectionByEpocId(id);
    return libraryId ? `/${libraryId}/${id}` : '';
});
</script>

<template>
    <nav class="web-sidebar-nav">
        <div class="sidebar-start">
            <RouterLink to="/" class="sidebar-logo">
                <div class="epoc-logo"></div>
                <div class="by-inria"></div>
            </RouterLink>
        </div>
        <div class="sidebar-center">
            <RouterLink
                v-if="!isPreview"
                to="/library"
                class="sidebar-nav-item"
                :class="{ active: isLibraryActive }"
            >
                <ion-icon :icon="libraryOutline" aria-hidden="true"></ion-icon>
                <span>{{ t('LIBRARY_PAGE.TITLE') }}</span>
            </RouterLink>

            <template v-if="epoc">
                <div class="sidebar-divider" v-if="!isPreview"></div>
                <div class="sidebar-epoc-header">
                    <img
                        v-if="epoc.image"
                        :src="rootFolder + epoc.image"
                        alt=""
                        aria-hidden="true"
                        class="sidebar-epoc-thumbnail"
                    />
                    <span class="sidebar-epoc-title">{{ epoc.title }}</span>
                </div>
                <RouterLink
                    :to="aboutEpocLink"
                    class="sidebar-nav-item"
                    :class="{ active: route.name === 'EpocOverviewPage' || route.name === 'OverviewEditorPage' }"
                >
                    <ion-icon :icon="cubeOutline" aria-hidden="true"></ion-icon>
                    <span>{{ t('FLOATING_MENU.ABOUT') }}</span>
                </RouterLink>
                <RouterLink
                    :to="'/epoc/toc/' + epoc.id"
                    class="sidebar-nav-item"
                    :class="{ active: route.name === 'TocPage' }"
                >
                    <ion-icon :icon="listCircleOutline" aria-hidden="true"></ion-icon>
                    <span>{{ t('FLOATING_MENU.TOC') }}</span>
                </RouterLink>
                <RouterLink
                    :to="'/epoc/score/' + epoc.id"
                    class="sidebar-nav-item"
                    :class="{ active: route.name === 'ScorePage' }"
                >
                    <ion-icon :icon="starOutline" aria-hidden="true"></ion-icon>
                    <span>{{ t('FLOATING_MENU.SCORE_DETAILS') }}</span>
                </RouterLink>
                <button
                    class="sidebar-nav-item"
                    @click="displayLicence(epoc)"
                >
                    <ion-icon :icon="receiptOutline" aria-hidden="true"></ion-icon>
                    <span>{{ t('FLOATING_MENU.LICENSE') }}</span>
                </button>
            </template>
        </div>
        <div class="sidebar-end">
            <RouterLink
                to="/about"
                class="sidebar-nav-item"
                :class="{ active: route.name === 'AboutPage' }"
            >
                <ion-icon :icon="informationCircleOutline" aria-hidden="true"></ion-icon>
                <span>{{ t('ABOUT_PAGE.ABOUT') }}</span>
            </RouterLink>
            <RouterLink
                to="/settings"
                class="sidebar-nav-item"
                :class="{ active: route.name === 'SettingsPage' }"
            >
                <ion-icon :icon="settingsOutline" aria-hidden="true"></ion-icon>
                <span>{{ t('SETTINGS_PAGE.SETTINGS') }}</span>
            </RouterLink>
        </div>
    </nav>
</template>

<style scoped lang="scss">
.web-sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0.75rem;
    height: 100%;
}

.sidebar-center {
    flex-grow: 1;
}

.sidebar-logo {
    display: block;
    padding: 0 0.75rem 2rem 0.75rem;

    .epoc-logo {
        width: 100px;
        height: 30.5px;
        background: var(--epoc-logo) no-repeat;
    }

    .by-inria {
        width: 35px;
        height: 9.4px;
        margin-left: 65px;
        margin-top: -5px;
        background: var(--by-inria) no-repeat;
    }
}

.sidebar-divider {
    height: 1px;
    margin: 0.75rem 1rem;
    background: var(--ion-color-item);
}

.sidebar-epoc-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.25rem 1rem 0.75rem;
}

.sidebar-epoc-thumbnail {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 0.4rem;
    box-shadow: var(--epoc-box-shadow);
    flex-shrink: 0;
}

.sidebar-epoc-title {
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--ion-color-text);
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    border: none;
    text-decoration: none;
    color: var(--ion-color-text);
    font-weight: 500;
    font-size: 0.95rem;
    background: none;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
    box-sizing: border-box;

    ion-icon {
        font-size: 1.3rem;
        color: var(--ion-color-text-2);
        flex-shrink: 0;
    }

    &:hover {
        background: var(--ion-color-item);
    }

    &.active {
        color: var(--ion-color-inria);
        background: var(--ion-color-inria-light);

        ion-icon {
            color: var(--ion-color-inria);
        }
    }
}
</style>
