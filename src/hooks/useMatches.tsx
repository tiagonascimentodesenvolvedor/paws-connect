import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/pet';
import { useAuth } from './useAuth';
import { dbPetToPet, dbMessageToMessage } from '@/lib/petTransformers';

export function useMatches() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['matches', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get current user's pets
      const { data: myPets } = await supabase
        .from('pets')
        .select('id')
        .eq('owner_id', user.id);

      const myPetIds = myPets?.map(p => p.id) || [];

      if (myPetIds.length === 0) return [];

      // Get matches
      const { data: matches, error } = await supabase
        .from('matches')
        .select(`
          *,
          pet1:pets!matches_pet1_id_fkey(*),
          pet2:pets!matches_pet2_id_fkey(*)
        `)
        .or(`pet1_id.in.(${myPetIds.join(',')}),pet2_id.in.(${myPetIds.join(',')})`)
        .eq('is_active', true)
        .order('matched_at', { ascending: false });

      if (error) throw error;

      // Get last message for each match
      const matchesWithMessages = await Promise.all(
        (matches || []).map(async (match: any) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', match.id)
            .order('sent_at', { ascending: false })
            .limit(1)
            .single();

          // Determine which pet is the other pet
          const otherPet = myPetIds.includes(match.pet1_id) ? match.pet2 : match.pet1;

          return {
            id: match.id,
            pet1Id: match.pet1_id,
            pet2Id: match.pet2_id,
            matchedAt: match.matched_at,
            isActive: match.is_active,
            pet: dbPetToPet(otherPet),
            lastMessage: lastMessage ? dbMessageToMessage(lastMessage) : undefined,
          } as Match;
        })
      );

      return matchesWithMessages;
    },
    enabled: !!user,
  });
}
