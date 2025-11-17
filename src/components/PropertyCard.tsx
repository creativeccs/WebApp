import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Square, MapPin, Car, TreePine, Waves } from 'lucide-react';
import type { Property } from '@/lib/types/property';

interface PropertyCardProps {
  property: Property;
  /** Localized title */
  title?: string;
  /** Show action buttons (for admin) */
  actions?: React.ReactNode;
  /** Translation function */
  t: {
    sale: string;
    rent: string;
    both: string;
    available: string;
    sold: string;
    rented: string;
    pending: string;
    view: string;
    propertyDetails: string;
  };
}

export function PropertyCard({ property, title, actions, t }: PropertyCardProps) {
  const displayTitle = title || property.title;
  const mainImage = property.images?.find(img => img.isMain) || property.images?.[0];
  
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Image Section - Clickable */}
      {property.images && property.images.length > 0 && mainImage && (
        <Link to={`/property/${property.d}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={mainImage.url}
              alt={mainImage.alt || property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              <Badge 
                variant={property.type === 'sale' ? 'default' : 'secondary'}
                className="shadow-lg backdrop-blur-sm"
              >
                {property.type === 'sale' ? t.sale : property.type === 'rent' ? t.rent : t.both}
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-background/95 backdrop-blur-sm shadow-lg"
              >
                {property.status === 'available' ? t.available : 
                 property.status === 'sold' ? t.sold :
                 property.status === 'rented' ? t.rented : t.pending}
              </Badge>
            </div>
            
            {/* Bottom amenity icons */}
            {(property.parking === 'yes' || property.garden === 'yes' || property.pool === 'yes') && (
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                {property.parking === 'yes' && (
                  <div className="bg-background/95 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
                    <Car className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                {property.garden === 'yes' && (
                  <div className="bg-background/95 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
                    <TreePine className="h-3.5 w-3.5 text-green-600" />
                  </div>
                )}
                {property.pool === 'yes' && (
                  <div className="bg-background/95 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
                    <Waves className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                )}
              </div>
            )}
          </div>
        </Link>
      )}
      
      {/* Content Section */}
      <CardHeader className="pb-3 flex-grow">
        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
          {displayTitle}
        </CardTitle>
        <div className="flex items-center text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col gap-4">
        {/* Price and Category */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {property.price} {property.currency}
          </span>
          <Badge variant="outline" className="font-medium">
            {property.category}
          </Badge>
        </div>
        
        {/* Property Details */}
        <div className="flex items-center justify-around text-sm text-muted-foreground border-t border-b py-3">
          {property.bedrooms && (
            <div className="flex flex-col items-center gap-1">
              <Bed className="h-4 w-4" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex flex-col items-center gap-1">
              <Bath className="h-4 w-4" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
          )}
          {property.area && (
            <div className="flex flex-col items-center gap-1">
              <Square className="h-4 w-4" />
              <span className="font-medium">{property.area}m²</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        {actions ? (
          <div className="flex gap-2">
            {actions}
          </div>
        ) : (
          <Link to={`/property/${property.d}`} className="w-full">
            <Button variant="default" className="w-full font-medium">
              {t.view} {t.propertyDetails}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
