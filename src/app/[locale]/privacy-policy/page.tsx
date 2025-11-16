
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

export default async function PrivacyPolicyPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);
  const currentDate = format(new Date(), 'MMMM d, yyyy');

  // Use the dictionary directly, as they should be unified now.
  const ppPageDict = dictionary.privacyPolicyPage;

  const sections = [
    { titleKey: 'section1Title', contentKey: 'section1Content' },
    { titleKey: 'section2Title', subtitle1Key: 'section2Subtitle1', para1Key: 'section2Para1', para2Key: 'section2Para2', subtitle2Key: 'section2Subtitle2', para3Key: 'section2Para3' },
    { titleKey: 'section3Title', contentKey: 'section3Content' },
    { titleKey: 'section4Title', contentKey: 'section4Content' },
    { titleKey: 'section5Title', contentKey: 'section5Content' },
    { titleKey: 'section6Title', contentKey: 'section6Content' },
    { titleKey: 'section7Title', contentKey: 'section7Content' },
    { titleKey: 'section8Title', contentKey: 'section8Content' },
  ] as const;


  return (
    <div className="container py-10 animate-fade-in-up max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">{ppPageDict.title}</CardTitle>
           {ppPageDict.contentIntro && (
            <CardDescription className="text-sm text-muted-foreground pt-2 whitespace-pre-line">
              {ppPageDict.contentIntro.replace('[Current Date]', currentDate).replace('> **Note:**', 'ملاحظة:').replace('**Note:**', 'ملاحظة:')}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          {sections.map(section => (
            ppPageDict[section.titleKey as keyof typeof ppPageDict] && (
              <section key={section.titleKey} className="mb-6">
                <h2 className="text-xl font-semibold mt-4 mb-2">
                  {ppPageDict[section.titleKey as keyof typeof ppPageDict]}
                </h2>
                {section.contentKey && ppPageDict[section.contentKey as keyof typeof ppPageDict] && (
                  <p className="whitespace-pre-line text-muted-foreground">
                    {ppPageDict[section.contentKey as keyof typeof ppPageDict].replace('[Your Website URL]', 'app.thiqbi.dz')}
                  </p>
                )}
                {section.subtitle1Key && ppPageDict[section.subtitle1Key as keyof typeof ppPageDict] && (
                  <>
                    <h3 className="text-lg font-semibold mt-3 mb-1">
                      {ppPageDict[section.subtitle1Key as keyof typeof ppPageDict]}
                    </h3>
                    {section.para1Key && ppPageDict[section.para1Key as keyof typeof ppPageDict] && <div className="whitespace-pre-line text-muted-foreground" dangerouslySetInnerHTML={{ __html: ppPageDict[section.para1Key as keyof typeof ppPageDict].replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>}
                    {section.para2Key && ppPageDict[section.para2Key as keyof typeof ppPageDict] && <div className="whitespace-pre-line text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: ppPageDict[section.para2Key as keyof typeof ppPageDict].replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>}
                  </>
                )}
                {section.subtitle2Key && ppPageDict[section.subtitle2Key as keyof typeof ppPageDict] && (
                  <>
                    <h3 className="text-lg font-semibold mt-3 mb-1">
                      {ppPageDict[section.subtitle2Key as keyof typeof ppPageDict]}
                    </h3>
                    {section.para3Key && ppPageDict[section.para3Key as keyof typeof ppPageDict] && <p className="whitespace-pre-line text-muted-foreground">{(ppPageDict[section.para3Key as keyof typeof ppPageDict]).replace('[Your Website URL]', 'app.thiqbi.dz')}</p>}
                  </>
                )}
              </section>
            )
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }];
}

    