
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid, Calendar, Map, Route, Sparkles, Shield } from 'lucide-react';
import { getTranslation } from '@/app/i18n';
import { SidebarClient } from './sidebar-client';

const navItems = [
  { href: '/', labelKey: 'home', icon: LayoutGrid },
  { href: '/calendar', labelKey: 'calendar', icon: Calendar },
  { href: '/map', labelKey: 'map', icon: Map },
  { href: '/guide', labelKey: 'touristGuide', icon: Route },
  { href: '/suggestions', labelKey: 'forYou', icon: Sparkles },
  { href: '/admin', labelKey: 'admin', icon: Shield },
];

export async function Sidebar({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, 'common');

  return (
    <aside className="sticky top-0 h-screen w-16 bg-card text-card-foreground border-e transition-all duration-300 ease-in-out flex flex-col items-center py-4 shadow-md">
       <div className="p-2 mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-col items-center gap-2 flex-grow">
          {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'h-10 w-10',
                      'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{t(item.labelKey)}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left" align="center">
                  {t(item.labelKey)}
                </TooltipContent>
              </Tooltip>
            )
          )}
        </nav>
        <div className="flex flex-col items-center gap-2 mt-auto">
            <SidebarClient locale={locale} translations={{
                settings: t('settings'),
                manage_settings: t('manage_settings'),
                language: t('language'),
                push_notifications: t('push_notifications'),
            }} />
        </div>
      </TooltipProvider>
    </aside>
  );
}
