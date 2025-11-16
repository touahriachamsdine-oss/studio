
'use client';

import { getDictionary } from '@/lib/dictionary';
import type { Locale, Dictionary } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, AlertTriangle } from 'lucide-react'; // Using Briefcase as an icon for professionals
import { useAuth } from '@/hooks/use-auth-store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import

export default function ProfessionalDashboardPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { user, isLoading, role } = useAuth();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const router = useRouter();

  useEffect(() => {
    getDictionary(locale).then(setDictionary);
  }, [locale]);

  useEffect(() => {
    if (!isLoading && role !== 'professional') {
      router.push(`/${locale}/login`); // Redirect if not a professional or not logged in
    }
  }, [isLoading, role, router, locale]);

  if (isLoading || !user || role !== 'professional' || !dictionary) {
    return (
      <div className="container py-10 text-center animate-fade-in-up">
        <p>Loading Professional Dashboard...</p>
        {/* You can add a spinner or skeleton loader here */}
      </div>
    );
  }

  if (!user.isApproved) {
    return (
      <div className="container py-10 animate-fade-in-up">
        <Card className="shadow-lg border-yellow-500">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl sm:text-3xl text-yellow-600">
              {dictionary.professionalDashboardPage.pendingApprovalMessage.split('.')[0]} {/* Title part */}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              {dictionary.professionalDashboardPage.pendingApprovalMessage}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 animate-fade-in-up">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl sm:text-3xl">
            <Briefcase className="h-6 w-6" />
            {dictionary.professionalDashboard}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {dictionary.professionalDashboardPage.welcomeMessage}
          </p>
          <div className="mt-6 h-64 bg-muted rounded-md flex items-center justify-center" data-ai-hint="professional dashboard activity">
            <p>{dictionary.professionalDashboardPage.contentPlaceholder}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
