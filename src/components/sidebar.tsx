"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid, Calendar, Map, Route, Sparkles, Settings, Bell, Languages } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@/lib/i18n';

const navItems = [
  { href: '/', labelKey: 'home', icon: LayoutGrid },
  { href: '/calendar', labelKey: 'calendar', icon: Calendar },
  { href: '/map', labelKey: 'map', icon: Map },
  { href: '/guide', labelKey: 'touristGuide', icon: Route },
  { href: '/suggestions', labelKey: 'forYou', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
    
    const locales = i18n.options.lngs?.filter((lng) => lng !== 'cimode') || ['en', 'fr', 'ar'];
    const defaultLocale = i18n.options.fallbackLng as string;
    const pathParts = pathname.split('/');
    const currentLocale = locales.find(loc => loc === pathParts[1]);
    
    let pathWithoutLocale = pathname;

    if (currentLocale) {
        pathParts.splice(1, 1);
        pathWithoutLocale = pathParts.join('/') || '/';
    }

    let newPath;
    if (newLocale === defaultLocale) {
      newPath = pathWithoutLocale;
    } else {
      newPath = `/${newLocale}${pathWithoutLocale}`;
    }

    router.push(newPath);
  };
  

  const currentLang = isClient ? i18n.language.split('-')[0] : 'en';

  return (
    <aside className="sticky top-0 h-screen w-16 bg-card text-card-foreground border-e transition-all duration-300 ease-in-out flex flex-col items-center py-4 shadow-md">
       <div className="p-2 mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-col items-center gap-2 flex-grow">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname.split('/').filter(p => p).length <= 1 : pathname.includes(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'h-10 w-10',
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{isClient ? t(item.labelKey) : item.labelKey}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left" align="center">
                  {isClient ? t(item.labelKey) : item.labelKey}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-2 mt-auto">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">{isClient ? t('settings') : 'Settings'}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent side="left" className="w-60">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">{isClient ? t('settings') : 'Settings'}</h4>
                            <p className="text-sm text-muted-foreground">{isClient ? t('manage_settings') : 'Manage your settings'}</p>
                        </div>
                         <div className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-muted">
                            <Label htmlFor="language-select" className="flex items-center gap-2 cursor-pointer">
                                <Languages className="h-4 w-4" />
                                <span>{isClient ? t('language') : 'Language'}</span>
                            </Label>
                             <Select
                                value={currentLang}
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
                                <span>{isClient ? t('push_notifications') : 'Push Notifications'}</span>
                            </Label>
                            <Switch id="notifications-switch" />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </TooltipProvider>
    </aside>
  );
}
