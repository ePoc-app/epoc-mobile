<script setup lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {StatusBar, Style} from '@capacitor/status-bar';
import {register} from 'swiper/element/bundle';
import {useSettingsStore} from './stores/settingsStore';
import {nextTick, onMounted, watch} from 'vue';
import {useI18n} from 'vue-i18n';

const settingsStore = useSettingsStore();

register();

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: 'light' | 'dark' | 'auto'): 'light' | 'dark' {
    return theme === 'auto' ? getSystemTheme() : theme;
}

function applyTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('color-scheme', theme);
}

async function applyStatusBarStyle(theme: 'light' | 'dark') {
    try {
      const statusBarInfo: any = await StatusBar.getInfo();
      document.documentElement.style.setProperty('--ion-safe-area-top', `${statusBarInfo.height}px`);
      if (theme === 'dark') {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#17191A00' });
      } else {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff00' });
      }
    } catch (e) {
        // In browser
    }
}

function loadTheme(theme: 'light' | 'dark' | 'auto') {
    const resolvedTheme = resolveTheme(theme);
    applyTheme(resolvedTheme);
    applyStatusBarStyle(resolvedTheme);
}

const { locale } = useI18n();

onMounted(async () => {
    await nextTick();
    loadTheme(settingsStore.settings.theme);
    locale.value = settingsStore.settings.lang;
});

watch(
    () => settingsStore.settings.theme,
    (newTheme) => {
        loadTheme(newTheme);
    }
);

watch(
    () => settingsStore.settings.lang,
    (newLang) => {
        locale.value = newLang;
    }
);
</script>
<template>
    <ion-app>
        <ion-router-outlet />
    </ion-app>
</template>
