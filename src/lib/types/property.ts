import type { NostrEvent } from '@nostrify/nostrify';

// Property Types
export type PropertyType = 'sale' | 'rent' | 'both';
export type PropertyCategory = 'villa' | 'apartment' | 'commercial' | 'land' | 'other';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';
export type Currency = 'OMR' | 'USD' | 'EUR';
export type BooleanValue = 'yes' | 'no' | 'partial';
export type GenderPreference = 'male' | 'female' | 'family' | 'any';

// Property Interface
export interface Property {
  // Event metadata
  id: string; // event.id
  pubkey: string; // event.pubkey
  created_at: number; // event.created_at
  
  // Required fields - Multilingual
  d: string; // unique property identifier
  title: string;
  title_en: string;
  title_fa: string;
  title_ar: string;
  title_ru?: string;
  description: string;
  description_en: string;
  description_fa: string;
  description_ar: string;
  description_ru?: string;
  type: PropertyType;
  category: PropertyCategory;
  price: string;
  currency: Currency;
  location: string;
  status: PropertyStatus;
  
  // Property details
  area?: string;
  bedrooms?: string;
  bathrooms?: string;
  furnished?: BooleanValue;
  year_built?: string;
  
  // Location details
  lat?: string;
  lon?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  
  // Amenities
  parking?: BooleanValue;
  garden?: BooleanValue;
  pool?: BooleanValue;
  elevator?: BooleanValue;
  balcony?: BooleanValue;
  storage?: BooleanValue;
  security?: BooleanValue;
  gym?: BooleanValue;
  
  // Building information
  floor?: string;
  total_floors?: string;
  
  // Contact information
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  
  // Rental specific
  available_from?: string;
  lease_duration?: string;
  deposit?: string;
  utilities_included?: BooleanValue;
  internet_included?: BooleanValue;
  maintenance_included?: BooleanValue;
  pets_allowed?: BooleanValue;
  smoking_allowed?: BooleanValue;
  gender_preference?: GenderPreference;
  nationality_preference?: string;
  min_lease_period?: string;
  max_occupants?: string;
  
  // Sale specific
  commission?: string;
  
  // Neighborhood
  nearest_landmarks?: string;
  public_transport?: string;
  schools_nearby?: string;
  hospitals_nearby?: string;
  shopping_nearby?: string;
  
  // System
  language?: string;
  images?: PropertyImage[];
}

// Property Image Interface
export interface PropertyImage {
  url: string;
  alt?: string;
  blurhash?: string;
  dimensions?: string;
  size?: string;
  mimeType?: string;
  hash?: string;
}

// Property Form Data Interface
export interface PropertyFormData {
  // Multilingual Basic Information
  title_en: string;
  title_fa: string;
  title_ar: string;
  title_ru?: string;
  description_en?: string;
  description_fa?: string;
  description_ar?: string;
  description_ru?: string;

  // Legacy fields for backward compatibility
  title: string;
  description: string;

  type: PropertyType;
  category: PropertyCategory;
  status: PropertyStatus;
  
  // Pricing
  price: string;
  currency: Currency;
  commission?: string;
  deposit?: string;
  
  // Property Details
  area?: string;
  bedrooms?: string;
  bathrooms?: string;
  furnished?: BooleanValue;
  year_built?: string;
  floor?: string;
  total_floors?: string;
  
  // Location
  location: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  lat?: string;
  lon?: string;
  
  // Amenities
  parking?: BooleanValue;
  garden?: BooleanValue;
  pool?: BooleanValue;
  elevator?: BooleanValue;
  balcony?: BooleanValue;
  storage?: BooleanValue;
  security?: BooleanValue;
  gym?: BooleanValue;
  
  // Contact
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  
  // Rental Specific
  available_from?: string;
  lease_duration?: string;
  utilities_included?: BooleanValue;
  internet_included?: BooleanValue;
  maintenance_included?: BooleanValue;
  pets_allowed?: BooleanValue;
  smoking_allowed?: BooleanValue;
  gender_preference?: GenderPreference;
  nationality_preference?: string;
  min_lease_period?: string;
  max_occupants?: string;
  
  // Neighborhood
  nearest_landmarks?: string;
  public_transport?: string;
  schools_nearby?: string;
  hospitals_nearby?: string;
  shopping_nearby?: string;
  
  // Images (URLs after upload to Primal servers)
  images?: string[];
  
  // System
  language?: string;
}

// Property Filter Interface
export interface PropertyFilter {
  type?: PropertyType[];
  category?: PropertyCategory[];
  status?: PropertyStatus[];
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  bedrooms?: string[];
  bathrooms?: string[];
  city?: string[];
  amenities?: {
    parking?: boolean;
    garden?: boolean;
    pool?: boolean;
    elevator?: boolean;
    balcony?: boolean;
    storage?: boolean;
    security?: boolean;
    gym?: boolean;
    furnished?: boolean;
  };
  search?: string;
}

