export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type Gender = 'male' | 'female';
export type Size = 'small' | 'medium' | 'large' | 'extra_large';
export type Interest = 'playdate' | 'walking' | 'park' | 'training' | 'daycare' | 'friendship' | 'breeding';
export type SwipeAction = 'like' | 'pass' | 'superlike';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed?: string;
  age: number;
  gender: Gender;
  size?: Size;
  weightKg?: number;
  bio: string;
  country: string;
  city: string;
  profilePhotoUrl: string;
  photos: string[];
  interests: Interest[];
  distanceKm?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Match {
  id: string;
  pet1Id: string;
  pet2Id: string;
  matchedAt: string;
  isActive: boolean;
  pet?: Pet;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  matchId: string;
  senderPetId: string;
  content: string;
  sentAt: string;
  readAt?: string;
}

export interface User {
  id: string;
  email: string;
  pets: Pet[];
}
