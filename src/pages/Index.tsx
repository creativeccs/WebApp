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
      title: 'Real Estate Services',
      description: 'We offer a variety of real estate opportunities, in Oman to Omani nationals and foreigners. We provide renting and the sale of properties including freehold properties with permanent residence. Additionally, we provide Property Management services.',
      image: '/images/services/real-estate.jpg'
    },
    {
      icon: Users,
      title: 'Construction Services',
      description: 'We are highly experienced in the construction of residential villas and commercial buildings. In addition to this, we offer demolition, renovation, and refurbishment of antiquated properties.',
      image: '/images/services/construction.jpg'
    },
    {
      icon: Award,
      title: 'Maintenance Services',
      description: 'We engage in comprehensive maintenance of buildings including building completion tasks such as finishing work, electrical work, plumbing, interior decoration, and paint work.',
      image: '/images/services/maintenance.jpg'
    },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Our services stand out through market analysis and data collection, consistently aligning with investor expectations.',
    },
    {
      icon: Building,
      title: 'Modern Construction Methods',
      description: 'The application of modern methods of construction in line with client\'s needs to deliver a long-lasting property.',
    },
    {
      icon: Award,
      title: 'Innovative Solutions',
      description: 'We provide smart and various options in both the field of construction and real estate.',
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-black/60 via-black/40 to-transparent">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center text-white px-4 max-w-5xl"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
            >
              Welcome To
            </motion.h1>
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl md:text-4xl font-bold mb-8 text-primary"
            >
              Creative Construction Solution
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed"
            >
              Leading construction and real estate development in the Sultanate of Oman
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-2xl px-8 py-4 text-lg">
                    View Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm px-8 py-4 text-lg">
                    Contact Us
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHO ARE WE Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              WHO ARE WE?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A leading real estate company in Sultanate of Oman, dedicated to excellence and innovation in property services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-semibold">
                      01
                    </div>
                    Decade of Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Over 10 years of proven expertise in the Omani real estate market, delivering exceptional results and building lasting relationships.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-semibold">
                      02
                    </div>
                    Innovation Driven
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Leveraging cutting-edge technology and modern approaches to provide seamless property solutions that exceed expectations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-semibold">
                      03
                    </div>
                    Complete Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From property sales and rentals to management and consultation, we offer comprehensive services under one roof.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <img 
                src="/images/logo.png" 
                alt="Creative CCS Modern Office in Oman"
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <p className="text-sm text-muted-foreground">Years of Excellence</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Successful Projects</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
              </CardContent>
            </Card>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive services tailored to meet your needs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full"
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div key={index} variants={scaleIn} className="flex h-full">
                  <motion.div
                    whileHover={{ 
                      y: -10,
                      transition: { type: 'spring', stiffness: 300 }
                    }}
                    className="flex-1"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden group bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                      {/* Service Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <motion.div 
                          className="absolute top-4 left-4 w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.8 }}
                        >
                          <IconComponent className="h-7 w-7 text-white drop-shadow-lg" />
                        </motion.div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                      </div>
                      
                      <div className="flex flex-col h-full p-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                            {service.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 flex flex-col justify-between">
                          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                            {service.description}
                          </CardDescription>
                          <div className="mt-6 flex justify-end">
                            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Key features of our services and operations.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div key={index} variants={scaleIn}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      transition: { type: 'spring', stiffness: 300 }
                    }}
                    className="text-center p-8 rounded-2xl bg-background hover:shadow-xl transition-all duration-300"
                  >
                    <motion.div 
                      className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center lg:text-left"
            >
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading force in shaping Oman's skyline and communities, pioneering innovative and sustainable 
                  construction and real estate solutions that enhance the quality of life and drive economic growth. We aspire 
                  to set new standards of excellence through our commitment to integrity, cutting-edge technology, and a deep 
                  respect for Oman's rich heritage and natural environment.
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center lg:text-left"
            >
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize property development and real estate in Oman by delivering scientific and specialized 
                  solutions that blend innovation with functionality. We are dedicated to transforming visions into reality 
                  through our expertise, advanced technology, and commitment to sustainability. Our mission is to create 
                  exceptional spaces that meet the evolving needs of our clients and contribute to the growth and prosperity 
                  of our communities.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supporting Oman Vision 2040 Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center lg:text-left"
            >
              <div className="w-20 h-20 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-8">
                <TrendingUp className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-800 dark:text-emerald-200">
                Supporting Oman Vision 2040
              </h2>
              <p className="text-lg text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Our objectives align with the vision of Oman to meet the modern renaissance requirements. 
                We are committed to contributing to the economic diversification and sustainable development 
                goals outlined in Oman Vision 2040, creating value for our community and the nation.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/images/oman-vision-2040.webp" 
                  alt="Modern development supporting Oman Vision 2040"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-200/20 rounded-full blur-xl"></div>
            </motion.div>
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

      {/* Partners Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-muted-foreground">
              Our Trusted Partners
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Collaborating with leading companies in Oman to deliver exceptional results
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            {[
              { src: "/images/partners/client-1.png", alt: "" },
              { src: "/images/partners/client-2.png", alt: "" },
              { src: "/images/partners/client-3.png", alt: "" },
              { src: "/images/partners/client-4.png", alt: "" },
              { src: "/images/partners/client-5.png", alt: "" },
              { src: "/images/partners/client-6.png", alt: "" }
            ].map((partner, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.1,
                  transition: { type: 'spring', stiffness: 300 }
                }}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <img 
                  src={partner.src} 
                  alt={partner.alt}
                  className="h-16 w-auto max-w-[120px] object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
