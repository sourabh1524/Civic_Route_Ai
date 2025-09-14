
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

const translations: { [key: string]: any } = {
  en,
  hi,
};

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }
    // Fallback to English if translation is not found
    if (!result) {
      let fallbackResult = translations['en'];
      for (const k of keys) {
        fallbackResult = fallbackResult?.[k];
      }
      return fallbackResult || key;
    }
    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
