import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('mindcare_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('mindcare_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'bn' : 'en'));
  }, []);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'bn') {
      setLanguageState(lang);
    }
  }, []);

  /**
   * Helper function to retrieve translated string by dot notation key path.
   * e.g., t('home.howFeeling') or t('home.glassesCount', { count: 3 })
   */
  const t = useCallback((keyPath, params = {}) => {
    const keys = keyPath.split('.');
    let value = translations[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fKey of keys) {
          if (fallback && typeof fallback === 'object' && fKey in fallback) {
            fallback = fallback[fKey];
          } else {
            fallback = undefined;
            break;
          }
        }
        value = fallback !== undefined ? fallback : keyPath;
        break;
      }
    }

    if (typeof value === 'string' && params && typeof params === 'object') {
      let interpolated = value;
      for (const [paramKey, paramVal] of Object.entries(params)) {
        interpolated = interpolated.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      }
      return interpolated;
    }

    return value || keyPath;
  }, [language]);

  const isBengali = language === 'bn';

  return (
    <LanguageContext.Provider
      value={{
        language,
        isBengali,
        toggleLanguage,
        setLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
