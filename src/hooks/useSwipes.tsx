import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SwipeAction } from '@/types/pet';

export function useSwipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      swiperPetId,
      swipedPetId,
      action,
    }: {
      swiperPetId: string;
      swipedPetId: string;
      action: SwipeAction;
    }) => {
      // Insert swipe
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
          swiper_pet_id: swiperPetId,
          swiped_pet_id: swipedPetId,
          action,
        });

      if (swipeError) throw swipeError;

      // If it's a like or superlike, check for mutual match
      if (action === 'like' || action === 'superlike') {
        const { data: mutualSwipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_pet_id', swipedPetId)
          .eq('swiped_pet_id', swiperPetId)
          .in('action', ['like', 'superlike'])
          .single();

        // Create match if mutual
        if (mutualSwipe) {
          const [pet1Id, pet2Id] = [swiperPetId, swipedPetId].sort();
          
          const { error: matchError } = await supabase
            .from('matches')
            .insert({
              pet1_id: pet1Id,
              pet2_id: pet2Id,
            });

          if (matchError && !matchError.message.includes('duplicate')) {
            throw matchError;
          }

          return { isMatch: true };
        }
      }

      return { isMatch: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-pets'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}
