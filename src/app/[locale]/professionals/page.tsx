
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { servicesList } from '@/lib/servicesData';
import { mockProfessionals } from '@/lib/professionalsData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, UserCircle } from 'lucide-react';
import type { ListedProfessional } from '@/types';
import StarRatingDisplay from '@/components/shared/StarRatingDisplay';

export default async function ProfessionalsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { serviceId?: string };
}) {
  const dictionary = await getDictionary(locale);
  const serviceId = searchParams?.serviceId;

  const currentService = serviceId ? servicesList.find(s => s.id === serviceId) : null;
  const serviceName = currentService 
    ? (dictionary.service[currentService.titleKey]?.title || serviceId) 
    : dictionary.professionalsPage.allProfessionalsSubTitle;

  const pageTitle = dictionary.professionalsPage.title;
  const pageSubTitle = currentService 
    ? dictionary.professionalsPage.subTitle.replace('{serviceName}', serviceName)
    : dictionary.professionalsPage.allProfessionalsSubTitle;

  let sortedProfessionals: ListedProfessional[];

  if (serviceId) {
    sortedProfessionals = [...mockProfessionals].sort((a, b) => {
      const aHasService = a.servicesOffered.includes(serviceId);
      const bHasService = b.servicesOffered.includes(serviceId);

      if (aHasService && !bHasService) return -1;
      if (!aHasService && bHasService) return 1;

      return b.rating - a.rating;
    });
  } else {
    sortedProfessionals = [...mockProfessionals].sort((a, b) => b.rating - a.rating);
  }
  
  const relevantProfessionals = sortedProfessionals;

  return (
    <div className="container py-10 animate-fade-in-up">
      <Card className="shadow-lg mb-12">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold">{pageTitle}</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground">
            {pageSubTitle}
          </CardDescription>
        </CardHeader>
      </Card>

      {relevantProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relevantProfessionals.map((prof: ListedProfessional, index: number) => (
            <div key={prof.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s`}}>
              <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center p-6">
                  <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2">
                    <AvatarImage src={prof.avatarUrl || `https://placehold.co/100x100.png`} alt={prof.name} data-ai-hint="professional avatar" />
                    <AvatarFallback>{prof.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-semibold">{prof.name}</CardTitle>
                  <CardDescription className="text-primary flex items-center mt-1">
                    <Briefcase className="h-4 w-4 mr-1.5" /> {prof.specialty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow px-6 pb-4 space-y-3">
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-medium mr-1.5">{dictionary.professionalsPage.rating}:</span>
                    <StarRatingDisplay rating={prof.rating} numberOfRatings={prof.numberOfRatings} size="sm" showRatingValue={true}/>
                  </div>
                  {prof.bio && <p className="text-sm text-muted-foreground text-center leading-relaxed line-clamp-3">{prof.bio}</p>}
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-1 text-center">{dictionary.professionalsPage.servicesOffered}:</h4>
                    {prof.servicesOffered.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        {prof.servicesOffered.map(offeredServiceId => {
                          const offeredService = servicesList.find(s => s.id === offeredServiceId);
                          const offeredServiceName = offeredService ? (dictionary.service[offeredService.titleKey]?.title || offeredServiceId) : offeredServiceId;
                          return (
                            <span key={offeredServiceId} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                              {offeredServiceName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                       <p className="text-xs text-muted-foreground text-center italic">{dictionary.professionalProfilePage.noServicesListed}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/${locale}/professionals/${prof.id}`}>
                      <UserCircle className="mr-2 h-4 w-4" /> {dictionary.professionalsPage.viewProfile}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-xl text-muted-foreground">{dictionary.professionalsPage.noProfessionalsFound}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
