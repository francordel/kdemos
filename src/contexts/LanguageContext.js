import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeGet, safeSet } from '../utils/storage';
import es from '../i18n/es';
import en from '../i18n/en';
import de from '../i18n/de';
import fr from '../i18n/fr';
import it from '../i18n/it';
import pt from '../i18n/pt';
import nl from '../i18n/nl';
import ca from '../i18n/ca';
import pl from '../i18n/pl';
import da from '../i18n/da';
import sv from '../i18n/sv';
import no from '../i18n/no';
import tr from '../i18n/tr';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  es,
  en,
  de,
  fr,
  it,
  pt,
  nl,
  ca,
  pl,
  da,
  sv,
  no,
  tr
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    // Prioridad: ?lang= (llegada desde las landings por idioma) > localStorage > navegador
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && translations[urlLang]) {
      setLanguage(urlLang);
      safeSet('calendar-language', urlLang);
      return;
    }

    const savedLanguage = safeGet('calendar-language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.slice(0, 2);
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  // <html lang> sigue al idioma activo: text-transform: uppercase usa sus reglas (tr: i → İ)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      safeSet('calendar-language', newLanguage);
    }
  };

  const t = (key) => {
    // Fallback en cadena: idioma activo → inglés → español → la clave
    return translations[language]?.[key] || translations.en[key] || translations.es[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
