
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/i18n-config";
import Link from "next/link";

export default async function SignupPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <AuthCard 
      title={dictionary.signup}
      description={dictionary.signupPage.description}
      footerContent={
        <div className="text-center text-sm text-muted-foreground">
        {dictionary.form.alreadyHaveAccount}{" "}
          <Link href={`/${locale}/login`} className="font-semibold text-primary hover:underline">
            {dictionary.login}
          </Link>
        </div>
      }
    >
      <SignupForm dictionary={dictionary} locale={locale} />
    </AuthCard>
  );
}
