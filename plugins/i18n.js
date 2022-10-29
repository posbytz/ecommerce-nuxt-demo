import { createI18n } from 'vue-i18n';
import ar from '../locales/ar.json';
import de from '../locales/de.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      ar,
      de,
      en,
      fr,
    },
    numberFormats: {
      'en-US': {
        currency: {
          style: 'currency',
          currency: 'USD',
          notation: 'standard',
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
        percent: {
          style: 'percent',
          useGrouping: false,
        },
      },
    },
  });

  vueApp.use(i18n);
});
