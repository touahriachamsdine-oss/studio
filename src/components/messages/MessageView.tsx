
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionary';
import { 
  getMockMessagesForConversation, 
  getMockConversationById, 
  addMessageToConversation, 
  markMessagesAsSeen,
  updateMessageInConversation,
  getProfessionalById,
  getServiceById
} from '@/lib/mockMessagesData';
import type { Message as MessageType, Conversation, MessageParticipant, ServiceRequestDetails, FileUploadDetails, UserRole } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ArrowLeft, Check, CheckCheck, Paperclip, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth-store';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageViewProps {
  dictionary: Dictionary['messagesPage'] & { service: Dictionary['service'] };
  locale: Locale;
  conversationId: string;
}

export default function MessageView({ dictionary, locale, conversationId }: MessageViewProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user: currentUser } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentServiceRequestToUpload, setCurrentServiceRequestToUpload] = useState<ServiceRequestDetails | null>(null);


  const professionalInChat = useMemo(() => {
    if (!conversation || !currentUser) return null;
    return conversation.participants.find(p => p.id !== currentUser.id && p.role === 'professional');
  }, [conversation, currentUser]);

  const professionalDetails = useMemo(() => {
    if (!professionalInChat) return null;
    return getProfessionalById(professionalInChat.id);
  }, [professionalInChat]);

  const professionalServices = useMemo(() => {
    if (!professionalDetails || !professionalDetails.servicesOffered) return [];
    return professionalDetails.servicesOffered.map(serviceId => {
      const serviceInfo = getServiceById(serviceId);
      if (!serviceInfo) return null;
      const serviceName = dictionary.service[serviceInfo.titleKey]?.title || serviceInfo.id;
      return { id: serviceInfo.id, name: serviceName };
    }).filter(Boolean) as { id: string; name: string }[];
  }, [professionalDetails, dictionary.service]);


  const refreshMessages = () => {
    if (currentUser && conversation) {
      markMessagesAsSeen(conversation.id, currentUser.id);
      setMessages([...getMockMessagesForConversation(conversation.id, currentUser.id)]);
    }
  };
  
  useEffect(() => {
    if (currentUser) {
      const fetchedConversation = getMockConversationById(conversationId);
      if (fetchedConversation) {
        setConversation(fetchedConversation);
        markMessagesAsSeen(conversationId, currentUser.id);
        setMessages([...getMockMessagesForConversation(conversationId, currentUser.id)]);
      } else {
        setConversation(null);
        setMessages([]);
      }
    }
  }, [conversationId, currentUser]);

 useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (customMessage?: Partial<MessageType>) => {
    if ((!newMessage.trim() && !customMessage?.text && !customMessage?.fileUploadDetails && !customMessage?.serviceRequestDetails && !customMessage?.serviceResponseDetails) || !currentUser || !conversation) return;

    const baseMessage: MessageType = {
      id: `msg-new-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId: conversation.id,
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date(),
      read: true, 
      seen: false, 
      messageType: 'text',
      ...(customMessage || {}), // Allows sending specialized messages
    };

    addMessageToConversation(conversation.id, baseMessage);
    refreshMessages();
    setNewMessage(''); // Clear input only for text messages
  };

  const handleRequestService = (serviceId: string, serviceName: string) => {
    if (!currentUser) return;
    const serviceRequestDetails: ServiceRequestDetails = {
      serviceId,
      serviceName,
      status: 'pending',
      requesterId: currentUser.id,
    };
    handleSendMessage({
      text: dictionary.serviceRequestMessageDefault.replace('{serviceName}', serviceName),
      messageType: 'service_request',
      serviceRequestDetails,
    });
    // toast({ title: dictionary.serviceRequestSent.replace('{serviceName}', serviceName) });
  };

  const handleServiceRequestResponse = (originalMessage: MessageType, response: 'accepted' | 'declined') => {
    if (!currentUser || !originalMessage.serviceRequestDetails) return;

    updateMessageInConversation(originalMessage.conversationId, originalMessage.id, {
      serviceRequestDetails: { ...originalMessage.serviceRequestDetails, status: response },
    });
    
    const serviceName = originalMessage.serviceRequestDetails.serviceName;
    const responseText = response === 'accepted' 
      ? dictionary.professionalAcceptedRequestMessage.replace('{serviceName}', serviceName)
      : dictionary.professionalDeclinedRequestMessage.replace('{serviceName}', serviceName);

    handleSendMessage({
      text: responseText,
      messageType: 'service_response',
      serviceResponseDetails: {
        originalRequestId: originalMessage.id,
        serviceName: originalMessage.serviceRequestDetails.serviceName,
        responseStatus: response,
      },
    });
    refreshMessages();
  };

  const handleUploadFilesClick = (serviceDetails: ServiceRequestDetails) => {
    setCurrentServiceRequestToUpload(serviceDetails);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && currentServiceRequestToUpload) {
      const fileNames = Array.from(event.target.files).map(f => f.name);
      const fileUploadDetails: FileUploadDetails = {
        // originalRequestId: currentServiceRequestToUpload.originalRequestId, // Assuming SRD has originalRequestId
        serviceName: currentServiceRequestToUpload.serviceName,
        fileNames,
      };
      handleSendMessage({
        text: dictionary.filesUploadedMessage.replace('{serviceName}', currentServiceRequestToUpload.serviceName).replace('{fileNames}', fileNames.join(', ')),
        messageType: 'file_upload',
        fileUploadDetails,
      });
    }
    setCurrentServiceRequestToUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };


  if (!currentUser) {
    return <div className="p-4">Loading user...</div>;
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
         <Link href={`/${locale}/messages`} className="md:hidden absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <p className="text-muted-foreground">{dictionary.noMessagesInConversation}</p>
      </div>
    );
  }

  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  const contactName = otherParticipant?.name || "Unknown User";

  return (
    <div className="flex flex-1 flex-col h-full">
       <div className="flex items-center p-4 border-b bg-muted/20">
         <Link href={`/${locale}/messages`} className="md:hidden mr-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={otherParticipant?.avatarUrl || `https://placehold.co/40x40.png`} alt={contactName} data-ai-hint="contact avatar" />
          <AvatarFallback>{contactName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{dictionary.viewingMessagesWith.replace('{name}', contactName)}</h2>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRef}>
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground">{dictionary.noMessagesInConversation}</p>
        )}
        {messages.map((msg) => {
          const isSender = msg.senderId === currentUser.id;
          const senderDetails = conversation.participants.find(p => p.id === msg.senderId);
          const senderName = senderDetails?.name?.split(' ')[0] || 'User';
          const senderAvatarText = senderDetails?.name?.substring(0,2).toUpperCase() || 'U';
          const messageTime = new Date(msg.timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={msg.id}
              className={cn("flex items-end gap-2 group mb-4", isSender ? "justify-end" : "justify-start")}
            >
              {!isSender && (
                <Avatar className="h-8 w-8 self-end">
                  <AvatarImage src={senderDetails?.avatarUrl || `https://placehold.co/32x32.png`} alt={senderName} data-ai-hint="sender avatar" />
                  <AvatarFallback>{senderAvatarText}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] p-3 rounded-xl shadow-sm flex flex-col",
                  isSender
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                
                {/* Service Request Specific UI */}
                {msg.messageType === 'service_request' && msg.serviceRequestDetails && (
                  <div className="mt-2 pt-2 border-t border-muted-foreground/30">
                    <p className="text-xs font-semibold mb-1">
                      {msg.serviceRequestDetails.status === 'pending' && dictionary.serviceRequestStatusPending.replace('{serviceName}', msg.serviceRequestDetails.serviceName)}
                      {msg.serviceRequestDetails.status === 'accepted' && dictionary.serviceRequestStatusAccepted.replace('{serviceName}', msg.serviceRequestDetails.serviceName)}
                      {msg.serviceRequestDetails.status === 'declined' && dictionary.serviceRequestStatusDeclined.replace('{serviceName}', msg.serviceRequestDetails.serviceName)}
                    </p>
                    {/* Action buttons for Professional */}
                    {msg.serviceRequestDetails.status === 'pending' && professionalInChat?.id === currentUser.id && msg.senderId !== currentUser.id && (
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" variant="secondary" onClick={() => handleServiceRequestResponse(msg, 'accepted')}>
                          {dictionary.acceptRequest}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleServiceRequestResponse(msg, 'declined')}>
                          {dictionary.declineRequest}
                        </Button>
                      </div>
                    )}
                    {/* Upload button for User if accepted */}
                    {msg.serviceRequestDetails.status === 'accepted' && msg.serviceRequestDetails.requesterId === currentUser.id && (
                       <Button size="sm" className="mt-1" onClick={() => handleUploadFilesClick(msg.serviceRequestDetails!)}>
                         <UploadCloud className="mr-2 h-4 w-4" />
                         {dictionary.uploadFiles.replace('{serviceName}', msg.serviceRequestDetails.serviceName)}
                       </Button>
                    )}
                  </div>
                )}
                
                {/* File Upload Specific UI */}
                {msg.messageType === 'file_upload' && msg.fileUploadDetails && (
                    <p className="text-xs italic mt-1 text-muted-foreground/80">
                        {dictionary.filesUploadedNotice
                            .replace('{serviceName}', msg.fileUploadDetails.serviceName)
                            .replace('{fileNames}', msg.fileUploadDetails.fileNames.join(', '))}
                    </p>
                )}

                <div className={cn("text-xs mt-1 flex items-center gap-1", isSender ? "text-primary-foreground/70 self-end" : "text-muted-foreground/70 self-start")}>
                  <span>{messageTime}</span>
                  {isSender && (
                    <>
                      <span className="mx-0.5">·</span>
                      {msg.seen ? (
                        <>
                          <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                          <span className="sr-only sm:not-sr-only">{dictionary.seenStatus}</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                           <span className="sr-only sm:not-sr-only">{dictionary.deliveredStatus}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
               {isSender && (
                <Avatar className="h-8 w-8 self-end">
                   <AvatarImage src={senderDetails?.avatarUrl || `https://placehold.co/32x32.png`} alt={senderName} data-ai-hint="sender avatar" />
                  <AvatarFallback>{senderAvatarText}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="border-t p-4 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage({messageType: 'text'});
          }}
          className="flex items-center gap-2"
        >
          {professionalInChat && professionalServices && professionalServices.length > 0 && currentUser?.role !== 'professional' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" type="button" aria-label={dictionary.requestService}>
                  <Paperclip className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 mb-2">
                <div className="p-2 space-y-1">
                  <p className="text-sm font-medium px-2 py-1">{dictionary.selectServiceToRequest}</p>
                  {professionalServices.length > 0 ? professionalServices.map(service => (
                    <Button
                      key={service.id}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => handleRequestService(service.id, service.name)}
                    >
                      {service.name}
                    </Button>
                  )) : (
                    <p className="text-xs text-muted-foreground px-2 py-1">{dictionary.noServicesOfferedByProfessional}</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={dictionary.newMessagePlaceholder}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">{dictionary.sendButton}</span>
          </Button>
        </form>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          onChange={handleFileSelected} 
        />
      </div>
    </div>
  );
}

