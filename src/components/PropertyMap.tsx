import { MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyMapProps {
  lat?: number;
  lon?: number;
  coordinates?: { lat: number; lon: number };
  title?: string;
  price?: string;
  currency?: string;
  type?: string;
  className?: string;
  zoom?: number;
  height?: string;
  showPopup?: boolean;
}

export function PropertyMap({
  lat: propLat,
  lon: propLon,
  coordinates,
  title,
  price,
  currency = 'OMR',
  type,
  className = '',
  zoom = 15,
  height: _height = '400px',
  showPopup = true,
}: PropertyMapProps) {
  // Extract coordinates from either props or coordinates object
  const lat = propLat ?? coordinates?.lat;
  const lon = propLon ?? coordinates?.lon;
  
  // Validate coordinates
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8 h-96">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>موقعیت جغرافیایی در دسترس نیست</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}&z=${zoom}`;
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="w-full h-96 relative">
          {/* Google Maps Embed - Works without API key */}
          <iframe
            src={`https://www.google.com/maps?q=${lat},${lon}&z=${zoom}&output=embed`}
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`نقشه ${title || 'ملک'}`}
            className="w-full h-full border-0"
          />
          
          {/* Property Info Overlay */}
          {showPopup && (title || price) && (
            <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-xs">
              {title && (
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {title}
                </h3>
              )}
              {price && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-primary">
                    {price} {currency}
                  </span>
                  {type && (
                    <Badge variant={type === 'sale' ? 'destructive' : 'default'}>
                      {type === 'sale' ? 'فروش' : type === 'rent' ? 'اجاره' : 'هر دو'}
                    </Badge>
                  )}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(googleMapsUrl, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                مشاهده در گوگل مپ
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Simple PropertiesMap for multiple properties
export function PropertiesMap() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center p-8 h-96">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p>نقشه چندین ملک در حال توسعه است</p>
        </div>
      </CardContent>
    </Card>
  );
}
