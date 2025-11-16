
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import MessageView from '@/components/messages/MessageView';
import { mockConversations } from '@/lib/mockMessagesData'; // To generate static params

export async function generateStaticParams() {
  // For a real app, you might fetch actual conversation IDs
  // For now, use mock conversation IDs across all locales
  const locales: Locale[] = ['en', 'fr', 'ar']; // Or from i18n.locales
  const params: { locale: Locale; conversationId: string }[] = [];

  locales.forEach(locale => {
    mockConversations.forEach(conv => {
      params.push({ locale: locale, conversationId: conv.id });
    });
  });
  return params;
}


export default async function ConversationPage({
  params: { locale, conversationId },
}: {
  params: { locale: Locale; conversationId: string };
}) {
  const dictionary = await getDictionary(locale);

  return (
    <MessageView
      dictionary={{ ...dictionary.messagesPage, service: dictionary.service }}
      locale={locale}
      conversationId={conversationId}
    />
  );
}

    