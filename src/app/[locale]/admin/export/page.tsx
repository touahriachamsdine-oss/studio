
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default async function AdminExportPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-6 w-6" />
          {dictionary.admin.exportData}
        </CardTitle>
        <CardDescription>
          {dictionary.admin.exportPageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{dictionary.admin.exportData}:</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled>{dictionary.admin.exportUserDataButton}</Button>
          <Button variant="outline" disabled>{dictionary.admin.exportProfessionalDataButton}</Button>
          <Button variant="outline" disabled>{dictionary.admin.exportTransactionHistoryButton}</Button>
        </div>
         <p className="text-sm text-muted-foreground">
          {dictionary.admin.exportAdvancedFilteringPlaceholder}
        </p>
      </CardContent>
    </Card>
  );
}
