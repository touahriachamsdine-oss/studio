
import { getDictionary } from '@/lib/dictionary';
import { i18n, type Locale } from '@/i18n-config';
import { servicesList } from '@/lib/servicesData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Info, Users, ListOrdered } from 'lucide-react';

export async function generateStaticParams() {
  const locales: Locale[] = i18n.locales;
  const params: { locale: Locale; serviceId: string }[] = [];

  locales.forEach(locale => {
    servicesList.forEach(service => {
      params.push({ locale: locale, serviceId: service.id });
    });
  });

  return params;
}

export default async function ServiceDetailPage({ params: { locale, serviceId } }: { params: { locale: Locale, serviceId: string } }) {
  const dictionary = await getDictionary(locale);
  const service = servicesList.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="container py-10 text-center animate-fade-in-up">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">{dictionary.serviceDetailPage.notFoundTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{dictionary.serviceDetailPage.notFoundText}</p>
            <Button asChild className="mt-6">
              <Link href={`/${locale}/services`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> {dictionary.serviceDetailPage.backToServicesButton}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const serviceTitle = dictionary.service[service.titleKey]?.title || "Service Title";
  const serviceDescription = dictionary.service[service.titleKey]?.description || "Service description.";
  const IconComponent = service.icon;

  return (
    <div className="container py-10 animate-fade-in-up">
      <div className="grid md:grid-cols-3 gap-8 mb-10 items-start">
        <div className="md:col-span-1">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={`https://placehold.co/600x450.png`}
              alt={serviceTitle}
              fill
              className="object-cover"
              data-ai-hint={`${service.dataAiHint} service illustration`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Card className="shadow-lg h-full">
            <CardHeader>
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                  <IconComponent className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">{serviceTitle}</CardTitle>
              </div>
              <CardDescription className="text-md sm:text-lg text-muted-foreground">
                {serviceDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Button asChild size="lg" className="w-full mt-4">
                 <Link href={`/${locale}/professionals?serviceId=${service.id}`}>
                   <Users className="mr-2 h-5 w-5" /> {dictionary.serviceDetailPage.findProfessionalButton}
                 </Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center">
            <ListOrdered className="mr-3 h-6 w-6 text-primary" />
            {dictionary.serviceDetailPage.proceduresTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-6 pl-6 sm:pl-8">
          <ol className="list-decimal list-inside space-y-4">
            <li>
              <strong className="text-foreground block mb-1">{dictionary.serviceDetailPage.step1Title}</strong>
              {dictionary.serviceDetailPage.step1Details.replace('{serviceTitle}', serviceTitle)}
            </li>
            <li>
              <strong className="text-foreground block mb-1">{dictionary.serviceDetailPage.step2Title}</strong>
              {dictionary.serviceDetailPage.step2Details}
            </li>
            <li>
              <strong className="text-foreground block mb-1">{dictionary.serviceDetailPage.step3Title}</strong>
              {dictionary.serviceDetailPage.step3Details}
            </li>
            <li>
              <strong className="text-foreground block mb-1">{dictionary.serviceDetailPage.step4Title}</strong>
              {dictionary.serviceDetailPage.step4Details}
            </li>
          </ol>
          <p className="mt-6 text-sm italic">
            <Info className="inline h-4 w-4 mr-1.5 text-primary" />
            {dictionary.serviceDetailPage.proceduresNote}
          </p>
        </CardContent>
      </Card>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button asChild variant="outline" size="lg">
          <Link href={`/${locale}/services`}>
            <ChevronLeft className="mr-2 h-4 w-4" /> {dictionary.serviceDetailPage.allServicesButton}
          </Link>
        </Button>
      </div>
    </div>
  );
}
