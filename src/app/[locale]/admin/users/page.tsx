
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default async function AdminUsersPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          {dictionary.admin.viewUserActivity}
        </CardTitle>
        <CardDescription>
          {dictionary.admin.usersPageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded-md flex items-center justify-center" data-ai-hint="user activity graph">
          <p className="text-muted-foreground">{dictionary.admin.usersActivityDataPlaceholder}</p>
        </div>
      </CardContent>
    </Card>
  );
}
