import type { Locale } from '@/i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  fr: () => import('../../dictionaries/fr.json').then((module) => module.default),
  ar: () => import('../../dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] || dictionaries.en;
  try {
    return await loader();
  } catch (error) {
    console.error(`Dictionary for locale "${locale}" not found, falling back to "en".`, error);
    // The fallback will also use the corrected path via dictionaries.en
    return await dictionaries.en();
  }
};

// Export the type of the dictionary object
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
