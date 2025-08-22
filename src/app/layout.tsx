import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/sidebar';
import { Providers } from '@/components/ui/providers';
import { Poppins } from 'next/font/google';
import { Header } from '@/components/header';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Funder Mustghanem',
  description: 'Your guide to events and culture in Mostaganem.',
};

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={poppins.variable}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body className={cn('font-sans antialiased', 'bg-background text-foreground')}>
        <Providers>
          <div className="relative flex min-h-screen">
            <Sidebar locale={locale || 'fr'} className="hidden lg:flex" />
            <div className="flex-1 flex flex-col">
              <Header locale={locale || 'fr'} />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