// Contact Message Interface
export interface ContactMessage {
  id: string;
  pubkey: string;
  created_at: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  language?: string;
}

// Contact Form Data Interface
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Validation helper functions
export function validateProperty(event: NostrEvent): Property | null {
  try {
    if (event.kind !== 30403) return null;
    
    // Convert tags array to a more usable format
    const getTag = (name: string): string | undefined => {
      const tag = event.tags.find(tag => tag[0] === name);
      return tag?.[1];
    };
    
    // Check required fields
    const requiredFields = ['d', 'title', 'type', 'category', 'price', 'currency', 'location', 'status'];
    for (const field of requiredFields) {
      if (!getTag(field)) return null;
    }
    
    const property: Property = {
      id: event.id,
      pubkey: event.pubkey,
      created_at: event.created_at,
      
      // Required fields - Multilingual
      d: getTag('d')!,
      title: getTag('title')!,
      title_en: getTag('title_en') || getTag('title')!,
      title_fa: getTag('title_fa') || getTag('title')!,
      title_ar: getTag('title_ar') || getTag('title')!,
      description: getTag('description') || '',
      description_en: getTag('description_en') || getTag('description') || '',
      description_fa: getTag('description_fa') || getTag('description') || '',
      description_ar: getTag('description_ar') || getTag('description') || '',
      type: getTag('type')! as PropertyType,
      category: getTag('category')! as PropertyCategory,
      price: getTag('price')!,
      currency: getTag('currency')! as Currency,
      location: getTag('location')!,
      status: getTag('status')! as PropertyStatus,
      
      // Optional fields - extract all available tags
      area: getTag('area'),
      bedrooms: getTag('bedrooms'),
      bathrooms: getTag('bathrooms'),
      furnished: getTag('furnished') as BooleanValue,
      year_built: getTag('year_built'),
      
      // Location
      lat: getTag('lat'),
      lon: getTag('lon'),
      address: getTag('address'),
      city: getTag('city'),
      region: getTag('region'),
      country: getTag('country'),
      
      // Amenities
      parking: getTag('parking') as BooleanValue,
      garden: getTag('garden') as BooleanValue,
      pool: getTag('pool') as BooleanValue,
      elevator: getTag('elevator') as BooleanValue,
      balcony: getTag('balcony') as BooleanValue,
      storage: getTag('storage') as BooleanValue,
      security: getTag('security') as BooleanValue,
      gym: getTag('gym') as BooleanValue,
      
      // Building info
      floor: getTag('floor'),
      total_floors: getTag('total_floors'),
      
      // Contact
      contact_phone: getTag('contact_phone'),
      contact_email: getTag('contact_email'),
      contact_whatsapp: getTag('contact_whatsapp'),
      
      // Rental specific
      available_from: getTag('available_from'),
      lease_duration: getTag('lease_duration'),
      deposit: getTag('deposit'),
      utilities_included: getTag('utilities_included') as BooleanValue,
      internet_included: getTag('internet_included') as BooleanValue,
      maintenance_included: getTag('maintenance_included') as BooleanValue,
      pets_allowed: getTag('pets_allowed') as BooleanValue,
      smoking_allowed: getTag('smoking_allowed') as BooleanValue,
      gender_preference: getTag('gender_preference') as GenderPreference,
      nationality_preference: getTag('nationality_preference'),
      min_lease_period: getTag('min_lease_period'),
      max_occupants: getTag('max_occupants'),
      
      // Sale specific
      commission: getTag('commission'),
      
      // Neighborhood
      nearest_landmarks: getTag('nearest_landmarks'),
      public_transport: getTag('public_transport'),
      schools_nearby: getTag('schools_nearby'),
      hospitals_nearby: getTag('hospitals_nearby'),
      shopping_nearby: getTag('shopping_nearby'),
      
      // System
      language: getTag('language'),
      
      // Parse images from image tags (simple URL tags)
      images: event.tags
        .filter(tag => tag[0] === 'image')
        .map(tag => ({
          url: tag[1],
          alt: `Property image`,
        }))
        .filter(img => img.url) as PropertyImage[]
    };
    
    return property;
  } catch (error) {
    console.error('Error validating property:', error);
    return null;
  }
}

export function validateContactMessage(event: NostrEvent): ContactMessage | null {
  try {
    if (event.kind !== 1) return null;
    
    // Check for contact message tags
    const hasContactTag = event.tags.find(tag => tag[0] === 'contact-form');
    if (!hasContactTag) return null;
    
    const getTag = (name: string): string | undefined => {
      const tag = event.tags.find(tag => tag[0] === name);
      return tag?.[1];
    };
    
    const content = JSON.parse(event.content);
    
    const message: ContactMessage = {
      id: event.id,
      pubkey: event.pubkey,
      created_at: event.created_at,
      name: content.name,
      email: content.email,
      subject: content.subject,
      message: content.message,
      language: getTag('language')
    };
    
    return message;
  } catch (error) {
    console.error('Error validating contact message:', error);
    return null;
  }
}