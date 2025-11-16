
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { MessageSquareText, Info } from 'lucide-react';
import ConversationListMobile from '@/components/messages/ConversationListMobile';


export default async function MessagesPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <>
      {/* Mobile only: Show conversation list first */}
      <div className="md:hidden flex flex-col h-full">
         <div className="p-4 border-b">
            <h1 className="text-lg sm:text-xl font-semibold">{dictionary.messagesPage.conversationsTitle}</h1>
          </div>
        <ConversationListMobile dictionary={dictionary.messagesPage} locale={locale} />
      </div>

      {/* Desktop: Show prompt if no conversation is selected via URL */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center h-full bg-background p-6 text-center">
        <MessageSquareText className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {dictionary.messagesPage.title}
        </h2>
        <p className="text-muted-foreground">
          {dictionary.messagesPage.selectConversationPrompt}
        </p>
      </div>
    </>
  );
}

    