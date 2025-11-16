
import type { Conversation, Message, User, MessageParticipant, ServiceRequestDetails, ServiceResponseDetails, FileUploadDetails, MessageType } from '@/types';
import { mockProfessionals } from './professionalsData';
import { servicesList } from './servicesData'; // To get service names

const CONVERSATIONS_STORAGE_KEY = 'thiqbi_conversations';
const MESSAGES_STORAGE_KEY_PREFIX = 'thiqbi_messages_';

// Helper to rehydrate dates and seen status from ISO strings/localStorage
const rehydrateMessage = (msg: any): Message => ({
  ...msg,
  timestamp: new Date(msg.timestamp),
  seen: msg.seen || false,
  read: msg.read || false,
  messageType: msg.messageType || 'text',
  serviceRequestDetails: msg.serviceRequestDetails ? { ...msg.serviceRequestDetails } : undefined,
  serviceResponseDetails: msg.serviceResponseDetails ? { ...msg.serviceResponseDetails } : undefined,
  fileUploadDetails: msg.fileUploadDetails ? { ...msg.fileUploadDetails } : undefined,
});

const rehydrateConversation = (conv: any): Conversation => ({
  ...conv,
  lastMessage: rehydrateMessage(conv.lastMessage),
  participants: conv.participants || [],
  unreadCount: conv.unreadCount || 0,
});

const loadFromLocalStorage = <T>(key: string, rehydrator?: (data: any) => T): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) return null;
    const parsedData = JSON.parse(serializedData);
    return rehydrator ? rehydrator(parsedData) : parsedData;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return null;
  }
};

