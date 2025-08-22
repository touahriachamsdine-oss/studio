
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { topNavItems } from '@/lib/nav-data';
import { getTranslation } from '@/app/i18n';

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

  React.useEffect(() => {
    async function fetchTitle() {
        const title = await getPageTitle(pathname, locale);
        setPageTitle(title);
    }
    fetchTitle();
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
          <Sidebar locale={locale} className="flex" />
        </SheetContent>
      </Sheet>

      <div className="flex-1 text-lg font-bold">{pageTitle}</div>

    </header>
  );
}
