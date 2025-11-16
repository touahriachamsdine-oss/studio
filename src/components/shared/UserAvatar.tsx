
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth-store';
import type { Dictionary } from '@/lib/dictionary';
import { LogIn, LogOut, UserCircle, Settings, LayoutDashboard, ShieldCheck, Briefcase, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { mockConversations } from '@/lib/mockMessagesData';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface UserAvatarProps {
  dictionary: Pick<Dictionary, 'login' | 'signup' | 'logout' | 'profile' | 'settings' | 'dashboard' | 'adminDashboard' | 'professionalDashboard' | 'messages'>;
}

export default function UserAvatar({ dictionary }: UserAvatarProps) {
  const { user, role, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
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

  if (!mounted || isLoading) {
    // Render a placeholder that matches the structure of login/signup buttons
    // to minimize layout shifts during hydration.
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-[70px] rounded-md bg-muted animate-pulse" /> 
        <div className="h-10 w-[80px] rounded-md bg-muted animate-pulse" />
      </div>
    );
  }

  if (role === 'guest' || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href={`/${locale}/login`}>{dictionary.login}</Link>
        </Button>
        <Button asChild>
          <Link href={`/${locale}/signup`}>{dictionary.signup}</Link>
        </Button>
      </div>
    );
  }

  const messagesLinkHref = `/${locale}/messages`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl || `https://placehold.co/40x40.png?text=${user.name?.[0]?.toUpperCase() || 'U'}`} alt={user.name || 'User'} />
            <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/admin`}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>{dictionary.adminDashboard}</span>
            </Link>
          </DropdownMenuItem>
        )}
        {role === 'professional' && (
           <DropdownMenuItem asChild>
           <Link href={`/${locale}/professional-dashboard`}>
             <Briefcase className="mr-2 h-4 w-4" />
             <span>{dictionary.professionalDashboard}</span>
           </Link>
         </DropdownMenuItem>
        )}
        {role === 'user' && (
           <DropdownMenuItem asChild>
           <Link href={`/${locale}/dashboard`}>
             <LayoutDashboard className="mr-2 h-4 w-4" />
             <span>{dictionary.dashboard}</span>
           </Link>
         </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={messagesLinkHref} className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>{dictionary.messages}</span>
            </div>
            {totalUnreadCount > 0 && (
              <Badge variant="default" className="h-5 px-1.5 text-xs">
                {totalUnreadCount}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`}>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>{dictionary.profile}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/settings`}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{dictionary.settings}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{dictionary.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
