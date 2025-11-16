
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { thiqbiChat, type ChatbotInput, type ChatbotOutput } from '@/ai/flows/chatbot-flow';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionary';
import { cn } from '@/lib/utils';

interface ChatbotWidgetProps {
  locale: Locale;
  dictionary: Dictionary['chatbot'];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ChatbotWidget({ locale, dictionary }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: `bot-welcome-${Date.now()}`,
          sender: 'bot',
          text: dictionary.welcomeMessage || "Hello! How can I help you with thiq bi today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, dictionary.welcomeMessage, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyForAI = messages.slice(-6).map(msg => ({ // Send last 3 pairs of user/model messages
        [msg.sender === 'user' ? 'user' : 'model']: msg.text
      })).reduce((acc, val) => { // Ensure structure is [{user: "", model: ""}, ...]
          if (val.user) {
              acc.push({user: val.user});
          } else if (val.model && acc.length > 0) {
              const lastEntry = acc[acc.length-1];
              if (lastEntry.user && !lastEntry.model) {
                  lastEntry.model = val.model;
              } else {
                 acc.push({model: val.model}); // Bot started or consecutive bot messages
              }
          } else if (val.model) { // Bot started conversation
             acc.push({model: val.model});
          }
          return acc;
      }, [] as {user?: string; model?: string}[]);


      const input: ChatbotInput = { query: userMessage.text, locale, history: historyForAI };
      const result: ChatbotOutput = await thiqbiChat(input);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.response,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: dictionary.errorMessage || "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        aria-label={dictionary.toggleChat || "Toggle chat"}
        size="icon"
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 h-[60vh] max-h-[500px] flex flex-col shadow-xl z-50 animate-fade-in-up-delay-200">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">{dictionary.title || "thiq bi Assistant"}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleOpen} aria-label={dictionary.closeChat || "Close chat"}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "mb-3 flex flex-col",
                    message.sender === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {message.text}
                  </div>
                  <span className="text-xs text-muted-foreground/70 mt-0.5 px-1">
                    {message.timestamp.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full items-center space-x-2 rtl:space-x-reverse"
            >
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={dictionary.inputPlaceholder || "Type your message..."}
                className="flex-1"
                disabled={isLoading}
                autoFocus
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">{dictionary.sendButton || "Send"}</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
