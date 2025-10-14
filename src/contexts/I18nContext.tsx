import { createContext, useContext } from 'react';
import type { Language, Translation } from '@/lib/i18n';

export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
  isRTL: boolean;
}

export const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}