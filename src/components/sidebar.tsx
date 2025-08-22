import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { topNavItems, bottomNavItems } from '@/lib/nav-data';
import { getTranslation } from '@/app/i18n';
import { SidebarClient } from './sidebar-client';
import { Separator } from './ui/separator';

export async function Sidebar({ locale, className }: { locale: string, className?: string }) {
  const { t } = await getTranslation(locale, 'common');

  return (
    <aside className={cn("sticky top-0 h-screen w-72 bg-card text-card-foreground border-r transition-all duration-300 ease-in-out flex-col p-4", className)}>
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
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(item.labelKey)}
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
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            ))}
            <SidebarClient locale={locale} translations={{
                settings: t('settings'),
                manage_settings: t('manage_settings'),
                language: t('language'),
                push_notifications: t('push_notifications'),
            }} />
        </div>

    </aside>
  );
}
