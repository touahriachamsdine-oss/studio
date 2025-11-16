
import type React from 'react';
import type { Dictionary as AppDictionary } from '@/lib/dictionary';

export type UserRole = 'guest' | 'user' | 'professional' | 'admin';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  specializations?: string[]; // Array of specialization keys
  availability?: string;
  phoneNumber?: string;
  state?: string; // Algerian state key
  isApproved?: boolean; // For professional approval status
}

export interface ProfessionalApplication {
  id:string;
  fullName: string;
  email: string;
  specialization: string;
  documents: { name: string; url: string }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export interface Service {
  id: string;
  titleKey: keyof AppDictionary['service'];
  descriptionKey: keyof AppDictionary['service'];
  icon: React.ElementType;
  dataAiHint: string;
  imageUrl?: string; // Added imageUrl field
}

export interface ListedProfessional {
  id: string;
  name: string;
  avatarUrl?: string;
  specialty: string; // This could be a primary displayed specialty
  specializations?: string[]; // Array of actual specialization keys
  rating: number;
  numberOfRatings?: number; // New: Number of ratings received
  servicesOffered: string[];
  bio?: string;
}

export interface MessageParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
}

export type MessageType = 'text' | 'service_request' | 'service_response' | 'file_upload';

export interface ServiceRequestDetails {
  serviceId: string;
  serviceName: string;
  status: 'pending' | 'accepted' | 'declined';
  requesterId: string; // ID of the user who made the request
}

export interface ServiceResponseDetails {
  originalRequestId: string; // ID of the 'service_request' message
  serviceName: string;
  responseStatus: 'accepted' | 'declined';
}

export interface FileUploadDetails {
  // originalRequestId: string; // ID of the 'service_request' message, if files are tied to a specific request
  serviceName: string; // Name of the service these files relate to
  fileNames: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read?: boolean;
  seen?: boolean;
  messageType?: MessageType;
  serviceRequestDetails?: ServiceRequestDetails;
  serviceResponseDetails?: ServiceResponseDetails;
  fileUploadDetails?: FileUploadDetails;
}

export interface Conversation {
  id: string;
  participants: MessageParticipant[];
  lastMessage: Message;
  unreadCount: number;
}

