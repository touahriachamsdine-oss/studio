
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/i18n-config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import type { Dictionary } from '@/lib/dictionary';

interface LanguageSwitcherProps {
  dictionary: Pick<Dictionary, 'english' | 'french' | 'arabic'>;
}

export default function LanguageSwitcher({ dictionary }: LanguageSwitcherProps) {
  const pathName = usePathname();
  const router = useRouter();

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const currentLocale = pathName.split('/')[1] as Locale;

  const languageNames: Record<Locale, string> = {
    en: dictionary.english,
    fr: dictionary.french,
    ar: dictionary.arabic,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => router.push(redirectedPathName(locale))}
            disabled={currentLocale === locale}
          >
            {languageNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
