import { useMutation } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { finalizeEvent, type EventTemplate } from 'nostr-tools';
import { nip44 } from 'nostr-tools';
import { useToast } from '@/hooks/useToast';

interface EncryptedMessageData {
  recipientPubkey: string;
  senderSecretKey: Uint8Array;
  senderPubkey: string;
  message: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
}

/**
 * Hook to send encrypted Nostr messages (kind 4 - NIP-04/NIP-44).
 * Used for contact form submissions to admin.
 */
export function useSendEncryptedMessage() {
  const { nostr } = useNostr();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: EncryptedMessageData) => {
      const { recipientPubkey, senderSecretKey, message, name, email, phone, subject } = data;

      // Prepare message content with metadata
      const messageContent = {
        name,
        email,
        phone,
        subject,
        message,
        timestamp: new Date().toISOString(),
      };

      const messageText = JSON.stringify(messageContent, null, 2);

      // Encrypt the message using NIP-44
      const conversationKey = nip44.v2.utils.getConversationKey(senderSecretKey, recipientPubkey);
      const encryptedContent = nip44.v2.encrypt(messageText, conversationKey);

      // Create kind 4 event (encrypted direct message)
      const eventTemplate: EventTemplate = {
        kind: 4,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['p', recipientPubkey], // recipient
        ],
        content: encryptedContent,
      };

      // Sign and publish the event
      const signedEvent = finalizeEvent(eventTemplate, senderSecretKey);
      await nostr.event(signedEvent);

      return signedEvent;
    },
    onSuccess: () => {
      toast({
        title: 'Message sent successfully',
        description: 'We have received your message and will respond soon.',
      });
    },
    onError: (error) => {
      console.error('Failed to send encrypted message:', error);
      toast({
        title: 'Failed to send message',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    },
  });
}
