import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/types/pet';
import { useAuth } from './useAuth';
import { dbPetToPet } from '@/lib/petTransformers';

export function usePets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(dbPetToPet);
    },
    enabled: !!user,
  });
}

export function useCurrentPet() {
  const { data: pets } = usePets();
  return pets?.[0] || null;
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (petData: Omit<Pet, 'id' | 'ownerId' | 'createdAt' | 'isActive'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pets')
        .insert({
          owner_id: user.id,
          name: petData.name,
          species: petData.species,
          breed: petData.breed,
          age: petData.age,
          gender: petData.gender,
          size: petData.size,
          weight_kg: petData.weightKg,
          bio: petData.bio,
          country: petData.country,
          city: petData.city,
          profile_photo_url: petData.profilePhotoUrl,
          photos: petData.photos,
          interests: petData.interests,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...petData }: Partial<Pet> & { id: string }) => {
      const { data, error } = await supabase
        .from('pets')
        .update({
          name: petData.name,
          age: petData.age,
          breed: petData.breed,
          bio: petData.bio,
          city: petData.city,
          country: petData.country,
          profile_photo_url: petData.profilePhotoUrl,
          photos: petData.photos,
          gender: petData.gender,
          size: petData.size,
          species: petData.species,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useAvailablePets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-pets', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get current user's pet
      const { data: myPets } = await supabase
        .from('pets')
        .select('id')
        .eq('owner_id', user.id);

      const myPetIds = myPets?.map(p => p.id) || [];

      // Get swipes already made
      const { data: swipes } = await supabase
        .from('swipes')
        .select('swiped_pet_id')
        .in('swiper_pet_id', myPetIds);

      const swipedPetIds = swipes?.map(s => s.swiped_pet_id) || [];

      // Get available pets (excluding own pets and already swiped)
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('is_active', true)
        .not('id', 'in', `(${[...myPetIds, ...swipedPetIds].join(',') || 'null'})`);

      if (error) throw error;
      return data.map(dbPetToPet);
    },
    enabled: !!user,
  });
}
