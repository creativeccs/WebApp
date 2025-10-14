import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { validateContactMessage, type ContactMessage, type ContactFormData } from '@/lib/types/property';
import type { NostrFilter } from '@nostrify/nostrify';

export function useContactMessages() {
  const { nostr } = useNostr();
  
  return useQuery({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      // Get admin pubkey from environment
      const adminPubkey = import.meta.env.VITE_ADMIN_PUBKEY;
      if (!adminPubkey) {
        throw new Error('Admin pubkey not configured');
      }

      // Query for contact messages sent to admin
      const filter: NostrFilter = {
        kinds: [1],
        '#p': [adminPubkey], // Messages sent to admin
        '#contact-form': ['true']
      };

      const events = await nostr.query([filter], { 
        signal: new AbortController().signal 
      });

      // Validate and convert events to contact messages
      const messages: ContactMessage[] = events
        .map(validateContactMessage)
        .filter((message): message is ContactMessage => message !== null);

      // Sort by creation date (newest first)
      return messages.sort((a, b) => b.created_at - a.created_at);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useSendContactMessage() {
  const { user } = useCurrentUser();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      if (!user) {
        throw new Error('Must be logged in to send messages');
      }

      const adminPubkey = import.meta.env.VITE_ADMIN_PUBKEY;
      if (!adminPubkey) {
        throw new Error('Admin pubkey not configured');
      }

      // Create contact message event
      const event = {
        kind: 1,
        content: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
        tags: [
          ['p', adminPubkey], // Send to admin
          ['contact-form', 'true'], // Mark as contact form message
          ['subject', formData.subject],
          ['t', 'contact'],
        ],
      };

      await publishEvent(event);
    },
    onSuccess: () => {
      // Invalidate contact messages cache
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

// Admin-only hook to check if current user is admin
export function useIsAdmin() {
  const { user } = useCurrentUser();
  const adminPubkey = import.meta.env.VITE_ADMIN_PUBKEY;
  
  return user?.pubkey === adminPubkey;
}

export function useAdminStats() {
  const { nostr } = useNostr();
  const isAdmin = useIsAdmin();
  
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const adminPubkey = import.meta.env.VITE_ADMIN_PUBKEY;
      if (!adminPubkey) {
        throw new Error('Admin pubkey not configured');
      }

      // Get property count
      const propertiesFilter: NostrFilter = {
        kinds: [30403],
        authors: [adminPubkey],
        '#t': ['property']
      };

      // Get message count
      const messagesFilter: NostrFilter = {
        kinds: [1],
        '#p': [adminPubkey],
        '#contact-form': ['true']
      };

      const [propertyEvents, messageEvents] = await Promise.all([
        nostr.query([propertiesFilter], { signal: new AbortController().signal }),
        nostr.query([messagesFilter], { signal: new AbortController().signal })
      ]);

      // Calculate stats by status
      const propertyStats = {
        total: propertyEvents.length,
        available: 0,
        sold: 0,
        rented: 0,
        pending: 0
      };

      propertyEvents.forEach(event => {
        const statusTag = event.tags.find(tag => tag[0] === 'status');
        const status = statusTag?.[1];
        
        switch (status) {
          case 'available':
            propertyStats.available++;
            break;
          case 'sold':
            propertyStats.sold++;
            break;
          case 'rented':
            propertyStats.rented++;
            break;
          case 'pending':
            propertyStats.pending++;
            break;
        }
      });

      return {
        properties: propertyStats,
        messages: {
          total: messageEvents.length,
          thisMonth: messageEvents.filter(event => {
            const eventDate = new Date(event.created_at * 1000);
            const now = new Date();
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return eventDate >= thisMonth;
          }).length
        }
      };
    },
    enabled: isAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}