import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrFilter } from '@nostrify/nostrify';
import { validateProperty, type Property, type PropertyFilter } from '@/lib/types/property';

export function useProperties(filters?: PropertyFilter) {
  const { nostr } = useNostr();
  
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      // Get admin pubkey from environment
      const adminPubkey = import.meta.env.VITE_ADMIN_PUBKEY;
      if (!adminPubkey) {
        throw new Error('Admin pubkey not configured');
      }

      // Build Nostr filter
      const baseFilter: NostrFilter = {
        kinds: [30403],
        authors: [adminPubkey], // Only show properties from admin
        '#t': ['property']
      };

      // Apply additional filters
      if (filters) {
        if (filters.type?.length) {
          baseFilter['#type'] = filters.type;
        }
        if (filters.category?.length) {
          baseFilter['#category'] = filters.category;
        }
        if (filters.status?.length) {
          baseFilter['#status'] = filters.status;
        }
        if (filters.city?.length) {
          baseFilter['#city'] = filters.city;
        }
      }

      const events = await nostr.query([baseFilter], { 
        signal: new AbortController().signal 
      });

      // Validate and convert events to properties
      const properties: Property[] = events
        .map(validateProperty)
        .filter((property): property is Property => property !== null);

      // Apply client-side filters
      let filteredProperties = properties;

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProperties = filteredProperties.filter(property =>
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.minPrice || filters?.maxPrice) {
        filteredProperties = filteredProperties.filter(property => {
          const price = parseFloat(property.price);
          if (isNaN(price)) return false;
          
          if (filters.minPrice && price < filters.minPrice) return false;
          if (filters.maxPrice && price > filters.maxPrice) return false;
          
          return true;
        });
      }

      if (filters?.bedrooms?.length) {
        filteredProperties = filteredProperties.filter(property =>
          property.bedrooms && filters.bedrooms!.includes(property.bedrooms)
        );
      }

      if (filters?.bathrooms?.length) {
        filteredProperties = filteredProperties.filter(property =>
          property.bathrooms && filters.bathrooms!.includes(property.bathrooms)
        );
      }

      if (filters?.amenities) {
        filteredProperties = filteredProperties.filter(property => {
          const amenities = filters.amenities!;
          
          if (amenities.parking && property.parking !== 'yes') return false;
          if (amenities.garden && property.garden !== 'yes') return false;
          if (amenities.pool && property.pool !== 'yes') return false;
          if (amenities.elevator && property.elevator !== 'yes') return false;
          if (amenities.balcony && property.balcony !== 'yes') return false;
          if (amenities.storage && property.storage !== 'yes') return false;
          if (amenities.security && property.security !== 'yes') return false;
          if (amenities.gym && property.gym !== 'yes') return false;
          if (amenities.furnished && property.furnished !== 'yes') return false;
          
          return true;
        });
      }

      // Sort by creation date (newest first)
      return filteredProperties.sort((a, b) => b.created_at - a.created_at);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useProperty(propertyId: string) {
  const { nostr } = useNostr();
  
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const adminPubkey = import.meta.env.VITE_ADMIN_PUBKEY;
      if (!adminPubkey) {
        throw new Error('Admin pubkey not configured');
      }

      const events = await nostr.query([{
        kinds: [30403],
        authors: [adminPubkey],
        '#d': [propertyId],
        '#t': ['property']
      }], { 
        signal: new AbortController().signal 
      });

      if (events.length === 0) {
        return null;
      }

      return validateProperty(events[0]);
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useFeaturedProperties(limit = 6) {
  const { nostr } = useNostr();
  
  return useQuery({
    queryKey: ['featuredProperties', limit],
    queryFn: async () => {
      const adminPubkey = import.meta.env.VITE_ADMIN_PUBKEY;
      if (!adminPubkey) {
        throw new Error('Admin pubkey not configured');
      }

      const events = await nostr.query([{
        kinds: [30403],
        authors: [adminPubkey],
        '#status': ['available'],
        '#t': ['property']
      }], { 
        signal: new AbortController().signal 
      });

      const properties: Property[] = events
        .map(validateProperty)
        .filter((property): property is Property => property !== null);

      // Sort by creation date and return limited results
      return properties
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, limit);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

// Get unique values for filter dropdowns
export function usePropertyFilterOptions() {
  const { data: properties } = useProperties();
  
  const options = {
    cities: [] as string[],
    bedrooms: [] as string[],
    bathrooms: [] as string[],
    priceRange: { min: 0, max: 0 }
  };

  if (properties) {
    // Get unique cities
    options.cities = Array.from(new Set(
      properties
        .map(p => p.city)
        .filter(Boolean) as string[]
    )).sort();

    // Get unique bedroom counts
    options.bedrooms = Array.from(new Set(
      properties
        .map(p => p.bedrooms)
        .filter(Boolean) as string[]
    )).sort((a, b) => parseInt(a) - parseInt(b));

    // Get unique bathroom counts
    options.bathrooms = Array.from(new Set(
      properties
        .map(p => p.bathrooms)
        .filter(Boolean) as string[]
    )).sort((a, b) => parseInt(a) - parseInt(b));

    // Get price range
    const prices = properties
      .map(p => parseFloat(p.price))
      .filter(p => !isNaN(p));
      
    if (prices.length > 0) {
      options.priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    }
  }

  return options;
}