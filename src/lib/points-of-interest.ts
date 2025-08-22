import type { PointOfInterest } from './types';

export const pointsOfInterest: PointOfInterest[] = [
    {
        id: 'poi1',
        name: 'Dar El-Kaïd',
        description: 'An old Moorish house and a fine example of traditional architecture.',
        category: 'History',
        lat: 35.9320,
        lng: 0.0885,
    },
    {
        id: 'poi2',
        name: 'Phare de Cap Ivi',
        description: 'A historic lighthouse offering stunning panoramic views of the coast.',
        category: 'Landmark',
        lat: 36.0833,
        lng: 0.2167,
    },
    {
        id: 'poi3',
        name: 'Restaurant Le Pêcheur',
        description: 'Famous for its fresh seafood and traditional Mostaganem dishes.',
        category: 'Food',
        lat: 35.9380,
        lng: 0.0770,
    },
];