const saveToLocalStorage = (key: string, data: any): void => {
  if (typeof window === 'undefined') return;
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const getDefaultMockConversations = (): Conversation[] => mockProfessionals.slice(0, 3).map((prof, index) => {
  const userParticipant: MessageParticipant = { id: `user-mock-${index}`, name: "Mock User", role: "user", avatarUrl: `https://placehold.co/40x40.png?text=MU` };
  const profParticipant: MessageParticipant = { id: prof.id, name: prof.name, role: "professional", avatarUrl: prof.avatarUrl || `https://placehold.co/40x40.png` };
  
  const isUserLastSender = index % 2 === 0;
  const lastMessageSender = isUserLastSender ? userParticipant : profParticipant;
  
  return {
    id: `conv-${prof.id}`,
    participants: [userParticipant, profParticipant],
    lastMessage: {
      id: `msg-last-${index}-${prof.id}`,
      conversationId: `conv-${prof.id}`,
      senderId: lastMessageSender.id,
      text: `This is the last mock message with ${prof.name.split(' ')[0]}.`,
      timestamp: new Date(Date.now() - (index + 1) * 60000 * 5),
      read: !isUserLastSender,
      seen: false,
      messageType: 'text',
    },
    unreadCount: !isUserLastSender ? Math.floor(Math.random() * 3) + 1 : 0,
  };
});

export let mockConversations: Conversation[] =
  loadFromLocalStorage<Conversation[]>(CONVERSATIONS_STORAGE_KEY, (data) => Array.isArray(data) ? data.map(rehydrateConversation) : getDefaultMockConversations()) || getDefaultMockConversations();

let persistedMessages: Record<string, Message[]> = {};

const generateInitialMessages = (conversationId: string, participants: MessageParticipant[]): Message[] => {
  const conversation = mockConversations.find(c => c.id === conversationId);
  if (!conversation) return [];

  const professionalParticipant = participants.find(p => p.role === 'professional');
  const currentUserParticipant = participants.find(p => p.id !== professionalParticipant?.id);

  if (!professionalParticipant || !currentUserParticipant) return [];

  const initialMsgs: Message[] = [
    {
      id: `msg-init-1-${conversationId}`,
      conversationId,
      senderId: professionalParticipant.id,
      text: `Hello ${currentUserParticipant.name.split(' ')[0]}! How can I assist you today?`,
      timestamp: new Date(Date.now() - 10 * 60000),
      read: false,
      seen: false,
      messageType: 'text',
    },
  ];

  if (conversation.lastMessage && 
      conversation.lastMessage.id !== initialMsgs[0].id && 
      new Date(conversation.lastMessage.timestamp) > new Date(initialMsgs[0].timestamp) &&
      !initialMsgs.find(m => m.id === conversation.lastMessage.id)) {
    initialMsgs.push(conversation.lastMessage);
  }

  return initialMsgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

if (typeof window !== 'undefined') {
  if (mockConversations.length === 0) {
      mockConversations = getDefaultMockConversations();
  }
  mockConversations.forEach(conv => {
    const messagesForKey = loadFromLocalStorage<Message[]>(
      `${MESSAGES_STORAGE_KEY_PREFIX}${conv.id}`,
      (data) => Array.isArray(data) ? data.map(rehydrateMessage) : generateInitialMessages(conv.id, conv.participants)
    );
    if (messagesForKey && messagesForKey.length > 0) {
      persistedMessages[conv.id] = messagesForKey;
    } else {
      const initialMsgs = generateInitialMessages(conv.id, conv.participants);
      persistedMessages[conv.id] = initialMsgs;
      saveToLocalStorage(`${MESSAGES_STORAGE_KEY_PREFIX}${conv.id}`, initialMsgs);
    }
  });
  if (!loadFromLocalStorage(CONVERSATIONS_STORAGE_KEY)) {
    saveToLocalStorage(CONVERSATIONS_STORAGE_KEY, mockConversations);
  }
}

export const getMockMessagesForConversation = (conversationId: string, currentUserId: string): Message[] => {
  if (!persistedMessages[conversationId]) {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation) {
      persistedMessages[conversationId] = generateInitialMessages(conversationId, conversation.participants);
      saveToLocalStorage(`${MESSAGES_STORAGE_KEY_PREFIX}${conversationId}`, persistedMessages[conversationId]);
    } else {
      persistedMessages[conversationId] = [];
    }
  }
  
  const messages = persistedMessages[conversationId] || [];
  let unreadCountUpdated = false;
  messages.forEach(msg => {
    if (msg.senderId !== currentUserId && !msg.read) {
      msg.read = true; 
      unreadCountUpdated = true;
    }
  });

  if(unreadCountUpdated) {
      const convIndex = mockConversations.findIndex(c => c.id === conversationId);
      if (convIndex !== -1) {
          mockConversations[convIndex].unreadCount = 0;
          saveToLocalStorage(CONVERSATIONS_STORAGE_KEY, mockConversations);
      }
      saveToLocalStorage(`${MESSAGES_STORAGE_KEY_PREFIX}${conversationId}`, messages);
  }

  return [...(persistedMessages[conversationId] || [])];
};

export const markMessagesAsSeen = (conversationId: string, currentUserId: string): void => {
  if (!persistedMessages[conversationId]) return;

  let changed = false;
  persistedMessages[conversationId].forEach(msg => {
    if (msg.senderId !== currentUserId && !msg.seen) {
      msg.seen = true;
      changed = true;
    }
  });

  if (changed) {
    saveToLocalStorage(`${MESSAGES_STORAGE_KEY_PREFIX}${conversationId}`, persistedMessages[conversationId]);
    const convIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
        const lastMsg = mockConversations[convIndex].lastMessage;
        if(lastMsg.senderId !== currentUserId && !lastMsg.seen) {
            mockConversations[convIndex].lastMessage.seen = true;
            saveToLocalStorage(CONVERSATIONS_STORAGE_KEY, mockConversations);
        }
    }
  }
};

