import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { LayoutGrid, Calendar, Map, Route, Sparkles, Shield, BarChart, Users, LifeBuoy } from 'lucide-react';
import { getTranslation } from '@/app/i18n';
import { SidebarClient } from './sidebar-client';
import { Separator } from './ui/separator';

const topNavItems = [
  { href: '/', labelKey: 'home', icon: LayoutGrid },
  { href: '/calendar', labelKey: 'calendar', icon: Calendar },
  { href: '/map', labelKey: 'map', icon: Map },
  { href: '/guide', labelKey: 'touristGuide', icon: Route },
  { href: '/suggestions', labelKey: 'forYou', icon: Sparkles },
];

const bottomNavItems = [
    { href: '/admin', labelKey: 'admin', icon: Shield },
]

export async function Sidebar({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, 'common');

  return (
    <aside className="sticky top-0 h-screen w-64 bg-card text-card-foreground border-r transition-all duration-300 ease-in-out flex flex-col p-4">
       <div className="flex items-center gap-2 p-2 mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <h1 className="text-xl font-bold">Mustghanem</h1>
      </div>

        <nav className="flex flex-col items-start gap-1 flex-grow">
          {topNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'default' }),
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
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'default' }),
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
