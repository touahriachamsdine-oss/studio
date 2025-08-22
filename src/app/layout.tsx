
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Funder Mustghanem',
  description: 'Your guide to events and culture in Mostaganem.',
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
