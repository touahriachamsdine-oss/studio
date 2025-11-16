
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default async function UserDashboardPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <div className="container py-10 animate-fade-in-up">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl sm:text-3xl">
            <LayoutDashboard className="h-6 w-6" />
            {dictionary.dashboard}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {dictionary.dashboardPage.welcomeMessage}
          </p>
          <div className="mt-6 h-64 bg-muted rounded-md flex items-center justify-center" data-ai-hint="dashboard activity chart">
            <p>{dictionary.dashboardPage.contentPlaceholder}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
