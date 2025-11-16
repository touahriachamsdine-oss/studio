
'use client';

import { use, useEffect, useState } from 'react'; // Added 'use'
import { getDictionary } from '@/lib/dictionary';
import { i18n, type Locale } from '@/i18n-config';
import { getProfessionalById, updateProfessionalRating } from '@/lib/professionalsData';
import { servicesList } from '@/lib/servicesData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Briefcase, Info, ChevronLeft, Settings2 } from 'lucide-react';
import Link from 'next/link';
import ContactProfessionalButton from '@/components/professionals/ContactProfessionalButton';
import { Badge } from '@/components/ui/badge';
import StarRatingDisplay from '@/components/shared/StarRatingDisplay';
import RateProfessionalSection from '@/components/professionals/RateProfessionalSection';
import type { Dictionary } from '@/lib/dictionary';
import type { ListedProfessional } from '@/types';

export default function ProfessionalProfilePage({
  params: paramsPromise // Renamed to paramsPromise for clarity
}: {
  params: Promise<{ locale: Locale, professionalId: string }> // Typed as a Promise
}) {
  const { locale, professionalId } = use(paramsPromise); // Unwrap the promise using React.use()

  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [professional, setProfessional] = useState<ListedProfessional | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    getDictionary(locale).then(setDictionary);
  }, [locale]);

  useEffect(() => {
    const profData = getProfessionalById(professionalId);
    setProfessional(profData);
  }, [professionalId]);

  const handleRatingSubmitted = (updatedProfessional: ListedProfessional) => {
    setProfessional(updatedProfessional);
  };

  if (!dictionary || professional === undefined) {
    return (
      <div className="container py-10 text-center animate-fade-in-up">
        <p>Loading professional profile...</p>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="container py-10 text-center animate-fade-in-up">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">{dictionary.professionalProfilePage.professionalNotFound}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{dictionary.professionalProfilePage.professionalNotFound}</p>
            <Button asChild className="mt-6">
              <Link href={`/${locale}/professionals`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> {dictionary.professionalProfilePage.backToProfessionals}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getServiceName = (serviceId: string) => {
    const service = servicesList.find(s => s.id === serviceId);
    return service && dictionary.service[service.titleKey] ? dictionary.service[service.titleKey]?.title : serviceId;
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto animate-fade-in-up">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-muted p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 ring-4 ring-primary ring-offset-4 ring-offset-muted">
              <AvatarImage src={professional.avatarUrl || `https://placehold.co/128x128.png`} alt={professional.name} data-ai-hint="professional avatar" />
              <AvatarFallback className="text-4xl">{professional.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl sm:text-4xl font-bold">{professional.name}</CardTitle>
              <CardDescription className="text-lg text-primary flex items-center justify-center md:justify-start mt-1">
                <Briefcase className="mr-2 h-5 w-5" /> {professional.specialty}
              </CardDescription>
              <div className="mt-2 flex justify-center md:justify-start">
                <StarRatingDisplay rating={professional.rating} numberOfRatings={professional.numberOfRatings} size="lg" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-8">
          {professional.bio && (
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center">
                <Info className="mr-2 h-6 w-6 text-primary" />
                {dictionary.professionalProfilePage.aboutTitle.replace('{name}', professional.name.split(' ')[0])}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{professional.bio}</p>
            </section>
          )}

          <Separator />

          {professional.specializations && professional.specializations.length > 0 && (
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center">
                 <Settings2 className="mr-2 h-6 w-6 text-primary" />
                {dictionary.profilePage.specializationsLabel}
              </h2>
              <div className="flex flex-wrap gap-2">
                {professional.specializations.map(specKey => (
                  <Badge key={specKey} variant="secondary" className="text-sm">
                    {dictionary.form.professionalSpecializations[specKey as keyof typeof dictionary.form.professionalSpecializations] || specKey}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-primary" />
              {dictionary.professionalProfilePage.servicesProvidedTitle}
            </h2>
            {professional.servicesOffered && professional.servicesOffered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professional.servicesOffered.map(serviceId => {
                  const service = servicesList.find(s => s.id === serviceId);
                  const ServiceIcon = service?.icon || UserCircle;
                  return (
                    <Link key={serviceId} href={`/${locale}/services/${serviceId}`} className="block">
                      <Card className="h-full hover:shadow-md transition-shadow bg-secondary/30 hover:bg-secondary/60">
                        <CardContent className="p-4 flex items-center gap-3">
                          <ServiceIcon className="h-6 w-6 text-primary" />
                          <span className="font-medium">{getServiceName(serviceId)}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">{dictionary.professionalProfilePage.noServicesListed}</p>
            )}
          </section>

          <Separator />

          <div className="text-center pt-4">
            <ContactProfessionalButton
              professionalId={professional.id}
              professionalName={professional.name}
              professionalAvatarUrl={professional.avatarUrl}
              dictionary={dictionary.professionalProfilePage}
              locale={locale}
            />
          </div>

          <Separator />

          <RateProfessionalSection
            professionalId={professional.id}
            professionalName={professional.name}
            dictionary={dictionary.professionalProfilePage}
            onRatingSubmitted={handleRatingSubmitted}
          />

        </CardContent>
        <CardFooter className="p-6 bg-muted">
            <Button asChild variant="outline">
              <Link href={`/${locale}/professionals${professional.servicesOffered && professional.servicesOffered.length > 0 ? `?serviceId=${professional.servicesOffered[0]}`: '' }`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> {dictionary.professionalProfilePage.backToProfessionals}
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
