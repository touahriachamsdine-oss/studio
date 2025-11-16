
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  dictionary: Pick<Dictionary, 'appName' | 'termsOfServicePage' | 'privacyPolicyPage'> & { footer: Dictionary['footer'] };
  locale: Locale;
}

export default function Footer({ dictionary, locale }: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Image
            src="https://i.ibb.co/Nd6gPzC8/Whats-App-Image-2025-06-30-at-1-36-22-PM-removebg-preview.png"
            alt="thiq bi logo"
            width={100}
            height={34}
            className="h-8 w-auto"
          />
          <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-2 text-center text-sm md:text-left">
            <p className="leading-loose">
              {dictionary.footer.copyRight.replace('{year}', currentYear.toString())}
            </p>
            <Link href={`/${locale}/terms-of-service`} className="leading-loose text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
              {dictionary.termsOfServicePage.title}
            </Link>
            <Link href={`/${locale}/privacy-policy`} className="leading-loose text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
              {dictionary.privacyPolicyPage.title}
            </Link>
          </div>
        </div>
        {/* Add social media links or other footer content here if needed */}
      </div>
    </footer>
  );
}
