import { ReactNode, useEffect, useState } from 'react';
import { I18nContext } from '@/contexts/I18nContext';
import { getTranslation, getDirection, isRTL, type Language } from '@/lib/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    const defaultLang = (import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') as Language;
    return saved && ['en', 'ar', 'fa'].includes(saved) ? saved : defaultLang;
  });

  const t = getTranslation(language);
  const currentIsRTL = isRTL(language);

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Set document direction and lang attribute
    document.documentElement.dir = getDirection(language);
    document.documentElement.lang = language;
    
    // Add RTL class to body for styling
    if (currentIsRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, currentIsRTL]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL: currentIsRTL,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}