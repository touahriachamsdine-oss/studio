
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileCheck2, BarChart3 } from 'lucide-react';

export default async function AdminDashboardPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  // Mock data - replace with real data fetching
  const stats = [
    { titleKey: "totalUsers", value: "1,234", icon: Users, dataAiHint: "users icon" },
    { titleKey: "pendingApprovals", value: "12", icon: FileCheck2, dataAiHint: "approval icon" },
    { titleKey: "activeSubscriptions", value: "456", icon: BarChart3, dataAiHint: "chart icon" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.titleKey} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {dictionary.admin[stat.titleKey as keyof typeof dictionary.admin] || stat.titleKey}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" data-ai-hint={stat.dataAiHint} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{dictionary.admin.dashboardRecentActivityTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {dictionary.admin.dashboardRecentActivityPlaceholder}
          </p>
          <div className="mt-4 h-64 bg-muted rounded-md flex items-center justify-center" data-ai-hint="admin dashboard chart">
             <p>{dictionary.admin.dashboardActivityChartPlaceholder}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    