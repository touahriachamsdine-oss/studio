
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18n } from 'next-i18next';

export async function getTranslation(lng: string, ns: string, options: { keyPrefix?: string } = {}) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
    .init({
      //lng: i18n.language, //TODO
      lng,
      ns,
      fallbackLng: 'en',
      defaultNS: ns,
    });
    
  return {
    t: i18nInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nInstance,
  };
}
