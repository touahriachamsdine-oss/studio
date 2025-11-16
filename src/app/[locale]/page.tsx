
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import ServiceSection from '@/components/services/ServiceSection';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <>
      <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 opacity-5 overflow-hidden" data-ai-hint="abstract background pattern">
            {/* Subtle decorative elements can be added here later for more uniqueness */}
        </div>
        <div className="container relative text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
            <div className="flex justify-center animate-fade-in-up mb-4">
                <Image
                    src="https://i.ibb.co/Nd6gPzC8/Whats-App-Image-2025-06-30-at-1-36-22-PM-removebg-preview.png"
                    alt="thiq bi logo"
                    width={300}
                    height={100}
                    className="h-auto max-w-[80%]"
                    priority
                />
            </div>
            <span className="block text-foreground animate-fade-in-up-delay-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">{dictionary.tagline}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground sm:text-xl md:text-2xl animate-fade-in-up-delay-400">
            {dictionary.homePage.heroTaglineDetails}
          </p>
          <div className="mt-10 animate-fade-in-up-delay-400">
            <Link
              href={`/${locale}/services`}
              className="block w-full py-4 text-xl font-semibold text-center text-primary hover:text-accent border-t-2 border-b-2 border-primary/40 hover:border-primary/70 bg-[linear-gradient(135deg,hsl(var(--muted)/0.05)_25%,transparent_25%,transparent_50%,hsl(var(--muted)/0.05)_50%,hsl(var(--muted)/0.05)_75%,transparent_75%,transparent_100%)] bg-[length:4px_4px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-background focus:ring-primary/50"
            >
              {dictionary.services}
            </Link>
          </div>
        </div>
      </section>
      <div className="animate-fade-in-delay-200">
        <ServiceSection dictionary={{ mainServicesTitle: dictionary.mainServicesTitle, service: dictionary.service }} locale={locale} />
      </div>

      <section className="py-12 md:py-20 animate-fade-in-delay-400 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 md:text-4xl">{dictionary.homePage.aboutSectionTitle}</h2>
              <p className="text-lg text-foreground/90 mb-4">
                {dictionary.homePage.aboutSectionText1}
              </p>
              <p className="text-lg text-foreground/90">
                {dictionary.homePage.aboutSectionText2}
              </p>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1589994965851-a8f479c573a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxsYXd8ZW58MHx8fHwxNzQ4Njk1MDU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt={dictionary.homePage.aboutSectionTitle}
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="legal team discussion"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
