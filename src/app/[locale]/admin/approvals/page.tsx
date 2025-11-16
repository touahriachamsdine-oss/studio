
import ProfessionalApprovalTable from '@/components/admin/ProfessionalApprovalTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';

export default async function AdminApprovalsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{dictionary.admin.approveRejectProfessionals}</CardTitle>
        <CardDescription>
          {dictionary.admin.approvalsPageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfessionalApprovalTable dictionary={dictionary.admin} />
      </CardContent>
    </Card>
  );
}
