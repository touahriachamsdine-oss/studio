
import type { Dictionary } from '@/lib/dictionary';
import ServiceCard from './ServiceCard';
import { servicesList } from '@/lib/servicesData';
import type { Locale } from '@/i18n-config';

interface ServiceSectionProps {
  dictionary: Pick<Dictionary, 'mainServicesTitle' | 'service'>;
  locale: Locale;
}

export default function ServiceSection({ dictionary, locale }: ServiceSectionProps) {
  return (
    <section className="py-12 md:py-20 bg-muted">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10 md:text-4xl">
          {dictionary.mainServicesTitle}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((service) => (
            <ServiceCard key={service.id} service={service} dictionary={dictionary.service} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
