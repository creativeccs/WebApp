import { useSeoMeta } from '@unhead/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slideshow } from '@/components/Slideshow';
import { useSlideshowImages } from '@/hooks/useSlideshowImages';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { useI18n } from '@/contexts/I18nContext';
import { Building, Users, Award, TrendingUp, ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useI18n();
  const slideshowImages = useSlideshowImages();
  const { data: featuredProperties, isLoading: isLoadingProperties } = useFeaturedProperties(6);

  useSeoMeta({
    title: `${t.welcomeTo} ${t.companyName}`,
    description: t.companyDescription,
  });

  const services = [
    {
      icon: Building,
      title: t.realEstateServices,
      description: 'We offer a variety of real estate opportunities in Oman to Omani nationals and foreigners. We provide renting and the sale of properties including freehold properties with permanent residence.',
    },
    {
      icon: Users,
      title: t.constructionServices,
      description: 'We are highly experienced in the construction of residential villas and commercial buildings. In addition to this, we offer demolition, renovation, and refurbishment of antiquated properties.',
    },
    {
      icon: Award,
      title: t.maintenanceServices,
      description: 'We engage in comprehensive maintenance of buildings including building completion tasks such as finishing work, electrical work, plumbing, interior decoration, and paint work.',
    },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: t.marketAnalysis,
      description: 'Our services stand out through market analysis and data collection, consistently aligning with investor expectations.',
    },
    {
      icon: Building,
      title: t.constructionServices,
      description: 'The application of modern methods of construction in line with client\'s needs to deliver a long-lasting property.',
    },
    {
      icon: Award,
      title: t.innovativeSolutions,
      description: 'We provide smart and various options in both the field of construction and real estate.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative">
        <Slideshow 
          images={slideshowImages} 
          className="h-[60vh] md:h-[70vh]"
          autoPlay={true}
          autoPlayInterval={6000}
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-3xl md:text-6xl font-bold mb-4">
              {t.welcomeTo}
            </h1>
            <h2 className="text-xl md:text-3xl font-semibold mb-6 opacity-90">
              {t.companyName}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto">
              {t.leadingCompany}
            </p>
            <Link to="/properties">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {t.viewProjects}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.realEstateServices}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.companyDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      {!isLoadingProperties && featuredProperties && featuredProperties.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.properties}</h2>
              <p className="text-lg text-muted-foreground">
                Discover our latest property offerings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {property.images && property.images.length > 0 && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={property.images[0].url}
                        alt={property.images[0].alt || property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant={property.type === 'sale' ? 'default' : 'secondary'}>
                          {property.type === 'sale' ? t.sale : property.type === 'rent' ? t.rent : t.both}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">{property.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary">
                        {property.price} {property.currency}
                      </span>
                      <Badge variant="outline">{property.category}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                    
                    <Link to={`/property/${property.d}`} className="mt-4 block">
                      <Button variant="outline" className="w-full">
                        {t.view} {t.propertyDetails}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/properties">
                <Button size="lg" variant="outline">
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Company Info Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.whoAreWe}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">{t.companyName}</h3>
              <p className="text-lg text-muted-foreground mb-6">
                {t.companyDescription}
              </p>
              <p className="text-muted-foreground mb-6">
                A company specialized in the implementation of construction projects and real estate management. Creative Construction Solution is one of the leading companies in the field of construction and real estate. The company was established with a strong foundation of over 10 years of experience and is distinguished by providing comprehensive services to its clients, both individual and corporate.
              </p>
              <p className="text-muted-foreground">
                The company seeks to meet the needs of its clients effectively through providing specialized and innovative solutions in enhancing their success in growing their business.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.vision}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.companyVision}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.mission}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.companyMission}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.features}</h2>
            <p className="text-lg text-muted-foreground">
              {t.keyFeatures}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supporting Oman Vision 2040 */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.supportingVision}</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Our objectives align with the vision of Oman to meet the modern renaissance requirements.
          </p>
        </div>
      </section>

      {/* Footer Credit */}
      <section className="py-8 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Vibed with{' '}
            <a 
              href="https://soapbox.pub/mkstack" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              MKStack
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
