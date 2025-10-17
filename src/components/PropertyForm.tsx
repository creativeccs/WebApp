import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Upload, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/contexts/I18nContext';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useCreateProperty, useUpdateProperty } from '@/hooks/usePropertyManagement';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useEffect } from 'react';
import type { 
  PropertyFormData, 
  Property, 
  PropertyType, 
  PropertyCategory, 
  PropertyStatus, 
  Currency,
  BooleanValue,
  GenderPreference 
} from '@/lib/types/property';

// Validation schema with multilingual support
const propertySchema = z.object({
  // Multilingual fields
  title_en: z.string().min(1, 'English title is required'),
  title_fa: z.string().min(1, 'Persian title is required'),
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_ru: z.string().min(1, 'Russian title is required'),
  description_en: z.string().optional(),
  description_fa: z.string().optional(),
  description_ar: z.string().optional(),
  description_ru: z.string().optional(),

  // Basic property info
  type: z.enum(['sale', 'rent', 'both']),
  category: z.enum(['villa', 'apartment', 'commercial', 'land', 'other']),
  status: z.enum(['available', 'sold', 'rented', 'pending']),
  price: z.string().min(1, 'Price is required'),
  currency: z.enum(['OMR', 'USD', 'EUR']),
  location: z.string().min(1, 'Location is required'),
  
  // Optional fields
  area: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  furnished: z.enum(['yes', 'no', 'partial']).optional(),
  year_built: z.string().optional(),
  floor: z.string().optional(),
  total_floors: z.string().optional(),
  
  // Location details
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  lat: z.string().optional(),
  lon: z.string().optional(),
  
  // Amenities
  parking: z.enum(['yes', 'no', 'partial']).optional(),
  garden: z.enum(['yes', 'no']).optional(),
  pool: z.enum(['yes', 'no']).optional(),
  elevator: z.enum(['yes', 'no']).optional(),
  balcony: z.enum(['yes', 'no']).optional(),
  storage: z.enum(['yes', 'no']).optional(),
  security: z.enum(['yes', 'no']).optional(),
  gym: z.enum(['yes', 'no']).optional(),
  
  // Contact
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_whatsapp: z.string().optional(),
  
  // Rental specific
  available_from: z.string().optional(),
  lease_duration: z.string().optional(),
  deposit: z.string().optional(),
  utilities_included: z.enum(['yes', 'no', 'partial']).optional(),
  internet_included: z.enum(['yes', 'no']).optional(),
  maintenance_included: z.enum(['yes', 'no']).optional(),
  pets_allowed: z.enum(['yes', 'no']).optional(),
  smoking_allowed: z.enum(['yes', 'no']).optional(),
  gender_preference: z.enum(['male', 'female', 'family', 'any']).optional(),
  nationality_preference: z.string().optional(),
  min_lease_period: z.string().optional(),
  max_occupants: z.string().optional(),
  
  // Sale specific
  commission: z.string().optional(),
  
  // Neighborhood
  nearest_landmarks: z.string().optional(),
  public_transport: z.string().optional(),
  schools_nearby: z.string().optional(),
  hospitals_nearby: z.string().optional(),
  shopping_nearby: z.string().optional(),
});

