
'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

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
  const [notificationsEnabled, setNotificationsEnabled] =
    React.useState(true);

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
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
      <PopoverContent side="right" align="start" className="w-64">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{translations.settings}</h4>
            <p className="text-sm text-muted-foreground">
              {translations.manage_settings}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language-select">{translations.language}</Label>
            <Select
              defaultValue={locale}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">
              {translations.push_notifications}
            </Label>
            <Switch
              id="push-notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
