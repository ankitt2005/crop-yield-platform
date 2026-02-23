import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 👇 UPDATE THIS LINE TO POINT TO THE 'data' FOLDER
import { translations } from './data/translations'; 

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: translations.en 
      },
      hi: { 
        translation: translations.hi 
      },
      od: { 
        translation: translations.od 
      },
      te: { 
        translation: translations.te 
      },
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;