import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enLocales from './locales/en.json';
import ruLocales from './locales/ru.json';
import uzLocales from './locales/uz.json';

const resources = {
  en: { translation: enLocales },
  ru: { translation: ruLocales },
  uz: { translation: uzLocales }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz', // default language
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
