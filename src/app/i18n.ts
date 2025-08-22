
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const initI18next = async (lng: string, ns?: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
    .init({
      supportedLngs: ['en', 'fr', 'ar'],
      fallbackLng: 'fr',
      lng,
      ns: ns || 'common',
      defaultNS: 'common',
    });
  return i18nInstance;
};

export async function getTranslation(lng: string, ns?: string, keyPrefix?: string) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, ns, keyPrefix),
    i18n: i18nextInstance,
  };
}
