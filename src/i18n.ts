import { createI18n } from 'vue-i18n';

import localeDE from '@/assets/i18n/de.json';
import localeEN from '@/assets/i18n/en.json';
import localeES from '@/assets/i18n/es.json';
import localeFR from '@/assets/i18n/fr.json';
import localeIT from '@/assets/i18n/it.json';

const messages = {
    de: localeDE,
    en: localeEN,
    es: localeES,
    fr: localeFR,
    it: localeIT,
};

export const i18n = createI18n({
    legacy: false, // to use composition instead of option https://vue-i18n.intlify.dev/guide/advanced/composition
    locale: 'fr',
    fallbackLocale: 'en',
    messages,
});
