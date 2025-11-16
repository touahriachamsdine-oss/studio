
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

export default async function TermsOfServicePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);
  const currentDate = format(new Date(), 'MMMM d, yyyy');

  // Fallback to English if specific locale content is just a placeholder key
  const tosPageDict = dictionary.termsOfServicePage || (await getDictionary('en')).termsOfServicePage;

  const sections = [
    { titleKey: 'section1Title', contentKey: 'section1Content' },
    { titleKey: 'section2Title', contentKey: 'section2Content' },
    { titleKey: 'section3Title', contentKey: 'section3Content' },
    { titleKey: 'section4Title', contentKey: 'section4Content' },
    { titleKey: 'section5Title', contentKey: 'section5Content' },
    { titleKey: 'section6Title', contentKey: 'section6Content' },
    { titleKey: 'section7Title', contentKey: 'section7Content' },
    { titleKey: 'section8Title', contentKey: 'section8Content' },
    { titleKey: 'section9Title', contentKey: 'section9Content' },
    { titleKey: 'section10Title', contentKey: 'section10Content' },
  ] as const;


  return (
    <div className="container py-10 animate-fade-in-up max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">{tosPageDict.title}</CardTitle>
          {tosPageDict.contentIntro && (
            <CardDescription className="text-sm text-muted-foreground pt-2">
              {tosPageDict.contentIntro.replace('[Current Date]', currentDate)}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          {sections.map(section => (
            <section key={section.titleKey} className="mb-6">
              <h2 className="text-xl font-semibold mt-4 mb-2">
                {tosPageDict[section.titleKey as keyof typeof tosPageDict] || section.titleKey}
              </h2>
              <p className="whitespace-pre-line text-muted-foreground">
                { (tosPageDict[section.contentKey as keyof typeof tosPageDict] || section.contentKey).replace('[Your Website URL]', 'app.lexconnect.dz') }
              </p>
            </section>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }];
}
