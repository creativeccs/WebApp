import { useSeoMeta } from '@unhead/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdvancedSlideshow } from '@/components/AdvancedSlideshow';
import { useSlideshowImages } from '@/hooks/useSlideshowImages';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { useI18n } from '@/contexts/I18nContext';
import { Building, Users, Award, TrendingUp, ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1
  }
};

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
      description: t.realEstateServicesDesc,
    },
    {
      icon: Users,
      title: t.constructionServices,
      description: t.constructionServicesDescription,
    },
    {
      icon: Award,
      title: t.maintenanceServices,
      description: t.maintenanceServicesDesc,
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
      description: t.innovativeSolutionsDesc,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative">
        <AdvancedSlideshow 
          images={slideshowImages} 
          autoPlay={true}
          autoPlayInterval={6000}
          showNavigation={true}
          showPagination={true}
          className=""
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center text-white px-4 max-w-4xl"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl md:text-6xl font-bold mb-4"
            >
              {t.welcomeTo}
            </motion.h1>
            <motion.h2 
              variants={fadeInUp}
              className="text-xl md:text-3xl font-semibold mb-6 opacity-90"
            >
              {t.companyName}
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto"
            >
              {t.leadingCompany}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/properties">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-2xl">
                    {t.viewProjects}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.realEstateServices}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.companyDescription}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div key={index} variants={scaleIn}>
                  <motion.div
                    whileHover={{ 
                      y: -10,
                      transition: { type: 'spring', stiffness: 300 }
                    }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-shadow duration-300 border-2">
                      <CardHeader>
                        <motion.div 
                          className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="h-6 w-6 text-primary" />
                        </motion.div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      {!isLoadingProperties && featuredProperties && featuredProperties.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.properties}</h2>
              <p className="text-lg text-muted-foreground">
                {t.discover} {t.premium} {t.opportunities}
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
                  {t.viewAllProperties}
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
                {t.companyAbout}
              </p>
              <p className="text-muted-foreground">
                {t.companyGoal}
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
    </div>
  );
};

export default Index;
