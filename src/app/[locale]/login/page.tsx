
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/i18n-config";
import Link from "next/link";

export default async function LoginPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <AuthCard 
      title={dictionary.login}
      description={dictionary.loginPage.description}
      footerContent={
        <div className="text-center text-sm text-muted-foreground">
          {dictionary.form.dontHaveAccount}{" "}
          <Link href={`/${locale}/signup`} className="font-semibold text-primary hover:underline">
            {dictionary.signup}
          </Link>
          <br />
          <Link href={`/${locale}/register-professional`} className="font-semibold text-primary hover:underline">
            {dictionary.form.registerProfessional}
          </Link>
        </div>
      }
    >
      <LoginForm dictionary={dictionary.form} locale={locale} />
    </AuthCard>
  );
}
