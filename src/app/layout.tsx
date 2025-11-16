import type { Metadata } from 'next';
import { Lora, Inter, Tajawal } from 'next/font/google'; // Added Tajawal
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/components/shared/Providers';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'thiq bi',
  description: 'Your Partner in Trust',
  manifest: '/manifest.json', // Link to the manifest file
};

// Configure Lora font for headings
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora', 
  display: 'swap',
  weight: ['400', '500', '600', '700'], 
});

// Configure Inter font for body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
  display: 'swap',
});

// Configure Tajawal font for Arabic text
const tajawal = Tajawal({
  subsets: ['arabic'],
  variable: '--font-tajawal',
  display: 'swap',
  weight: ['400', '500', '700'], // Include necessary weights
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font variables to the html tag
    <html lang="en" suppressHydrationWarning className={`${lora.variable} ${inter.variable} ${tajawal.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/images/logo-192.png" />
      </head>
      {/* Apply body font class (defined in globals.css) */}
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 -z-10">
            <Image
              src="https://i.ibb.co/7xPzs4nz/lexconnect-hero-background.jpg" 
              alt="Abstract blurred background for thiq bi"
              fill
              style={{ objectFit: 'cover' }}
              className="blur-sm" 
              data-ai-hint="abstract legal background"
              priority // Preload background image
            />
            {/* Overlay to reduce brightness */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
