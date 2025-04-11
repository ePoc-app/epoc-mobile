import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { IonicVue } from '@ionic/vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';

// Import Ionic CSS
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

// Import global styles
import './theme/variables.scss';
import './theme/global.scss';

// Import translations
import en from './i18n/en.json';
import fr from './i18n/fr.json';

// Import environment
import { defaultLanguage } from './environments/languages';

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: defaultLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
});

// Create Pinia store
const pinia = createPinia();

// Create app
const app = createApp(App)
  .use(IonicVue, {
    mode: 'ios', // Use iOS mode by default for consistent UI
    swipeBackEnabled: true
  })
  .use(router)
  .use(i18n)
  .use(pinia);

// Wait for the router to be ready before mounting
router.isReady().then(() => {
  app.mount('#app');
});
