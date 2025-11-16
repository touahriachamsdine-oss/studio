
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget'; // Import the chatbot widget

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  return {
    title: {
      default: dictionary.appName,
      template: `%s | ${dictionary.appName}`,
    },
    description: dictionary.tagline,
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dictionary = await getDictionary(locale);
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const layoutClasses = cn(
    "flex min-h-screen flex-col",
    locale === 'ar' && "font-arabic-active" // Add class for Arabic font
  );

  return (
    <div lang={locale} dir={direction} className={layoutClasses}>
      <Header dictionary={dictionary} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer dictionary={dictionary} locale={locale} />
      <ChatbotWidget locale={locale} dictionary={dictionary.chatbot} /> {/* Add ChatbotWidget here */}
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }];
}