interface PropertyFormProps {
  property?: Property;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const { t, language } = useI18n();
  const { user } = useCurrentUser();
  const isAdmin = useIsAdmin();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());
  
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const uploadFile = useUploadFile();
  
  const isEditing = !!property;
  const isLoading = createProperty.isPending || updateProperty.isPending;

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      // Multilingual titles
      title_en: property?.title_en || '',
      title_fa: property?.title_fa || '',
      title_ar: property?.title_ar || '',
      title_ru: property?.title_ru || '',
      description_en: property?.description_en || '',
      description_fa: property?.description_fa || '',
      description_ar: property?.description_ar || '',
      description_ru: property?.description_ru || '',

      // Basic property info
      type: property?.type || 'sale',
      category: property?.category || 'apartment',
      status: property?.status || 'available',
      price: property?.price || '',
      currency: property?.currency || 'OMR',
      location: property?.location || '',
      area: property?.area || '',
      bedrooms: property?.bedrooms || '',
      bathrooms: property?.bathrooms || '',
      furnished: property?.furnished || 'no',
      year_built: property?.year_built || '',
      floor: property?.floor || '',
      total_floors: property?.total_floors || '',
      address: property?.address || '',
      city: property?.city || '',
      region: property?.region || '',
      country: property?.country || 'OM',
      lat: property?.lat || '',
      lon: property?.lon || '',
      parking: property?.parking || 'no',
      garden: property?.garden || 'no',
      pool: property?.pool || 'no',
      elevator: property?.elevator || 'no',
      balcony: property?.balcony || 'no',
      storage: property?.storage || 'no',
      security: property?.security || 'no',
      gym: property?.gym || 'no',
      contact_phone: property?.contact_phone || '',
      contact_email: property?.contact_email || '',
      contact_whatsapp: property?.contact_whatsapp || '',
      available_from: property?.available_from || '',
      lease_duration: property?.lease_duration || '',
      deposit: property?.deposit || '',
      utilities_included: property?.utilities_included || 'no',
      internet_included: property?.internet_included || 'no',
      maintenance_included: property?.maintenance_included || 'no',
      pets_allowed: property?.pets_allowed || 'no',
      smoking_allowed: property?.smoking_allowed || 'no',
      gender_preference: property?.gender_preference || 'any',
      nationality_preference: property?.nationality_preference || '',
      min_lease_period: property?.min_lease_period || '',
      max_occupants: property?.max_occupants || '',
      commission: property?.commission || '',
      nearest_landmarks: property?.nearest_landmarks || '',
      public_transport: property?.public_transport || '',
      schools_nearby: property?.schools_nearby || '',
      hospitals_nearby: property?.hospitals_nearby || '',
      shopping_nearby: property?.shopping_nearby || '',
    }
  });

  const watchedType = form.watch('type');

  // Load existing images when editing
  useEffect(() => {
    if (property?.images && property.images.length > 0) {
      const imageUrls = property.images.map(img => img.url);
      setSelectedImages(imageUrls);
    }
  }, [property]);

  if (!user || !isAdmin) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t.adminOnly}
        </AlertDescription>
      </Alert>
    );
  }

  const onSubmit = async (data: PropertyFormData) => {
    try {
      // Map multilingual fields to legacy fields for backward compatibility
      const formData = {
        ...data,
        // Use current language title/description as primary fields
        title: data[`title_${language}` as keyof PropertyFormData] as string || data.title_en,
        description: data[`description_${language}` as keyof PropertyFormData] as string || data.description_en || '',
        images: selectedImages,
        language
      };

      if (isEditing && property) {
        await updateProperty.mutateAsync({
          propertyId: property.d,
          formData
        });
      } else {
        await createProperty.mutateAsync(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) return;

    // Upload each image to Primal servers
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadingImages(prev => new Set(prev).add(selectedImages.length + i));

      try {
        const tags = await uploadFile.mutateAsync(file);
        // Extract URL from NIP-94 tags (first tag contains the URL)
        const url = tags[0]?.[1];
        if (url) {
          setSelectedImages(prev => [...prev, url]);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        // You might want to show a toast notification here
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedImages.length + i);
          return newSet;
        });
      }
    }

    // Clear the input
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? t.editProperty : t.addProperty}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="multilingual" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="multilingual">🌐 Languages</TabsTrigger>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="gallery">📸 Gallery</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Multilingual Content */}
            <TabsContent value="multilingual" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Title</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="title_en" className="flex items-center gap-2">
                        🇺🇸 English Title *
                      </Label>
                      <Input 
                        id="title_en"
                        {...form.register('title_en')}
                        placeholder="Modern 3BR Apartment in Muscat"
                        className="mt-1"
                      />
                      {form.formState.errors.title_en && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.title_en.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="title_fa" className="flex items-center gap-2">
                        🇮🇷 Persian Title *
                      </Label>
                      <Input 
                        id="title_fa"
                        {...form.register('title_fa')}
                        placeholder="آپارتمان مدرن ۳ خوابه در مسقط"
                        className="mt-1"
                        dir="rtl"
                      />
                      {form.formState.errors.title_fa && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.title_fa.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="title_ar" className="flex items-center gap-2">
                        🇸🇦 Arabic Title *
                      </Label>
                      <Input 
                        id="title_ar"
                        {...form.register('title_ar')}
                        placeholder="شقة حديثة 3 غرف نوم في مسقط"
                        className="mt-1"
                        dir="rtl"
                      />
                      {form.formState.errors.title_ar && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.title_ar.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="title_ru" className="flex items-center gap-2">
                        🇷🇺 Russian Title
                      </Label>
                      <Input 
                        id="title_ru"
                        {...form.register('title_ru')}
                        placeholder="Современная 3-комнатная квартира в Маскате"
                        className="mt-1"
                      />
                      {form.formState.errors.title_ru && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.title_ru.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Description</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="description_en" className="flex items-center gap-2">
                        🇺🇸 English Description
                      </Label>
                      <Textarea 
                        id="description_en"
                        {...form.register('description_en')}
                        placeholder="Detailed description of the property in English..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_fa" className="flex items-center gap-2">
                        🇮🇷 Persian Description
                      </Label>
                      <Textarea 
                        id="description_fa"
                        {...form.register('description_fa')}
                        placeholder="توضیحات详细 ملک به زبان فارسی..."
                        rows={4}
                        className="mt-1"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_ar" className="flex items-center gap-2">
                        🇸🇦 Arabic Description
                      </Label>
                      <Textarea 
                        id="description_ar"
                        {...form.register('description_ar')}
                        placeholder="وصف مفصل للعقار باللغة العربية..."
                        rows={4}
                        className="mt-1"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_ru" className="flex items-center gap-2">
                        🇷🇺 Russian Description
                      </Label>
                      <Textarea 
                        id="description_ru"
                        {...form.register('description_ru')}
                        placeholder="Подробное описание объекта на русском..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">{t.propertyTitle} *</Label>
                  <Input 
                    id="title"
                    {...form.register('title')}
                    placeholder={t.propertyTitle}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">{t.type} *</Label>
                  <Select 
                    value={form.watch('type')} 
                    onValueChange={(value: string) => form.setValue('type', value as PropertyType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">{t.sale}</SelectItem>
                      <SelectItem value="rent">{t.rent}</SelectItem>
                      <SelectItem value="both">{t.both}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">{t.category} *</Label>
                  <Select 
                    value={form.watch('category')} 
                    onValueChange={(value: string) => form.setValue('category', value as PropertyCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.category} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">{t.villa}</SelectItem>
                      <SelectItem value="apartment">{t.apartment}</SelectItem>
                      <SelectItem value="commercial">{t.commercial}</SelectItem>
                      <SelectItem value="land">{t.land}</SelectItem>
                      <SelectItem value="other">{t.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">{t.status} *</Label>
                  <Select 
                    value={form.watch('status')} 
                    onValueChange={(value: string) => form.setValue('status', value as PropertyStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">{t.available}</SelectItem>
                      <SelectItem value="sold">{t.sold}</SelectItem>
                      <SelectItem value="rented">{t.rented}</SelectItem>
                      <SelectItem value="pending">{t.pending}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">{t.price} *</Label>
                  <div className="flex">
                    <Input 
                      id="price"
                      {...form.register('price')}
                      placeholder="1000"
                      className="rounded-r-none"
                    />
                    <Select 
                      value={form.watch('currency')} 
                      onValueChange={(value: string) => form.setValue('currency', value as Currency)}
                    >
                      <SelectTrigger className="w-24 rounded-l-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OMR">OMR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">{t.location} *</Label>
                  <Input 
                    id="location"
                    {...form.register('location')}
                    placeholder={t.location}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t.propertyDescription}</Label>
                <Textarea 
                  id="description"
                  {...form.register('description')}
                  placeholder={t.propertyDescription}
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Image Gallery */}
            <TabsContent value="gallery" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{t.propertyImages}</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload high-quality images of your property (JPG, PNG, max 10MB each)
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedImages.length} images selected
                  </Badge>
                </div>

                {/* Drag and Drop Upload Area */}
                <div className="space-y-4">
                  <Label 
                    htmlFor="images" 
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="text-lg font-medium mb-2">Upload Property Images</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop images here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG, WebP • Max 10MB per image • Up to 20 images
                      </p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      title="Upload property images"
                      aria-label="Upload property images"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </Label>

                  {/* Image Preview Grid */}
                  {selectedImages.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {isEditing ? 'Property Images' : 'Selected Images'} ({selectedImages.length})
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedImages([])}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                              <img
                                src={imageUrl}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                              
                              {/* Remove button */}
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                                onClick={() => removeImage(index)}
                                disabled={uploadingImages.has(index)}
                                title="Remove image"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              
                              {/* Upload indicator */}
                              {uploadingImages.has(index) && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="text-white text-sm">Uploading...</div>
                                </div>
                              )}
                              
                              {/* Image info overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-white truncate">Image {index + 1}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Property Details */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="area">{t.area}</Label>
                  <Input 
                    id="area"
                    {...form.register('area')}
                    placeholder="150"
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">{t.bedrooms}</Label>
                  <Select 
                    value={form.watch('bedrooms') || ''} 
                    onValueChange={(value) => form.setValue('bedrooms', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.bedrooms} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Studio</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bathrooms">{t.bathrooms}</Label>
                  <Select 
                    value={form.watch('bathrooms') || ''} 
                    onValueChange={(value) => form.setValue('bathrooms', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.bathrooms} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="furnished">{t.furnished}</Label>
                  <Select 
                    value={form.watch('furnished') || 'no'} 
                    onValueChange={(value: string) => form.setValue('furnished', value as BooleanValue)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.furnished} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t.yes}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                      <SelectItem value="partial">{t.partial}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year_built">Year Built</Label>
                  <Input 
                    id="year_built"
                    {...form.register('year_built')}
                    placeholder="2020"
                  />
                </div>

                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input 
                    id="floor"
                    {...form.register('floor')}
                    placeholder="2"
                  />
                </div>
              </div>

              {/* Rental-specific fields */}
              {(watchedType === 'rent' || watchedType === 'both') && (
                <>
                  <Separator />
                  <h3 className="text-lg font-semibold">Rental Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="available_from">Available From</Label>
                      <Input 
                        id="available_from"
                        type="date"
                        {...form.register('available_from')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="lease_duration">Lease Duration (months)</Label>
                      <Input 
                        id="lease_duration"
                        {...form.register('lease_duration')}
                        placeholder="12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="deposit">Security Deposit</Label>
                      <Input 
                        id="deposit"
                        {...form.register('deposit')}
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="max_occupants">Max Occupants</Label>
                      <Input 
                        id="max_occupants"
                        {...form.register('max_occupants')}
                        placeholder="4"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Sale-specific fields */}
              {(watchedType === 'sale' || watchedType === 'both') && (
                <>
                  <Separator />
                  <h3 className="text-lg font-semibold">Sale Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commission">Commission (%)</Label>
                      <Input 
                        id="commission"
                        {...form.register('commission')}
                        placeholder="2.5"
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Location */}
            <TabsContent value="location" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea 
                    id="address"
                    {...form.register('address')}
                    placeholder="Street address, building, etc."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      {...form.register('city')}
                      placeholder="Muscat"
                    />
                  </div>

                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Input 
                      id="region"
                      {...form.register('region')}
                      placeholder="Muscat Governorate"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input 
                    id="lat"
                    {...form.register('lat')}
                    placeholder="23.5859"
                  />
                </div>

                <div>
                  <Label htmlFor="lon">Longitude</Label>
                  <Input 
                    id="lon"
                    {...form.register('lon')}
                    placeholder="58.4059"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nearest_landmarks">Nearby Landmarks</Label>
                <Textarea 
                  id="nearest_landmarks"
                  {...form.register('nearest_landmarks')}
                  placeholder="Shopping mall, mosque, hospital..."
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Amenities */}
            <TabsContent value="amenities" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {([
                  { key: 'parking' as const, label: t.parking },
                  { key: 'garden' as const, label: t.garden },
                  { key: 'pool' as const, label: t.pool },
                  { key: 'elevator' as const, label: t.elevator },
                  { key: 'balcony' as const, label: t.balcony },
                  { key: 'storage' as const, label: t.storage },
                  { key: 'security' as const, label: t.security },
                  { key: 'gym' as const, label: t.gym },
                ] as const).map(({ key, label }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Select 
                      value={form.watch(key) || 'no'} 
                      onValueChange={(value: string) => form.setValue(key, value as BooleanValue)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">{t.yes}</SelectItem>
                        <SelectItem value="no">{t.no}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Additional amenities for rentals */}
              {(watchedType === 'rent' || watchedType === 'both') && (
                <>
                  <Separator />
                  <h3 className="text-lg font-semibold">Rental Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Utilities Included</Label>
                      <Select 
                        value={form.watch('utilities_included') || 'no'} 
                        onValueChange={(value: string) => form.setValue('utilities_included', value as BooleanValue)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{t.yes}</SelectItem>
                          <SelectItem value="no">{t.no}</SelectItem>
                          <SelectItem value="partial">{t.partial}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Internet Included</Label>
                      <Select 
                        value={form.watch('internet_included') || 'no'} 
                        onValueChange={(value: string) => form.setValue('internet_included', value as BooleanValue)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{t.yes}</SelectItem>
                          <SelectItem value="no">{t.no}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Maintenance Included</Label>
                      <Select 
                        value={form.watch('maintenance_included') || 'no'} 
                        onValueChange={(value: string) => form.setValue('maintenance_included', value as BooleanValue)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{t.yes}</SelectItem>
                          <SelectItem value="no">{t.no}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Pets Allowed</Label>
                      <Select 
                        value={form.watch('pets_allowed') || 'no'} 
                        onValueChange={(value: string) => form.setValue('pets_allowed', value as BooleanValue)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{t.yes}</SelectItem>
                          <SelectItem value="no">{t.no}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Smoking Allowed</Label>
                      <Select 
                        value={form.watch('smoking_allowed') || 'no'} 
                        onValueChange={(value: string) => form.setValue('smoking_allowed', value as BooleanValue)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{t.yes}</SelectItem>
                          <SelectItem value="no">{t.no}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Gender Preference</Label>
                      <Select 
                        value={form.watch('gender_preference') || 'any'} 
                        onValueChange={(value: string) => form.setValue('gender_preference', value as GenderPreference)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Contact */}
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">{t.phone}</Label>
                  <Input 
                    id="contact_phone"
                    {...form.register('contact_phone')}
                    placeholder="+968 9999 9999"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                  <Input 
                    id="contact_whatsapp"
                    {...form.register('contact_whatsapp')}
                    placeholder="+968 9999 9999"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="contact_email">{t.email}</Label>
                  <Input 
                    id="contact_email"
                    type="email"
                    {...form.register('contact_email')}
                    placeholder="contact@example.com"
                  />
                  {form.formState.errors.contact_email && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.contact_email.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="public_transport">Public Transport</Label>
                <Textarea 
                  id="public_transport"
                  {...form.register('public_transport')}
                  placeholder="Bus routes, taxi availability..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schools_nearby">Nearby Schools</Label>
                  <Textarea 
                    id="schools_nearby"
                    {...form.register('schools_nearby')}
                    placeholder="List nearby schools..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="hospitals_nearby">Nearby Hospitals</Label>
                  <Textarea 
                    id="hospitals_nearby"
                    {...form.register('hospitals_nearby')}
                    placeholder="List nearby hospitals..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="shopping_nearby">Shopping Centers</Label>
                  <Textarea 
                    id="shopping_nearby"
                    {...form.register('shopping_nearby')}
                    placeholder="List nearby shopping centers..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                {t.cancel}
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-24"
            >
              {isLoading ? t.loading : t.save}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}