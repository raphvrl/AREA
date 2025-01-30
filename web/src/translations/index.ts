import { frTranslations } from './fr';
import { enTranslations } from './en';
import { deTranslations } from './de';
import { itTranslations } from './it';
import { esTranslations } from './es';
import { zhTranslations } from './zh';
import { jaTranslations } from './ja';
import { Language, TranslationKey } from './types';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  fr: frTranslations,
  en: enTranslations,
  de: deTranslations,
  it: itTranslations,
  es: esTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
};

export * from './types';
