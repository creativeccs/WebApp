import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/contexts/I18nContext';
import { 
  Building, 
  Users, 
  Award, 
  Target,
  Eye,
  Heart,
  Shield,
  Zap,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

function AboutPage() {
  const { t } = useI18n();

  // Set page title
  document.title = `${t.about} - ${t.companyName}`;

  const stats = [
    { icon: Building, value: '500+', label: t.projectsCompleted },
    { icon: Users, value: '1000+', label: t.happyClients },
    { icon: Award, value: '15+', label: t.yearsExperience },
    { icon: MapPin, value: '50+', label: t.locationsServed }
  ];

  const services = [
    {
      icon: Building,
      title: t.realEstateDevelopment,
      description: t.realEstateDevelopmentDesc
    },
    {
      icon: Shield,
      title: t.constructionServicesTitle,
      description: t.constructionServicesDesc
    },
    {
      icon: Zap,
      title: t.propertyManagementTitle,
      description: t.propertyManagementDesc
    },
    {
      icon: Target,
      title: t.investmentConsulting,
      description: t.investmentConsultingDesc
    }
  ];

  const values = [
    {
      icon: Shield,
      title: t.integrity,
      description: t.integrityDesc
    },
    {
      icon: Award,
      title: t.excellence,
      description: t.excellenceDesc
    },
    {
      icon: Users,
      title: t.collaboration,
      description: t.collaborationDesc
    },
    {
      icon: Zap,
      title: t.innovation,
      description: t.innovationDesc
    }
  ];

  const timeline = [
    {
      year: '2008',
      title: t.companyFounded,
      description: t.companyFoundedDesc
    },
    {
      year: '2012',
      title: t.majorExpansion,
      description: t.majorExpansionDesc
    },
    {
      year: '2016',
      title: t.awardRecognition,
      description: t.awardRecognitionDesc
    },
    {
      year: '2020',
      title: t.digitalTransformation,
      description: t.digitalTransformationDesc
    },
    {
      year: '2024',
      title: t.vision2040Alignment,
      description: t.vision2040AlignmentDesc
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.about} {t.companyName}</h1>
            <p className="text-lg opacity-90 mb-8">
              {t.companyDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                {t.est2008}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                {t.muscatOman}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t.vision}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t.companyVision}
              </p>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t.mission}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t.companyMission}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.ourServices}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.comprehensiveSolutions}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.ourValues}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.principlesGuide}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.ourJourney}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.keyMilestones}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-8 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shrink-0">
                    {item.year}
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.leadershipTeam}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.meetProfessionals}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ahmed Al-Rashid</h3>
                <p className="text-primary font-medium mb-2">{t.founderCEO}</p>
                <p className="text-muted-foreground text-sm">
                  {t.founderCEODesc}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sarah Mohammed</h3>
                <p className="text-primary font-medium mb-2">{t.chiefOperationsOfficer}</p>
                <p className="text-muted-foreground text-sm">
                  {t.chiefOperationsOfficerDesc}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Khalid Al-Balushi</h3>
                <p className="text-primary font-medium mb-2">{t.headConstruction}</p>
                <p className="text-muted-foreground text-sm">
                  {t.headConstructionDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12">
              <Heart className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">{t.readyToBuildYourFuture}</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {t.buyingSelling}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Phone className="h-4 w-4" />
                    {t.contactUs}
                  </Button>
                </Link>
                <Link to="/properties">
                  <Button size="lg" variant="outline" className="gap-2 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <Building className="h-4 w-4" />
                    {t.viewProperties}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;