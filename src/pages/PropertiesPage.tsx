import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RelaySelector } from '@/components/RelaySelector';
import { useI18n } from '@/contexts/I18nContext';
import { useProperties, usePropertyFilterOptions } from '@/hooks/useProperties';
import { useIsAdmin } from '@/hooks/useAdmin';
import { PropertyForm } from '@/components/PropertyForm';
import type { PropertyFilter } from '@/lib/types/property';
import type { Property } from '@/lib/types/property';
import { 
  Search, 
  Plus, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  TreePine, 
  Waves,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

function PropertiesPage() {
  const { t, language } = useI18n();
  const isAdmin = useIsAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFilter>({});
  
  const { data: properties, isLoading, error } = useProperties(filters);
  const filterOptions = usePropertyFilterOptions();

  // Set page title
  document.title = `${t.properties} - ${t.companyName}`;

  // Helper function to get localized text
  const getLocalizedText = (property: Property, field: 'title' | 'description') => {
    if (language === 'fa') {
      return field === 'title' ? (property.title_fa || property.title) : (property.description_fa || property.description);
    } else if (language === 'ar') {
      return field === 'title' ? (property.title_ar || property.title) : (property.description_ar || property.description);
    } else if (language === 'ru') {
      return field === 'title' ? (property.title_ru || property.title) : (property.description_ru || property.description);
    }
    return field === 'title' ? (property.title_en || property.title) : (property.description_en || property.description);
  };

  const handleFilterChange = (key: keyof PropertyFilter, value: string | number | boolean | PropertyFilter['amenities'] | string[] | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof PropertyFilter];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : value !== '');
  });

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <PropertyForm
            onSuccess={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.properties}</h1>
              <p className="text-lg opacity-90 max-w-2xl">
                {t.discoverPremium}. {t.fromLuxuryVillas}.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowAddForm(true)}
                size="lg"
                variant="secondary"
                className="hidden md:flex"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t.addProperty}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Add Button */}
        {isAdmin && (
          <div className="md:hidden mb-6">
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="w-full"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t.addProperty}
            </Button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${t.search} properties...`}
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 text-base"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t.filter}
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 px-1 text-xs">
                      {Object.keys(filters).filter(key => {
                        const value = filters[key as keyof PropertyFilter];
                        return Array.isArray(value) ? value.length > 0 : value;
                      }).length}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t.filter} {t.properties}</CardTitle>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="h-4 w-4 mr-1" />
                          {t.clear}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t.type}</label>
                        <Select
                          value={filters.type?.[0] || ''}
                          onValueChange={(value) => handleFilterChange('type', value ? [value] : [])}
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
                        <label className="text-sm font-medium mb-2 block">{t.category}</label>
                        <Select
                          value={filters.category?.[0] || ''}
                          onValueChange={(value) => handleFilterChange('category', value ? [value] : [])}
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
                        <label className="text-sm font-medium mb-2 block">{t.bedrooms}</label>
                        <Select
                          value={filters.bedrooms?.[0] || ''}
                          onValueChange={(value) => handleFilterChange('bedrooms', value ? [value] : [])}
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
                        <label className="text-sm font-medium mb-2 block">{t.location}</label>
                        <Select
                          value={filters.city?.[0] || ''}
                          onValueChange={(value) => handleFilterChange('city', value ? [value] : [])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t.location} />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.cities.map((city) => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t.price} Range</label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          placeholder="Min price"
                          value={filters.minPrice || ''}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                        />
                        <Input
                          type="number"
                          placeholder="Max price"
                          value={filters.maxPrice || ''}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Amenities</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { key: 'parking', label: t.parking, icon: Car },
                          { key: 'garden', label: t.garden, icon: TreePine },
                          { key: 'pool', label: t.pool, icon: Waves },
                          { key: 'gym', label: t.gym, icon: null },
                          { key: 'elevator', label: t.elevator, icon: null },
                          { key: 'security', label: t.security, icon: null },
                          { key: 'balcony', label: t.balcony, icon: null },
                          { key: 'furnished', label: t.furnished, icon: null },
                        ].map(({ key, label, icon: Icon }) => (
                          <label key={key} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.amenities?.[key as keyof typeof filters.amenities] || false}
                              onChange={(e) => {
                                const newAmenities = { ...filters.amenities };
                                newAmenities[key as keyof typeof newAmenities] = e.target.checked;
                                handleFilterChange('amenities', newAmenities);
                              }}
                              className="rounded"
                            />
                            <div className="flex items-center space-x-1">
                              {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                              <span className="text-sm">{label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-8 bg-muted rounded" />
                    <div className="flex space-x-4">
                      <div className="h-4 bg-muted rounded w-12" />
                      <div className="h-4 bg-muted rounded w-12" />
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium text-destructive mb-2">
                {t.error}
              </p>
              <p className="text-muted-foreground text-center max-w-md">
                Failed to load properties. Please try again.
              </p>
            </CardContent>
          </Card>
        ) : !properties || properties.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium mb-4">
                {t.noPropertiesFound}
              </p>
              <RelaySelector />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {properties.length} {properties.length === 1 ? t.property : t.propertiesFound}
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
              const localizedTitle = getLocalizedText(property, 'title');
              
              // Find main image or fallback to first image
              const mainImage = property.images?.find(img => img.isMain) || property.images?.[0];
              
              return (
                <Card key={property.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {property.images && property.images.length > 0 && mainImage && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={mainImage.url}
                        alt={mainImage.alt || property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge variant={property.type === 'sale' ? 'default' : 'secondary'}>
                          {property.type === 'sale' ? t.sale : property.type === 'rent' ? t.rent : t.both}
                        </Badge>
                        <Badge variant="outline" className="bg-background/90">
                          {property.status === 'available' ? t.available : 
                           property.status === 'sold' ? t.sold :
                           property.status === 'rented' ? t.rented : t.pending}
                        </Badge>
                      </div>
                      {/* Amenities Icons */}
                      <div className="absolute bottom-2 right-2 flex space-x-1">
                        {property.parking === 'yes' && (
                          <div className="bg-background/90 p-1 rounded">
                            <Car className="h-3 w-3" />
                          </div>
                        )}
                        {property.garden === 'yes' && (
                          <div className="bg-background/90 p-1 rounded">
                            <TreePine className="h-3 w-3" />
                          </div>
                        )}
                        {property.pool === 'yes' && (
                          <div className="bg-background/90 p-1 rounded">
                            <Waves className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl line-clamp-1">{localizedTitle}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm line-clamp-1">{property.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {property.price} {property.currency}
                      </span>
                      <Badge variant="outline">{property.category}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span>{property.area}m²</span>
                        </div>
                      )}
                    </div>
                    
                    <Link to={`/property/${property.d}`}>
                      <Button variant="outline" className="w-full">
                        {t.view} {t.propertyDetails}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PropertiesPage;