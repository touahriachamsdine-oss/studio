"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Languages, Bell } from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface SidebarClientProps {
  locale: string;
  translations: {
    settings: string;
    manage_settings: string;
    language: string;
    push_notifications: string;
  };
}

export function SidebarClient({ locale, translations }: SidebarClientProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        // This function should construct the new path correctly.
        // The pathname for a non-default locale will be like /fr/some-page
        // The pathname for the default locale will be like /some-page
        const pathParts = pathname.split('/');
        const currentLocale = ['en', 'fr', 'ar'].includes(pathParts[1]) ? pathParts[1] : 'en';

        let newPath;
        if (currentLocale !== 'en') {
            // It's a prefixed path, so we replace the prefix
            newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
        } else {
            // It's the default path, so we just add the prefix
            newPath = `/${newLocale}${pathname}`;
        }

        // Handle switching back to the default locale, which shouldn't have a prefix.
        if (newLocale === 'en') {
             newPath = pathname.replace(`/${currentLocale}`, '');
             if (newPath === '') newPath = '/';
        }

        router.push(newPath);
        router.refresh();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">{translations.settings}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-60">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{translations.settings}</h4>
                        <p className="text-sm text-muted-foreground">{translations.manage_settings}</p>
                    </div>
                     <div className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-muted">
                        <Label htmlFor="language-select" className="flex items-center gap-2 cursor-pointer">
                            <Languages className="h-4 w-4" />
                            <span>{translations.language}</span>
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
                            <span>{translations.push_notifications}</span>
                        </Label>
                        <Switch id="notifications-switch" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
