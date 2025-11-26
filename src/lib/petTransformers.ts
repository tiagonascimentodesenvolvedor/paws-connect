import { Pet, Message } from '@/types/pet';

// Transform database pet to app pet
export function dbPetToPet(dbPet: any): Pet {
  return {
    id: dbPet.id,
    ownerId: dbPet.owner_id,
    name: dbPet.name,
    species: dbPet.species,
    breed: dbPet.breed,
    age: dbPet.age,
    gender: dbPet.gender,
    size: dbPet.size,
    weightKg: dbPet.weight_kg,
    bio: dbPet.bio,
    country: dbPet.country,
    city: dbPet.city,
    profilePhotoUrl: dbPet.profile_photo_url,
    photos: dbPet.photos,
    interests: dbPet.interests,
    isActive: dbPet.is_active,
    createdAt: dbPet.created_at,
    distanceKm: dbPet.distance_km,
  };
}

// Transform database message to app message
export function dbMessageToMessage(dbMessage: any): Message {
  return {
    id: dbMessage.id,
    matchId: dbMessage.match_id,
    senderPetId: dbMessage.sender_pet_id,
    content: dbMessage.content,
    sentAt: dbMessage.sent_at,
    readAt: dbMessage.read_at,
  };
}
