import { en } from './en';
import { ar } from './ar';
import { fa } from './fa';
import type { Translation } from './types';

export type Language = 'en' | 'ar' | 'fa';

export const translations: Record<Language, Translation> = {
  en,
  ar,
  fa
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی'
};

export const isRTL = (language: Language): boolean => {
  return language === 'ar' || language === 'fa';
};

export function getTranslation(language: Language): Translation {
  return translations[language] || translations.en;
}

export function getDirection(language: Language): 'ltr' | 'rtl' {
  return isRTL(language) ? 'rtl' : 'ltr';
}

export * from './types';
export { en, ar, fa };