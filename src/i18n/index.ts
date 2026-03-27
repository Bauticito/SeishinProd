import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es/translation.json';
import en from './locales/en/translation.json';
import ja from './locales/ja/translation.json';

const savedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('seishin_lang') : null;

const initialLanguage =
  savedLanguage === 'ja' ? 'ja' : savedLanguage === 'en' ? 'en' : 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: initialLanguage,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
  });

export default i18n;
