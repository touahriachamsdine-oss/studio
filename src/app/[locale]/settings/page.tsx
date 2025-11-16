
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Lock, Globe, ShieldAlert, Settings as SettingsIcon } from 'lucide-react';
import { ThemeToggleButton } from '@/components/shared/ThemeToggleButton';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default async function SettingsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  // Mock user data - in a real app, this would come from authentication state
  const user = {
    name: 'Demo User', 
    email: 'demo@example.com',
  };

  const languageSwitcherDictionary = {
    english: dictionary.english,
    french: dictionary.french,
    arabic: dictionary.arabic,
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto animate-fade-in-up">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center">
            <SettingsIcon className="mr-3 h-7 w-7 text-primary" />
            {dictionary.settings}
          </CardTitle>
          <CardDescription>
            {dictionary.settingsPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              {dictionary.settingsPage.accountInformationTitle}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{dictionary.form.fullName}</Label>
                <Input id="name" defaultValue={user.name} disabled />
              </div>
              <div>
                <Label htmlFor="email">{dictionary.form.email}</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled />
              </div>
              <Button variant="outline" disabled>{dictionary.settingsPage.editProfileButton}</Button>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
              {dictionary.settingsPage.appearanceAndLanguageTitle}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <Label className="font-medium">{dictionary.settingsPage.themeLabel}</Label>
                  <p className="text-sm text-muted-foreground">{dictionary.settingsPage.themeDescription}</p>
                </div>
                <ThemeToggleButton dictionary={dictionary.theme} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <Label className="font-medium">{dictionary.language}</Label>
                  <p className="text-sm text-muted-foreground">{dictionary.settingsPage.languageDescription}</p>
                </div>
                <LanguageSwitcher dictionary={languageSwitcherDictionary} />
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-muted-foreground" />
              {dictionary.settingsPage.notificationPreferencesTitle}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="email-notifications">{dictionary.settingsPage.emailNotificationsLabel}</Label>
                <Switch id="email-notifications" disabled />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="sms-notifications">{dictionary.settingsPage.smsNotificationsLabel}</Label>
                <Switch id="sms-notifications" disabled />
              </div>
              <p className="text-xs text-muted-foreground">
                {dictionary.settingsPage.notificationsHint}
              </p>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-muted-foreground" />
              {dictionary.settingsPage.securityTitle}
            </h2>
            <div className="space-y-3">
              <Button variant="outline" disabled>{dictionary.settingsPage.changePasswordButton}</Button>
              <Button variant="outline" disabled>{dictionary.settingsPage.enable2FAButton}</Button>
              <p className="text-xs text-muted-foreground">
                {dictionary.settingsPage.securityHint}
              </p>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
