import { en } from './en';
import { ar } from './ar';
import { fa } from './fa';
import { ru } from './ru';
import type { Translation } from './types';

export type Language = 'en' | 'ar' | 'fa' | 'ru';

export const translations: Record<Language, Translation> = {
  en,
  ar,
  fa,
  ru
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی',
  ru: 'Русский'
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