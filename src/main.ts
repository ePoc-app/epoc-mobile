import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import {useStorage} from '@/composables/useStorage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import localeDE from '@/assets/i18n/de.json'
import localeEN from '@/assets/i18n/en.json'
import localeES from '@/assets/i18n/es.json'
import localeFR from '@/assets/i18n/fr.json'
import localeIT from '@/assets/i18n/it.json'


/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.scss';

const pinia = createPinia()
const messages = {
  de: localeDE,
  en: localeEN,
  es: localeES,
  fr: localeFR,
  it: localeIT
}

const i18n = createI18n({
  legacy: false, // to use composition instead of option https://vue-i18n.intlify.dev/guide/advanced/composition
  locale: 'fr', 
  fallbackLocale: 'en', 
  messages, 
})

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
  .use(i18n);

router.isReady().then(() => {
  app.mount('#app');
  useStorage();
});
