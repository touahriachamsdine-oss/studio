
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import UserProfileDisplay from '@/components/profile/UserProfileDisplay';

export default async function ProfilePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <UserProfileDisplay 
      dictionary={dictionary} 
      locale={locale} 
    />
  );
}
