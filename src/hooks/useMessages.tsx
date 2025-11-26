import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/pet';
import { useEffect } from 'react';
import { dbMessageToMessage } from '@/lib/petTransformers';

export function useMessages(matchId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', matchId],
    queryFn: async () => {
      if (!matchId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      return data.map(dbMessageToMessage);
    },
    enabled: !!matchId,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', matchId] });
          queryClient.invalidateQueries({ queryKey: ['matches'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, queryClient]);

  return query;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      senderPetId,
      content,
    }: {
      matchId: string;
      senderPetId: string;
      content: string;
    }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_pet_id: senderPetId,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}
