
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth-store';
import { ensureConversationExists } from '@/lib/mockMessagesData';
import type { Dictionary } from '@/lib/dictionary';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/i18n-config';

interface ContactProfessionalButtonProps {
  professionalId: string;
  professionalName: string;
  professionalAvatarUrl?: string;
  dictionary: Dictionary['professionalProfilePage'];
  locale: Locale;
}

export default function ContactProfessionalButton({
  professionalId,
  professionalName,
  professionalAvatarUrl,
  dictionary,
  locale,
}: ContactProfessionalButtonProps) {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const handleContactClick = () => {
    if (!currentUser) {
      // Optionally, redirect to login or show a message
      router.push(`/${locale}/login?redirect=/professionals/${professionalId}`);
      return;
    }

    const conversationId = ensureConversationExists(
      professionalId,
      professionalName,
      professionalAvatarUrl,
      currentUser
    );
    router.push(`/${locale}/messages/${conversationId}`);
  };

  const professionalFirstName = professionalName.split(' ')[0];

  return (
    <Button
      onClick={handleContactClick}
      className="w-full md:w-auto" // Simplified styling
      variant="default" // Standard button appearance
      size="lg"
    >
      <MessageSquare className="mr-2 h-5 w-5" />
      {dictionary.contactButton.replace('{name}', professionalFirstName)}
    </Button>
  );
}
