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
import { useCreateProperty, useUpdateProperty } from '@/hooks/usePropertyManagement';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdmin } from '@/hooks/useAdmin';
import type { PropertyFormData, Property } from '@/lib/types/property';

// Validation schema
const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  
  const isEditing = !!property;
  const isLoading = createProperty.isPending || updateProperty.isPending;

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      description: property?.description || '',
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
      const formData = {
        ...data,
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? t.editProperty : t.addProperty}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

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
                    onValueChange={(value: any) => form.setValue('type', value)}
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
                    onValueChange={(value: any) => form.setValue('category', value)}
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
                    onValueChange={(value: any) => form.setValue('status', value)}
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
                      onValueChange={(value: any) => form.setValue('currency', value)}
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

              {/* Images */}
              <div>
                <Label>{t.propertyImages}</Label>
                <div className="mt-2">
                  <Label 
                    htmlFor="images" 
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload images
                      </p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </Label>
                </div>
                
                {selectedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <Badge variant="secondary" className="pr-8">
                          {image.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
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
                    onValueChange={(value: any) => form.setValue('furnished', value)}
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
                {[
                  { key: 'parking', label: t.parking },
                  { key: 'garden', label: t.garden },
                  { key: 'pool', label: t.pool },
                  { key: 'elevator', label: t.elevator },
                  { key: 'balcony', label: t.balcony },
                  { key: 'storage', label: t.storage },
                  { key: 'security', label: t.security },
                  { key: 'gym', label: t.gym },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Select 
                      value={form.watch(key as any) || 'no'} 
                      onValueChange={(value: any) => form.setValue(key as any, value)}
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
                        onValueChange={(value: any) => form.setValue('utilities_included', value)}
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
                        onValueChange={(value: any) => form.setValue('internet_included', value)}
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
                        onValueChange={(value: any) => form.setValue('maintenance_included', value)}
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
                        onValueChange={(value: any) => form.setValue('pets_allowed', value)}
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
                        onValueChange={(value: any) => form.setValue('smoking_allowed', value)}
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
                        onValueChange={(value: any) => form.setValue('gender_preference', value)}
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