
import type { Service } from '@/types';
import { Briefcase, Stamp, Handshake } from 'lucide-react';

export const servicesList: Service[] = [
  {
    id: 'legal-consultations',
    titleKey: 'legalConsultations',
    descriptionKey: 'legalConsultations',
    icon: Briefcase,
    dataAiHint: 'legal consultation',
    imageUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bGF3eWVyc3xlbnwwfHx8fDE3NDg2ODg0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'semi-digital-notarization',
    titleKey: 'semiDigitalNotarization',
    descriptionKey: 'semiDigitalNotarization',
    icon: Stamp,
    dataAiHint: 'notary stamp',
    imageUrl: 'https://i.ibb.co/C53KmQC0/Whats-App-Image-2025-05-29-at-11-45-14-7d4ca3de.jpg'
  },
  {
    id: 'commercial-transaction-management',
    titleKey: 'commercialTransactionManagement',
    descriptionKey: 'commercialTransactionManagement',
    icon: Handshake,
    dataAiHint: 'business handshake',
    imageUrl: 'https://i.ibb.co/Nd9Q1348/Whats-App-Image-2025-05-29-at-12-16-37-2e55a592.jpg'
  },
];

