
import type { Service as ServiceType, Dictionary } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n-config';

interface ServiceCardProps {
  service: ServiceType; // Changed to full ServiceType to access imageUrl
  dictionary: Dictionary['service'];
  locale: Locale;
}

export default function ServiceCard({ service, dictionary, locale }: ServiceCardProps) {
  const IconComponent = service.icon;
  const title = dictionary[service.titleKey]?.title || "Service Title";
  const description = dictionary[service.titleKey]?.description || "Service description.";
  const imageSrc = service.imageUrl || `https://placehold.co/600x350.png`;

  return (
    <Link href={`/${locale}/services/${service.id}`} className="block group">
      <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 bg-card">
        <CardHeader className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full group-hover:bg-primary/90 transition-colors duration-300">
              <IconComponent className="h-8 w-8" />
            </div>
            <CardTitle className="text-lg md:text-xl font-bold">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex-grow flex flex-col">
          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={service.dataAiHint}
            />
          </div>
          <CardDescription className="text-muted-foreground flex-grow">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
