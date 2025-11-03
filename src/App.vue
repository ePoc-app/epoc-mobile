<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/vue';
import {StatusBar, Style} from '@capacitor/status-bar';

function getTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadTheme(theme: string) {
    let myTheme;
    if(theme) {
        myTheme = (theme === 'auto') ? getTheme() : theme;
    }
    const root = document.querySelector(':root');
    root?.setAttribute('color-scheme', `${myTheme}`);
    if (myTheme === 'dark') {
        if(isPlatform('ios')) {
            StatusBar.setStyle({ style: Style.Dark }).catch(()=>{});
        }
    } else {
        if(isPlatform('ios')) {
            StatusBar.setStyle({ style: Style.Light }).catch(()=>{});
        }
    }
}

loadTheme("auto")

</script>
