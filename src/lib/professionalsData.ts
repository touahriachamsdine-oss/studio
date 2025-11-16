
import type { ListedProfessional } from '@/types';

const PROFESSIONALS_STORAGE_KEY = 'thiqbi_professionals';

// Default mock data
const defaultMockProfessionals: ListedProfessional[] = [
  {
    id: 'prof-1',
    name: 'Dr. Eleanor Vance',
    avatarUrl: 'https://placehold.co/100x100.png?text=EV',
    specialty: 'Legal Consultation Expert',
    specializations: ['legalConsultant', 'corporateLawyer'],
    rating: 4.8,
    numberOfRatings: 125,
    servicesOffered: ['legal-consultations', 'commercial-transaction-management'],
    bio: '15+ years experience in corporate law and dispute resolution. Dedicated to providing clear, actionable legal advice.'
  },
  {
    id: 'prof-2',
    name: 'Marcus Thorne',
    avatarUrl: 'https://placehold.co/100x100.png?text=MT',
    specialty: 'Certified Notary Public',
    specializations: ['notary'],
    rating: 4.5,
    numberOfRatings: 88,
    servicesOffered: ['semi-digital-notarization'],
    bio: 'Efficient and reliable notary services. Specializing in digital and semi-digital document verification.'
  },
  {
    id: 'prof-3',
    name: 'Aisha Khan',
    avatarUrl: 'https://placehold.co/100x100.png?text=AK',
    specialty: 'Commercial Law Specialist',
    specializations: ['corporateLawyer', 'mediator', 'legalConsultant'],
    rating: 4.9,
    numberOfRatings: 210,
    servicesOffered: ['commercial-transaction-management', 'legal-consultations'],
    bio: 'Expert in international trade law and commercial contract negotiation. Helping businesses thrive globally.'
  },
  {
    id: 'prof-4',
    name: 'John B. Good',
    avatarUrl: 'https://placehold.co/100x100.png?text=JG',
    specialty: 'General Legal Practice',
    specializations: ['lawyerGeneral', 'familyLawyer'],
    rating: 4.2,
    numberOfRatings: 70,
    servicesOffered: ['legal-consultations'],
    bio: 'Providing comprehensive legal support for individuals and small businesses for over 10 years.'
  },
  {
    id: 'prof-5',
    name: 'Sofia Chen',
    avatarUrl: 'https://placehold.co/100x100.png?text=SC',
    specialty: 'Digital Notarization & Tech Law',
    specializations: ['notary', 'legalConsultant', 'corporateLawyer'],
    rating: 4.7,
    numberOfRatings: 150,
    servicesOffered: ['semi-digital-notarization', 'legal-consultations'],
    bio: 'Pioneering modern notarization solutions and advising on legal tech innovations.'
  }
];

const loadProfessionals = (): ListedProfessional[] => {
  if (typeof window === 'undefined') {
    return defaultMockProfessionals;
  }
  try {
    const storedProfessionals = localStorage.getItem(PROFESSIONALS_STORAGE_KEY);
    if (storedProfessionals) {
      return JSON.parse(storedProfessionals);
    }
  } catch (error) {
    console.error('Error loading professionals from localStorage:', error);
  }
  // If nothing in localStorage or error, save and return defaults
  saveProfessionals(defaultMockProfessionals);
  return defaultMockProfessionals;
};

const saveProfessionals = (professionals: ListedProfessional[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(PROFESSIONALS_STORAGE_KEY, JSON.stringify(professionals));
  } catch (error) {
    console.error('Error saving professionals to localStorage:', error);
  }
};

export let mockProfessionals: ListedProfessional[] = loadProfessionals();

export const getProfessionalById = (id: string): ListedProfessional | undefined => {
  // Ensure we are working with the latest version from localStorage if possible
  if (typeof window !== 'undefined') {
      mockProfessionals = loadProfessionals();
  }
  return mockProfessionals.find(p => p.id === id);
};

export const updateProfessionalRating = (professionalId: string, userNumericRating: number): ListedProfessional | null => {
  const professionalIndex = mockProfessionals.findIndex(p => p.id === professionalId);
  if (professionalIndex === -1) {
    console.error(`Professional with ID ${professionalId} not found for rating.`);
    return null;
  }

  const professional = { ...mockProfessionals[professionalIndex] }; // Create a copy to modify

  const currentTotalRating = (professional.rating || 0) * (professional.numberOfRatings || 0);
  const newNumberOfRatings = (professional.numberOfRatings || 0) + 1;
  const newAverageRating = (currentTotalRating + userNumericRating) / newNumberOfRatings;

  professional.rating = parseFloat(newAverageRating.toFixed(1)); // Keep one decimal place
  professional.numberOfRatings = newNumberOfRatings;

  mockProfessionals[professionalIndex] = professional; // Update the in-memory array
  saveProfessionals(mockProfessionals); // Persist to localStorage

  return professional; // Return the updated professional object
};
