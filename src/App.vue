<script setup lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from "@ionic/vue";
import { StatusBar, Style } from "@capacitor/status-bar";
import { register } from "swiper/element/bundle";
import { useSettingsStore } from "./stores/settingsStore";
import { watch, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";

const settingsStore = useSettingsStore();

register();

function getSystemTheme(): "light" | "dark" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: "light" | "dark" | "auto"): "light" | "dark" {
    return theme === "auto" ? getSystemTheme() : theme;
}

function applyTheme(theme: "light" | "dark") {
    document.documentElement.setAttribute("color-scheme", theme);
}

async function applyStatusBarStyle(theme: "light" | "dark") {
    if (!isPlatform("ios")) return;

    const style = theme === "dark" ? Style.Dark : Style.Light;
    try {
        await StatusBar.setStyle({ style });
    } catch (e) {
        // In browser
    }
}

function loadTheme(theme: "light" | "dark" | "auto") {
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
