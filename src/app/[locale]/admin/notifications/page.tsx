
import { getDictionary } from '@/lib/dictionary';
import type { Dictionary, Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';

export default async function AdminNotificationsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  const getLanguageName = (currentLocale: Locale, langDict: Dictionary['language']): string => {
    if (currentLocale === 'en') return langDict.english;
    if (currentLocale === 'fr') return langDict.french;
    if (currentLocale === 'ar') return langDict.arabic;
    return currentLocale.toUpperCase();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          {dictionary.admin.sendNotifications}
        </CardTitle>
        <CardDescription>
          {dictionary.admin.notificationsPageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="notification-message">{dictionary.admin.notificationMessageLabel} ({getLanguageName(locale, dictionary.language)})</Label>
          <Textarea 
            id="notification-message" 
            placeholder={dictionary.admin.notificationMessagePlaceholder.replace('{language}', getLanguageName(locale, dictionary.language))} 
            className="min-h-[100px]" 
          />
        </div>
        <Button disabled>{dictionary.admin.sendNotificationButton}</Button>
        <p className="text-sm text-muted-foreground">
          {dictionary.admin.notificationsTargetingPlaceholder}
        </p>
      </CardContent>
    </Card>
  );
}
