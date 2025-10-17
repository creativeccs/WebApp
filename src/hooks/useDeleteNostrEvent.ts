import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { type EventTemplate } from 'nostr-tools';
import { useToast } from '@/hooks/useToast';

/**
 * Hook to delete Nostr events by publishing a kind 5 deletion event (NIP-09).
 * This requests relays to delete the specified events.
 */
export function useDeleteNostrEvent() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.signer) {
        throw new Error('User must be logged in to delete events');
      }

      // Create kind 5 deletion event (NIP-09)
      const deletionTemplate: EventTemplate = {
        kind: 5,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['e', eventId], // Event to delete
        ],
        content: '', // Optional reason for deletion
      };

      // Sign the event using the user's signer
      const signedEvent = await user.signer.signEvent(deletionTemplate);

      // Publish the deletion event
      await nostr.event(signedEvent);

      return eventId;
    },
    onSuccess: () => {
      // Invalidate the encrypted messages query to refetch
      queryClient.invalidateQueries({ queryKey: ['encrypted-messages'] });
      
      toast({
        title: 'Message deleted',
        description: 'The message deletion request has been sent to relays.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete event:', error);
      toast({
        title: 'Failed to delete message',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });
}
