import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdmin } from '@/hooks/useAdmin';
import type { PropertyFormData } from '@/lib/types/property';

export function useCreateProperty() {
  const { user } = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: PropertyFormData) => {
      if (!user || !isAdmin) {
        throw new Error('Admin access required');
      }

      // Generate unique property ID
      const propertyId = crypto.randomUUID();

      // Images are already uploaded URLs, just add them as tags
      const imageMetaTags: string[][] = [];
      if (formData.images && formData.images.length > 0) {
        for (const imageUrl of formData.images) {
          imageMetaTags.push(['image', imageUrl]);
        }
      }

      // Build tags array
      const tags: string[][] = [
        ['d', propertyId], // Unique identifier
        ['title', formData.title],
        ['description', formData.description || ''],
        ['type', formData.type],
        ['category', formData.category],
        ['price', formData.price],
        ['currency', formData.currency],
        ['location', formData.location],
        ['status', formData.status],
        ['language', formData.language || 'en'],
        ['t', 'property'],
        ['t', 'realestate'],
        ['t', 'oman'],
        ...imageMetaTags
      ];

      // Add optional fields
      const optionalFields: (keyof PropertyFormData)[] = [
        'area', 'bedrooms', 'bathrooms', 'furnished', 'year_built', 'floor', 'total_floors',
        'address', 'city', 'region', 'country', 'lat', 'lon',
        'parking', 'garden', 'pool', 'elevator', 'balcony', 'storage', 'security', 'gym',
        'contact_phone', 'contact_email', 'contact_whatsapp',
        'available_from', 'lease_duration', 'deposit', 'commission',
        'utilities_included', 'internet_included', 'maintenance_included',
        'pets_allowed', 'smoking_allowed', 'gender_preference', 'nationality_preference',
        'min_lease_period', 'max_occupants',
        'nearest_landmarks', 'public_transport', 'schools_nearby', 'hospitals_nearby', 'shopping_nearby'
      ];

      optionalFields.forEach(field => {
        const value = formData[field];
        if (value !== undefined && value !== null && value !== '') {
          tags.push([field, String(value)]);
        }
      });

      // Create and publish property event
      const event = {
        kind: 30403, // Addressable event kind for properties
        content: '', // Content is empty, all data in tags
        tags
      };

      await publishEvent(event);
      return { propertyId, event };
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useUpdateProperty() {
  const { user } = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, formData }: { propertyId: string; formData: PropertyFormData }) => {
      if (!user || !isAdmin) {
        throw new Error('Admin access required');
      }

      // Images are already uploaded URLs, just add them as tags
      const imageMetaTags: string[][] = [];
      if (formData.images && formData.images.length > 0) {
        for (const imageUrl of formData.images) {
          imageMetaTags.push(['image', imageUrl]);
        }
      }

      // Build tags array (same as create)
      const tags: string[][] = [
        ['d', propertyId], // Same property ID for update
        ['title', formData.title],
        ['description', formData.description || ''],
        ['type', formData.type],
        ['category', formData.category],
        ['price', formData.price],
        ['currency', formData.currency],
        ['location', formData.location],
        ['status', formData.status],
        ['language', formData.language || 'en'],
        ['t', 'property'],
        ['t', 'realestate'],
        ['t', 'oman'],
        ...imageMetaTags
      ];

      // Add optional fields
      const optionalFields: (keyof PropertyFormData)[] = [
        'area', 'bedrooms', 'bathrooms', 'furnished', 'year_built', 'floor', 'total_floors',
        'address', 'city', 'region', 'country', 'lat', 'lon',
        'parking', 'garden', 'pool', 'elevator', 'balcony', 'storage', 'security', 'gym',
        'contact_phone', 'contact_email', 'contact_whatsapp',
        'available_from', 'lease_duration', 'deposit', 'commission',
        'utilities_included', 'internet_included', 'maintenance_included',
        'pets_allowed', 'smoking_allowed', 'gender_preference', 'nationality_preference',
        'min_lease_period', 'max_occupants',
        'nearest_landmarks', 'public_transport', 'schools_nearby', 'hospitals_nearby', 'shopping_nearby'
      ];

      optionalFields.forEach(field => {
        const value = formData[field];
        if (value !== undefined && value !== null && value !== '') {
          tags.push([field, String(value)]);
        }
      });

      // Create and publish property event
      const event = {
        kind: 30403, // Addressable event kind for properties
        content: '', // Content is empty, all data in tags
        tags
      };

      await publishEvent(event);
      return { propertyId, event };
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useDeleteProperty() {
  const { user } = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user || !isAdmin) {
        throw new Error('Admin access required');
      }

      // In Nostr, we can't truly delete events, but we can publish a deletion event
      // Or update the property status to 'deleted' or 'inactive'
      const event = {
        kind: 5, // Deletion event
        content: 'Property deleted by admin',
        tags: [
          ['e', propertyId], // Reference to the property event to delete
          ['t', 'property-deletion']
        ]
      };

      await publishEvent(event);
      return propertyId;
    },
    onSuccess: (propertyId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['featuredProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}