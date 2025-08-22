export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  imageHint: string;
  category: 'Music' | 'Art' | 'Food' | 'Sports' | 'Culture';
  venueId: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
}
