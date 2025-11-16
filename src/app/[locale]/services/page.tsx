
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import ServiceSection from '@/components/services/ServiceSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, MessageCircle, ShieldQuestion } from 'lucide-react';

interface AdditionalServiceItemProps {
  title: string;
  text: string;
  icon: React.ElementType;
  imageSrc?: string;
  imageAlt?: string;
  imageHint?: string;
  imageOrder?: 'first' | 'last';
}

const AdditionalServiceItem = ({ title, text, icon: Icon, imageSrc, imageAlt, imageHint, imageOrder = 'first' }: AdditionalServiceItemProps) => {
  const hasImage = imageSrc && imageAlt;

  return (
    <div className={`grid ${hasImage ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-8 items-center py-6`}>
      {hasImage && (
        <div className={imageOrder === 'last' ? 'md:order-last' : ''}>
          <Image
            src={imageSrc}
            alt={imageAlt!}
            width={500}
            height={300}
            className="rounded-lg shadow-md object-cover w-full h-auto"
            data-ai-hint={imageHint}
          />
        </div>
      )}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
          <Icon className="mr-3 h-6 w-6 text-primary" />
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};


export default async function ServicesPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  const additionalServices = [
    {
      title: dictionary.servicesPage.secureDocumentManagementTitle,
      text: dictionary.servicesPage.secureDocumentManagementText,
      icon: CheckCircle,
    },
    {
      title: dictionary.servicesPage.directMessagingTitle,
      text: dictionary.servicesPage.directMessagingText,
      icon: MessageCircle,
    },
    {
      title: dictionary.servicesPage.faqResourceCenterTitle,
      text: dictionary.servicesPage.faqResourceCenterText,
      icon: ShieldQuestion,
    },
  ];

  return (
    <div className="container py-10 animate-fade-in-up">
      <Card className="shadow-lg mb-12">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold">{dictionary.services}</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground">
            {dictionary.servicesPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceSection dictionary={{ mainServicesTitle: dictionary.mainServicesTitle, service: dictionary.service }} locale={locale} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-semibold">{dictionary.servicesPage.additionalServicesTitle}</CardTitle>
          <CardDescription>
            {dictionary.servicesPage.additionalServicesDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 divide-y divide-border">
          {additionalServices.map((item, index) => (
            <AdditionalServiceItem
              key={index}
              title={item.title}
              text={item.text}
              icon={item.icon}
            />
          ))}
          <div className="text-center pt-10">
            <p className="text-lg text-muted-foreground mb-4">{dictionary.servicesPage.getStartedPrompt}</p>
            <Button size="lg" asChild>
              <Link href={`/${locale}/contact`}>{dictionary.contact}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

