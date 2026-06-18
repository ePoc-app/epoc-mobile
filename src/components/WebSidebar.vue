<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { libraryOutline, settingsOutline, informationCircleOutline } from 'ionicons/icons';
import { RouterLink, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();

const isLibraryActive = computed(() =>
    route.path === '/library' ||
    route.path.startsWith('/library/') ||
    route.name === 'CollectionDetail'
);
</script>

<template>
    <nav class="web-sidebar-nav">
        <div aria-hidden="true" class="sidebar-logo">
            <div class="epoc-logo"></div>
            <div class="by-inria"></div>
        </div>
        <RouterLink
            to="/library"
            class="sidebar-nav-item"
            :class="{ active: isLibraryActive }"
        >
            <ion-icon :icon="libraryOutline" aria-hidden="true"></ion-icon>
            <span>{{ t('LIBRARY_PAGE.TITLE') }}</span>
        </RouterLink>
        <RouterLink
            to="/settings"
            class="sidebar-nav-item"
            :class="{ active: route.name === 'SettingsPage' }"
        >
            <ion-icon :icon="settingsOutline" aria-hidden="true"></ion-icon>
            <span>{{ t('SETTINGS_PAGE.SETTINGS') }}</span>
        </RouterLink>
        <RouterLink
            to="/about"
            class="sidebar-nav-item"
            :class="{ active: route.name === 'AboutPage' }"
        >
            <ion-icon :icon="informationCircleOutline" aria-hidden="true"></ion-icon>
            <span>{{ t('ABOUT_PAGE.ABOUT') }}</span>
        </RouterLink>
    </nav>
</template>

<style scoped lang="scss">
.web-sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0.75rem;
    height: 100%;
}

.sidebar-logo {
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

.sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    text-decoration: none;
    color: var(--ion-color-text);
    font-weight: 500;
    font-size: 0.95rem;

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
