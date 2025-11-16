
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConversationList from '@/components/messages/ConversationList';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function MessagesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dictionary = await getDictionary(locale);

  return (
    <div className="container mx-auto py-6 lg:py-10 animate-fade-in-up">
      <Card className="shadow-lg overflow-hidden h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
        <div className="flex h-full">
          {/* Sidebar for Conversations */}
          <div className="hidden md:flex flex-col w-full md:w-1/3 lg:w-1/4 border-r border-border bg-muted/40">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-lg sm:text-xl">{dictionary.messagesPage.conversationsTitle}</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <ConversationList dictionary={dictionary.messagesPage} locale={locale} />
            </ScrollArea>
          </div>

          {/* Main content area for selected conversation */}
          <div className="flex-1 flex flex-col h-full">
            {children}
          </div>
        </div>
      </Card>
    </div>
  );
}

    