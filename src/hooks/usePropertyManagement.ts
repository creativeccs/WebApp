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
      let mainImageUrl: string | undefined;
      
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          const imageUrl = typeof image === 'string' ? image : image.url;
          const isMain = typeof image === 'string' ? false : image.isMain;
          
          imageMetaTags.push(['image', imageUrl]);
          
          if (isMain) {
            mainImageUrl = imageUrl;
          }
        }
        
        // If no main image is specified, use the first image as main
        if (!mainImageUrl && imageMetaTags.length > 0) {
          const firstImage = formData.images[0];
          mainImageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url;
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
      
      // Add main image tag if available
      if (mainImageUrl) {
        tags.push(['main_image', mainImageUrl]);
      }

      // Add optional fields including multilingual
      const optionalFields: (keyof PropertyFormData)[] = [
        'title_en', 'title_fa', 'title_ar', 'title_ru',
        'description_en', 'description_fa', 'description_ar', 'description_ru',
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
      let mainImageUrl: string | undefined;
      
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          const imageUrl = typeof image === 'string' ? image : image.url;
          const isMain = typeof image === 'string' ? false : image.isMain;
          
          imageMetaTags.push(['image', imageUrl]);
          
          if (isMain) {
            mainImageUrl = imageUrl;
          }
        }
        
        // If no main image is specified, use the first image as main
        if (!mainImageUrl && imageMetaTags.length > 0) {
          const firstImage = formData.images[0];
          mainImageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url;
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
      
      // Add main image tag if available
      if (mainImageUrl) {
        tags.push(['main_image', mainImageUrl]);
      }

      // Add optional fields including multilingual
      const optionalFields: (keyof PropertyFormData)[] = [
        'title_en', 'title_fa', 'title_ar', 'title_ru',
        'description_en', 'description_fa', 'description_ar', 'description_ru',
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

      // For addressable events (kind 30403), use 'a' tag with format: kind:pubkey:d-identifier
      const addressableTag = `30403:${user.pubkey}:${propertyId}`;

      const event = {
        kind: 5, // Deletion event (NIP-09)
        content: 'Property deleted by admin',
        tags: [
          ['a', addressableTag], // Reference to addressable event
          ['k', '30403'], // Kind being deleted
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