export const addMessageToConversation = (conversationId: string, message: Message): void => {
  if (!persistedMessages[conversationId]) {
    persistedMessages[conversationId] = [];
  }
  persistedMessages[conversationId].push(message);
  saveToLocalStorage(`${MESSAGES_STORAGE_KEY_PREFIX}${conversationId}`, persistedMessages[conversationId]);

  const convIndex = mockConversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    mockConversations[convIndex].lastMessage = message;
    // Increment unread count for the recipient (simplified for prototype)
    const recipient = mockConversations[convIndex].participants.find(p => p.id !== message.senderId);
    // In a real app, you'd only increment if the recipient is not the current user AND not currently viewing the chat
    // For prototype, we'll assume opening chat clears it.
    mockConversations[convIndex].unreadCount +=1; 
    saveToLocalStorage(CONVERSATIONS_STORAGE_KEY, mockConversations);
  }
};

export const updateMessageInConversation = (conversationId: string, messageId: string, updates: Partial<Message>): boolean => {
    if (!persistedMessages[conversationId]) {
        return false;
    }
    const messageIndex = persistedMessages[conversationId].findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
        return false;
    }
    persistedMessages[conversationId][messageIndex] = {
        ...persistedMessages[conversationId][messageIndex],
        ...updates,
    };
    saveToLocalStorage(`${MESSAGES_STORAGE_KEY_PREFIX}${conversationId}`, persistedMessages[conversationId]);

    // Also update lastMessage in conversation if it's the one being updated
    const convIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1 && mockConversations[convIndex].lastMessage.id === messageId) {
        mockConversations[convIndex].lastMessage = { ...mockConversations[convIndex].lastMessage, ...updates };
        saveToLocalStorage(CONVERSATIONS_STORAGE_KEY, mockConversations);
    }
    return true;
};


export const getMockConversationById = (conversationId: string): Conversation | undefined => {
  return mockConversations.find(c => c.id === conversationId);
};

export const ensureConversationExists = (
  professionalId: string,
  professionalName: string,
  professionalAvatarUrl: string | undefined,
  currentUser: User
): string => {
  let existingConversation = mockConversations.find(conv =>
    conv.participants.some(p => p.id === professionalId) &&
    conv.participants.some(p => p.id === currentUser.id)
  );

  if (existingConversation) {
    return existingConversation.id;
  }

  const newConversationId = `conv-${currentUser.id}-${professionalId}-${Date.now()}`;
  const professionalParticipant: MessageParticipant = {
    id: professionalId,
    name: professionalName,
    avatarUrl: professionalAvatarUrl || `https://placehold.co/40x40.png`,
    role: 'professional',
  };
  const currentUserParticipant: MessageParticipant = {
    id: currentUser.id,
    name: currentUser.name || "User",
    avatarUrl: currentUser.avatarUrl || `https://placehold.co/40x40.png`,
    role: currentUser.role,
  };

  const startingMessage: Message = {
    id: `msg-start-${newConversationId}`,
    conversationId: newConversationId,
    senderId: currentUserParticipant.id, 
    text: `Hello ${professionalName}, I'm interested in your services.`,
    timestamp: new Date(),
    read: false, 
    seen: false,
    messageType: 'text',
  };

  const newConversation: Conversation = {
    id: newConversationId,
    participants: [currentUserParticipant, professionalParticipant],
    lastMessage: startingMessage,
    unreadCount: 1, // One unread message for the professional
  };

  mockConversations.unshift(newConversation);
  persistedMessages[newConversationId] = [startingMessage];

  saveToLocalStorage(CONVERSATIONS_STORAGE_KEY, mockConversations);
  saveToLocalStorage(`${MESSAGES_STORAGE_KEY_PREFIX}${newConversationId}`, persistedMessages[newConversationId]);

  return newConversationId;
};


export const getProfessionalById = (professionalId: string) => {
    return mockProfessionals.find(prof => prof.id === professionalId);
};

export const getServiceById = (serviceId: string) => {
    return servicesList.find(service => service.id === serviceId);
};
