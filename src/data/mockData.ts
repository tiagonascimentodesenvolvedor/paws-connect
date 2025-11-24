import { Pet, Match, Message } from '@/types/pet';

export const mockPets: Pet[] = [
  {
    id: '1',
    ownerId: 'user1',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    size: 'large',
    weightKg: 30,
    bio: 'Adoro correr no parque e brincar de buscar! Procuro amigos para aventuras ao ar livre 🎾',
    country: 'BR',
    city: 'São Paulo',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
    photos: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'
    ],
    interests: ['playdate', 'walking', 'park'],
    distanceKm: 2.5,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    ownerId: 'user2',
    name: 'Luna',
    species: 'dog',
    breed: 'Husky Siberiano',
    age: 2,
    gender: 'female',
    size: 'large',
    weightKg: 25,
    bio: 'Husky enérgica que ama neve e longas caminhadas. Vamos explorar juntos? ❄️',
    country: 'BR',
    city: 'São Paulo',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800',
    photos: [
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800'
    ],
    interests: ['walking', 'training', 'friendship'],
    distanceKm: 1.2,
    isActive: true,
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    ownerId: 'user3',
    name: 'Bella',
    species: 'cat',
    breed: 'Persa',
    age: 4,
    gender: 'female',
    size: 'small',
    weightKg: 4,
    bio: 'Gata elegante que aprecia momentos tranquilos. Busco companhia serena para sonecas ao sol 😸',
    country: 'BR',
    city: 'São Paulo',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    photos: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800'
    ],
    interests: ['friendship', 'daycare'],
    distanceKm: 3.8,
    isActive: true,
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    ownerId: 'user4',
    name: 'Thor',
    species: 'dog',
    breed: 'Rottweiler',
    age: 5,
    gender: 'male',
    size: 'extra_large',
    weightKg: 50,
    bio: 'Grande e protetor, mas um amor de cachorro. Procuro amigos leais para brincadeiras 💪',
    country: 'BR',
    city: 'São Paulo',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
    photos: [
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800'
    ],
    interests: ['playdate', 'training', 'friendship'],
    distanceKm: 5.0,
    isActive: true,
    createdAt: '2024-02-05T16:00:00Z'
  },
  {
    id: '5',
    ownerId: 'user5',
    name: 'Mia',
    species: 'cat',
    breed: 'Siamês',
    age: 1,
    gender: 'female',
    size: 'small',
    weightKg: 3,
    bio: 'Gatinha curiosa e brincalhona! Adoro explorar e fazer novos amigos 🐱',
    country: 'BR',
    city: 'São Paulo',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800',
    photos: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'
    ],
    interests: ['playdate', 'friendship'],
    distanceKm: 0.8,
    isActive: true,
    createdAt: '2024-02-10T11:45:00Z'
  }
];

export const mockMatches: Match[] = [
  {
    id: 'match1',
    pet1Id: 'current-user-pet',
    pet2Id: '2',
    matchedAt: '2024-02-15T10:00:00Z',
    isActive: true,
    pet: mockPets[1]
  },
  {
    id: 'match2',
    pet1Id: 'current-user-pet',
    pet2Id: '4',
    matchedAt: '2024-02-14T15:30:00Z',
    isActive: true,
    pet: mockPets[3]
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    matchId: 'match1',
    senderPetId: '2',
    content: 'Oi! Vi que você também ama caminhadas!',
    sentAt: '2024-02-15T10:05:00Z',
    readAt: '2024-02-15T10:10:00Z'
  },
  {
    id: 'msg2',
    matchId: 'match1',
    senderPetId: 'current-user-pet',
    content: 'Oi Luna! Sim, adoro! Que tal marcarmos uma caminhada no parque?',
    sentAt: '2024-02-15T10:15:00Z',
    readAt: '2024-02-15T10:16:00Z'
  },
  {
    id: 'msg3',
    matchId: 'match1',
    senderPetId: '2',
    content: 'Adorei a ideia! Que tal amanhã às 16h?',
    sentAt: '2024-02-15T10:20:00Z'
  }
];

export const currentUserPet: Pet = {
  id: 'current-user-pet',
  ownerId: 'current-user',
  name: 'Buddy',
  species: 'dog',
  breed: 'Labrador',
  age: 2,
  gender: 'male',
  size: 'large',
  weightKg: 28,
  bio: 'Labrador amigável que adora fazer novos amigos! Procuro companheiros para brincadeiras e aventuras 🐕',
  country: 'BR',
  city: 'São Paulo',
  profilePhotoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
  photos: [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
    'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800'
  ],
  interests: ['playdate', 'walking', 'park', 'friendship'],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z'
};
