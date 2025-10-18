import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { useI18n } from '@/contexts/I18nContext';
import { useProperty } from '@/hooks/useProperties';
import { useIsAdmin } from '@/hooks/useAdmin';
import { PropertyForm } from '@/components/PropertyForm';
import { ShareDialog } from '@/components/ShareDialog';
import { HTMLContent } from '@/components/HTMLContent';
import { PropertyMap } from '@/components/PropertyMap';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Car,
  TreePine,
  Waves,
  Shield,
  Dumbbell,
  ArrowLeft,
  Edit,
  Eye,
  Share2
} from 'lucide-react';

function PropertyDetailPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [api, setApi] = useState<CarouselApi>();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Re-initialize carousel when language changes (for RTL/LTR switch)
  useEffect(() => {
    if (!api) {
      return;
    }

    // Reapply direction and reinitialize carousel
    api.reInit();
  }, [api, language]);
  
  const { data: property, isLoading, error } = useProperty(propertyId || '');

  // Helper function to get localized text
  const getLocalizedTitle = () => {
    if (!property) return '';
    if (language === 'fa') return property.title_fa || property.title;
    if (language === 'ar') return property.title_ar || property.title;
    if (language === 'ru') return property.title_ru || property.title;
    return property.title_en || property.title;
  };

  const getLocalizedDescription = () => {
    if (!property) return '';
    if (language === 'fa') return property.description_fa || property.description;
    if (language === 'ar') return property.description_ar || property.description;
    if (language === 'ru') return property.description_ru || property.description;
    return property.description_en || property.description;
  };

  // Set page title
  useEffect(() => {
    if (property) {
      const localizedTitle = language === 'fa' 
        ? (property.title_fa || property.title)
        : language === 'ar'
        ? (property.title_ar || property.title)
        : language === 'ru'
        ? (property.title_ru || property.title)
        : (property.title_en || property.title);
      document.title = `${localizedTitle} - ${t.companyName}`;
    } else {
      document.title = `${t.propertyDetails} - ${t.companyName}`;
    }
  }, [property, t.companyName, t.propertyDetails, language]);

  if (!propertyId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Invalid property ID. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div className="h-10 bg-muted rounded w-32" />
              <div className="flex gap-2">
                <div className="h-9 bg-muted rounded w-20" />
                <div className="h-9 bg-muted rounded w-20" />
              </div>
            </div>

            {/* Main Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Property Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                  <div className="aspect-[16/9] bg-muted rounded-xl" />
                  {/* Thumbnails Skeleton */}
                  <div className="flex gap-3">
                    <div className="w-24 h-16 bg-muted rounded-lg" />
                    <div className="w-24 h-16 bg-muted rounded-lg" />
                    <div className="w-24 h-16 bg-muted rounded-lg" />
                    <div className="w-24 h-16 bg-muted rounded-lg" />
                  </div>
                </div>

                {/* Title and Stats Skeleton */}
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="h-16 bg-muted rounded" />
                    <div className="h-16 bg-muted rounded" />
                    <div className="h-16 bg-muted rounded" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                </div>

                {/* Description Card Skeleton */}
                <div className="h-48 bg-muted rounded-lg" />

                {/* Amenities Card Skeleton */}
                <div className="h-64 bg-muted rounded-lg" />

                {/* Additional Details Skeleton */}
                <div className="h-48 bg-muted rounded-lg" />
              </div>

              {/* Right Column - Contact Info */}
              <div className="space-y-6">
                <div className="h-80 bg-muted rounded-lg" />
                <div className="h-48 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">{t.error}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Property not found or failed to load.</p>
            <Button onClick={() => navigate('/properties')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back} to {t.properties}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showEditForm && isAdmin) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <PropertyForm
            property={property}
            onSuccess={() => setShowEditForm(false)}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    setShowShareDialog(true);
  };

  const amenityIcons = {
    parking: Car,
    garden: TreePine,
    pool: Waves,
    security: Shield,
    gym: Dumbbell,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/properties')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back} to {t.properties}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              {t.share}
            </Button>
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEditForm(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t.edit}
              </Button>
            )}
          </div>
        </div>


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Professional Image Gallery with Internal Controls */}
            {property.images && property.images.length > 0 && (
              <div className="space-y-4">
                <Carousel key={language} setApi={setApi} className="w-full relative group overflow-hidden rounded-xl">
                  <CarouselContent className="rounded-xl">
                    {property.images.map((image, index) => (
                      <CarouselItem key={index} className="rounded-xl">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black group">
                          <img
                            src={image.url}
                            alt={image.alt || `${property.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          {/* Image Counter Badge - RTL aware */}
                          <div className="absolute top-4 end-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                            {index + 1} / {property.images?.length || 0}
                          </div>
                          {/* Property Status Badge - RTL aware */}
                          <div className="absolute top-4 start-4">
                            <Badge 
                              variant={property.status === 'available' ? 'default' : 'secondary'}
                              className="text-sm px-3 py-1"
                            >
                              {property.status === 'available' ? t.available : 
                               property.status === 'sold' ? t.sold : 
                               property.status === 'rented' ? t.rented : t.pending}
                            </Badge>
                          </div>
                          {/* Navigation Arrows on Image - RTL aware */}
                          {property.images && property.images.length > 1 && (
                            <>
                              <button
                                onClick={() => api?.scrollPrev()}
                                className="absolute start-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 flex items-center justify-center"
                                title="Previous image"
                              >
                                <svg className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => api?.scrollNext()}
                                className="absolute end-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 flex items-center justify-center"
                                title="Next image"
                              >
                                <svg className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {/* Thumbnail Gallery */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-background">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      className="relative flex-shrink-0 w-24 h-16 rounded-lg border-2 border-muted overflow-hidden cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-md group"
                      onClick={() => {
                        api?.scrollTo(index);
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </button>
                  ))}
                </div>
              </div>
            )}



            {/* Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{getLocalizedTitle()}</h1>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-3xl font-bold text-primary mb-2" dir="ltr">
                    {property.price} {property.currency}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={property.type === 'sale' ? 'default' : 'secondary'}>
                      {property.type === 'sale' ? t.sale : property.type === 'rent' ? t.rent : t.both}
                    </Badge>
                    <Badge variant="outline">
                      {property.status === 'available' ? t.available : 
                       property.status === 'sold' ? t.sold :
                       property.status === 'rented' ? t.rented : t.pending}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium" dir="ltr">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">{t.bedrooms}</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium" dir="ltr">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">{t.bathrooms}</div>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium" dir="ltr">{property.area} m²</div>
                      <div className="text-sm text-muted-foreground">{t.area}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{property.category}</div>
                    <div className="text-sm text-muted-foreground">{t.category}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>{t.description}</CardTitle>
              </CardHeader>
              <CardContent>
                <HTMLContent content={getLocalizedDescription()} />
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>{t.amenities}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries({
                    parking: t.parking,
                    garden: t.garden,
                    pool: t.pool,
                    elevator: t.elevator,
                    balcony: t.balcony,
                    storage: t.storage,
                    security: t.security,
                    gym: t.gym,
                    furnished: t.furnished,
                  }).map(([key, label]) => {
                    const value = property[key as keyof typeof property];
                    if (value !== 'yes') return null;
                    
                    const IconComponent = amenityIcons[key];
                    
                    return (
                      <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            {(property.year_built || property.floor || property.total_floors) && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.additionalDetails}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {property.year_built && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.yearBuilt}:</span>
                      <span className="font-medium" dir="ltr">{property.year_built}</span>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.floor}:</span>
                      <span className="font-medium" dir="ltr">{property.floor}</span>
                    </div>
                  )}
                  {property.total_floors && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.totalFloors}:</span>
                      <span className="font-medium" dir="ltr">{property.total_floors}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Location Details */}
            {property.city && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.locationDetails}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.city}:</span>
                    <span className="font-medium">{property.city}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Property Location Map */}
            {(property.lat && property.lon) && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {language === 'fa' ? 'موقعیت ملک' : 'Property Location'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <PropertyMap
                      lat={parseFloat(property.lat)}
                      lon={parseFloat(property.lon)}
                      title={getLocalizedTitle()}
                      className="h-64 w-full rounded-none"
                    />
                    {/* Elegant overlay gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                  </div>
                  {/* Location info overlay */}
                  <div className="p-4 bg-muted/30 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                      {property.lat && property.lon && (
                        <span className="text-xs font-mono bg-background px-2 py-1 rounded border" dir="ltr">
                          {parseFloat(property.lat).toFixed(6)}, {parseFloat(property.lon).toFixed(6)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t.contactInformation}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                
                {property.contact_phone && (
                  <a 
                    href={`tel:${property.contact_phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium" dir="ltr">{property.contact_phone}</div>
                      <div className="text-sm text-muted-foreground">Call now</div>
                    </div>
                  </a>
                )}
                
                {property.contact_email && (
                  <a 
                    href={`mailto:${property.contact_email}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium" dir="ltr">{property.contact_email}</div>
                      <div className="text-sm text-muted-foreground">Send email</div>
                    </div>
                  </a>
                )}

                <Separator />

                <Link to="/contact" className="block">
                  <Button className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {t.sendMessage}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Property Info Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t.propertyDetails}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property ID:</span>
                  <span className="font-mono text-sm" dir="ltr">
                    {property.d.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed:</span>
                  <span className="font-medium" dir="ltr">
                    {new Date(property.created_at * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views:</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">-</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  {t.share} {t.property}
                </Button>
                <Link to="/properties" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t.viewAllProperties}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={getLocalizedTitle()}
        description={getLocalizedDescription()}
        url={window.location.href}
      />
    </div>
  );
}

export default PropertyDetailPage;