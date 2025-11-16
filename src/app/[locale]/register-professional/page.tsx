
import { AuthCard } from "@/components/auth/AuthCard";
import { ProfessionalRegistrationForm } from "@/components/auth/ProfessionalRegistrationForm";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/i18n-config";
import Link from "next/link";

export default async function RegisterProfessionalPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <AuthCard 
      title={dictionary.professionalRegistration.title}
      description={dictionary.professionalRegistration.description}
      footerContent={
        <div className="text-center text-sm text-muted-foreground">
        {dictionary.form.alreadyHaveAccount}{" "}
          <Link href={`/${locale}/login`} className="font-semibold text-primary hover:underline">
            {dictionary.login}
          </Link>
        </div>
      }
    >
      <ProfessionalRegistrationForm dictionary={{...dictionary.professionalRegistration, ...dictionary.form}} locale={locale} />
    </AuthCard>
  );
}
