
'use client';

import Link from 'next/link';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import UserAvatar from '@/components/shared/UserAvatar';
import type { Dictionary } from '@/lib/dictionary';
import { Menu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggleButton } from '@/components/shared/ThemeToggleButton';
import { useAuth } from '@/hooks/use-auth-store';
import { mockConversations } from '@/lib/mockMessagesData';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  dictionary: Pick<Dictionary, 'appName' | 'home' | 'services' | 'contact' | 'login' | 'signup' | 'logout' | 'profile' | 'settings' | 'dashboard' | 'adminDashboard' | 'professionalDashboard' | 'theme' | 'english' | 'french' | 'arabic' | 'messages'>;
  locale: string;
}

export default function Header({ dictionary, locale }: HeaderProps) {
  const navItems = [
    { href: `/${locale}`, label: dictionary.home },
    { href: `/${locale}/services`, label: dictionary.services },
    { href: `/${locale}/contact`, label: dictionary.contact },
  ];

  const languageSwitcherDictionary = {
    english: dictionary.english,
    french: dictionary.french,
    arabic: dictionary.arabic,
  };

  const { user, role } = useAuth();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user && role !== 'guest') {
      const simulatedTotalUnread = mockConversations.reduce((sum, conv) => {
        const isParticipant = conv.participants.some(p => p.id === user.id);
        return sum + (isParticipant ? conv.unreadCount : 0);
      }, 0);
      setTotalUnreadCount(simulatedTotalUnread);
    } else {
      setTotalUnreadCount(0);
    }
  }, [user, role, mounted]); 

  const messagesLinkHref = `/${locale}/messages`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
          <Image
            src="https://i.ibb.co/Nd6gPzC8/Whats-App-Image-2025-06-30-at-1-36-22-PM-removebg-preview.png"
            alt="thiq bi logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
          {mounted && role !== 'guest' && (
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href={messagesLinkHref}>
                <MessageSquare className="h-5 w-5" />
                {totalUnreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-[1rem] p-0.5 text-xs flex items-center justify-center rounded-full">
                    {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                  </Badge>
                )}
                <span className="sr-only">{dictionary.messages}</span>
              </Link>
            </Button>
          )}
          <ThemeToggleButton dictionary={dictionary.theme} />
          <LanguageSwitcher dictionary={languageSwitcherDictionary} />
          <div className="hidden md:block">
            <UserAvatar dictionary={dictionary} />
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2 mb-6">
                   <Image
                      src="https://i.ibb.co/Nd6gPzC8/Whats-App-Image-2025-06-30-at-1-36-22-PM-removebg-preview.png"
                      alt="thiq bi logo"
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                    />
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="transition-colors hover:text-primary text-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
                   {mounted && role !== 'guest' && (
                    <Link href={messagesLinkHref} className="transition-colors hover:text-primary text-lg flex items-center">
                      {dictionary.messages}
                      {totalUnreadCount > 0 && (
                         <Badge variant="destructive" className="ml-2 text-xs">
                           {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                         </Badge>
                       )}
                    </Link>
                  )}
                </nav>
                <div className="mt-6 pt-6 border-t">
                 <UserAvatar dictionary={dictionary} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
