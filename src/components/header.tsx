
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { topNavItems, bottomNavItems } from '@/lib/nav-data';
import { getTranslation } from '@/app/i18n';
import { Separator } from './ui/separator';
import { SidebarClient } from './sidebar-client';
import { cn } from '@/lib/utils';


async function getPageTitle(pathname: string, locale: string): Promise<string> {
    const { t } = await getTranslation(locale, 'common');
    const currentPath = pathname.substring(pathname.indexOf('/', 1)); // Remove locale
    const navItem = topNavItems.find(item => item.href === currentPath);
    if (navItem) {
        return t(navItem.labelKey);
    }
    if (currentPath.startsWith('/admin')) return t('admin');
    return 'Mustghanem';
}


export function Header({ locale }: { locale: string }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = React.useState('Mustghanem');
  const [translations, setTranslations] = React.useState<any>({});
  const [navTranslations, setNavTranslations] = React.useState<any>({});

  React.useEffect(() => {
    async function fetchTitle() {
        const title = await getPageTitle(pathname, locale);
        setPageTitle(title);
    }
    async function fetchTranslations() {
        const { t } = await getTranslation(locale, 'common');
        setTranslations({
            settings: t('settings'),
            manage_settings: t('manage_settings'),
            language: t('language'),
            push_notifications: t('push_notifications'),
        });
        const navs: any = {};
        for(const item of topNavItems) {
            navs[item.labelKey] = t(item.labelKey);
        }
        for(const item of bottomNavItems) {
            navs[item.labelKey] = t(item.labelKey);
        }
        setNavTranslations(navs);

    }
    fetchTitle();
    fetchTranslations();
  }, [pathname, locale]);
  
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/50 backdrop-blur-lg px-4 sm:gap-x-6 sm:px-6 lg:hidden">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ms-2.5">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
             <aside className={cn("sticky top-0 h-screen w-full bg-card text-card-foreground border-r transition-all duration-300 ease-in-out flex-col p-4 flex")}>
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Main navigation links and application settings.</SheetDescription>
                </SheetHeader>
                <div className="flex items-center gap-3 p-2 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    </div>
                <h1 className="text-xl font-bold">Mustghanem</h1>
            </div>

            <nav className="flex flex-col items-start gap-2 flex-grow">
                {topNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={`/${locale}${item.href}`}
                        className={cn(
                        buttonVariants({ variant: 'ghost', size: 'lg' }),
                        'w-full justify-start text-base'
                        )}
                        onClick={() => setIsSheetOpen(false)}
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {navTranslations[item.labelKey]}
                    </Link>
                    )
                )}
            </nav>
        
        <div className="flex flex-col items-start gap-1">
            <Separator className="my-2"/>
             {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'w-full justify-start text-base'
                )}
                onClick={() => setIsSheetOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {navTranslations[item.labelKey]}
              </Link>
            ))}
            {Object.keys(translations).length > 0 && <SidebarClient locale={locale} translations={translations} />}
        </div>

    </aside>
        </SheetContent>
      </Sheet>

      <div className="flex-1 text-lg font-bold">{pageTitle}</div>

    </header>
  );
}
