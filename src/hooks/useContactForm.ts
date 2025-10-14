import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostrPublish } from './useNostrPublish';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function useContactForm() {
  const publishMutation = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      // Publish contact message as kind 1 event with special tags
      const result = await publishMutation.mutateAsync({
        kind: 1,
        content: `Contact Form Submission: ${formData.subject}\n\nFrom: ${formData.name} (${formData.email})\n${formData.phone ? `Phone: ${formData.phone}\n` : ''}\nMessage:\n${formData.message}`,
        tags: [
          ['t', 'contact-form'],
          ['subject', formData.subject],
          ['contact-email', formData.email],
          ['contact-name', formData.name],
          ...(formData.phone ? [['contact-phone', formData.phone]] : [])
        ]
      });

      return result;
    },
    onSuccess: () => {
      // Invalidate any contact-related queries
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
    onError: (error) => {
      console.error('Failed to send contact message:', error);
    }
  });
}

export function useContactMessages() {
  // This would be implemented to fetch contact messages for admin
  // For now, return a simple query structure
  return useMutation({
    mutationFn: async () => {
      // Placeholder for admin contact messages functionality
      return [];
    }
  });
}