
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionary';
import { mockConversations } from '@/lib/mockMessagesData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth-store'; 

interface ConversationListProps {
  dictionary: Dictionary['messagesPage'];
  locale: Locale;
}

export default function ConversationList({ dictionary, locale }: ConversationListProps) {
  const pathname = usePathname();
  const { user: currentUser } = useAuth(); 

  if (!currentUser) {
    return <div className="p-4 text-sm text-muted-foreground">{dictionary.noConversations}</div>; 
  }

  const userConversations = mockConversations.filter(conv => 
    conv.participants.some(p => p.id === currentUser.id)
  );

  if (userConversations.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">{dictionary.noConversations}</div>;
  }

  return (
    <nav className="flex flex-col gap-1 p-2">
      {userConversations.map((conv) => {
        const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
        if (!otherParticipant) return null; 

        const isActive = pathname === `/${locale}/messages/${conv.id}`;
        const contactName = otherParticipant.name || 'Unknown User';
        const avatarText = contactName.substring(0, 2).toUpperCase();

        // Determine unread count specific to the currentUser
        // The global conv.unreadCount might be for the other user.
        // For this prototype, if last message is not from current user and not seen by current user, it's unread.
        // A more robust system would have unread counts per user per conversation.
        // For now, we'll use conv.unreadCount but with the understanding it's a simplification for the prototype.
        // The `markMessagesAsSeen` in `MessageView` handles clearing it correctly for the current viewer.
        const displayUnreadCount = (conv.lastMessage.senderId !== currentUser.id && !conv.lastMessage.seen) ? conv.unreadCount : 0;


        return (
          <Link
            key={conv.id}
            href={`/${locale}/messages/${conv.id}`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParticipant.avatarUrl || `https://placehold.co/40x40.png`} alt={contactName} data-ai-hint="contact avatar" />
              <AvatarFallback>{avatarText}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className={cn("font-medium", isActive ? "text-primary-foreground" : "text-foreground")}>{contactName}</p>
              <p className={cn("text-xs truncate", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {conv.lastMessage.text}
              </p>
            </div>
            {displayUnreadCount > 0 && !isActive && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {displayUnreadCount}
              </Badge>
            )}
             <span className={cn("text-xs ml-auto", isActive ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                {new Date(conv.lastMessage.timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
