
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Languages, Bell } from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
      supportedLngs: ['en', 'fr', 'ar'],
      fallbackLng: 'en',
      detection: {
        order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
        caches: ['cookie'],
      },
      backend: {
        loadPath: '/locales/{{lng}}/common.json',
      },
      react: { useSuspense: false }
    });
}


const I18nProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

export function SidebarClient({ locale }: { locale: string }) {
  return (
    <I18nProviderWrapper>
        <SettingsPopover locale={locale} />
    </I18nProviderWrapper>
  )
}


function SettingsPopover({ locale }: { locale: string }) {
    const { t } = useTranslation('common');
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        const supportedLocales = ['en', 'fr', 'ar'];
        const currentPath = pathname;
        
        // Find if the current path starts with a locale
        const pathSegments = currentPath.split('/');
        const currentLocale = supportedLocales.find(l => l === pathSegments[1]);

        let newPath;

        if (currentLocale) {
            // If there's a locale, replace it with the new one
            pathSegments[1] = newLocale;
            newPath = pathSegments.join('/');
        } else {
            // If there's no locale (it's 'en'), prepend the new one
            newPath = `/${newLocale}${currentPath}`;
        }

        // If the new locale is 'en', we need to remove the locale prefix
        if (newLocale === 'en') {
            if (currentLocale) {
                // Was on a prefixed locale, now going to 'en'
                pathSegments.splice(1, 1);
                newPath = pathSegments.join('/') || '/';
            } else {
                // Was already 'en', no change needed
                newPath = currentPath;
            }
        }
        
        if (newPath !== currentPath) {
            router.push(newPath);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">{t('settings')}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-60">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{t('settings')}</h4>
                        <p className="text-sm text-muted-foreground">{t('manage_settings')}</p>
                    </div>
                     <div className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-muted">
                        <Label htmlFor="language-select" className="flex items-center gap-2 cursor-pointer">
                            <Languages className="h-4 w-4" />
                            <span>{t('language')}</span>
                        </Label>
                         <Select
                            value={locale}
                            onValueChange={handleLanguageChange}
                          >
                            <SelectTrigger id="language-select" className="w-[100px]">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="ar">العربية</SelectItem>
                            </SelectContent>
                          </Select>
                    </div>
                    <div className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-muted">
                        <Label htmlFor="notifications-switch" className="flex items-center gap-2 cursor-pointer">
                            <Bell className="h-4 w-4" />
                            <span>{t('push_notifications')}</span>
                        </Label>
                        <Switch id="notifications-switch" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
