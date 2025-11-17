import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { NostrEvent } from '@nostrify/nostrify';

interface DecryptedMessage {
  id: string;
  event: NostrEvent;
  decryptedContent: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message: string;
    timestamp: string;
  } | null;
  senderPubkey: string;
  createdAt: number;
  error?: string;
}

/**
 * Hook to fetch and decrypt encrypted messages (kind 4) sent to the current user (admin).
 * Used in admin dashboard to view contact form submissions.
 */
export function useEncryptedMessages() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ['encrypted-messages', user?.pubkey],
    queryFn: async (c) => {
      if (!user?.pubkey || !user?.signer) {
        throw new Error('User must be logged in to view messages');
      }

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);

      // Query kind 4 events where the current user is tagged as recipient
      const events = await nostr.query(
        [
          {
            kinds: [4],
            '#p': [user.pubkey],
            limit: 100,
          },
        ],
        { signal }
      );

      // Sort by created_at descending (newest first)
      const sortedEvents = events.sort((a, b) => b.created_at - a.created_at);

      // Decrypt each message
      const decryptedMessages: DecryptedMessage[] = await Promise.all(
        sortedEvents.map(async (event) => {
          try {
            // Check if nip04 is available
            if (!user.signer.nip04) {
              return {
                id: event.id,
                event,
                decryptedContent: null,
                senderPubkey: event.pubkey,
                createdAt: event.created_at,
                error: 'NIP-04 decryption not supported by your signer',
              };
            }

            // Decrypt the message using NIP-04
            const decryptedText = await user.signer.nip04.decrypt(event.pubkey, event.content);
            
            // Try to parse as JSON, if it fails, treat as plaintext message
            let decryptedContent;
            try {
              decryptedContent = JSON.parse(decryptedText);
            } catch {
              // If not JSON, create a simple message object
              decryptedContent = {
                message: decryptedText,
                timestamp: new Date(event.created_at * 1000).toISOString(),
              };
            }

            return {
              id: event.id,
              event,
              decryptedContent,
              senderPubkey: event.pubkey,
              createdAt: event.created_at,
            };
          } catch (error) {
            console.error('Failed to decrypt message:', event.id, error);
            return {
              id: event.id,
              event,
              decryptedContent: null,
              senderPubkey: event.pubkey,
              createdAt: event.created_at,
              error: error instanceof Error ? error.message : 'Failed to decrypt',
            };
          }
        })
      );

      return decryptedMessages;
    },
    enabled: !!user?.pubkey,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
