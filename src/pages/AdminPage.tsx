import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useProperties } from '@/hooks/useProperties';
import { useAuthor } from '@/hooks/useAuthor';
import { useLoginActions } from '@/hooks/useLoginActions';
import { PropertyForm } from '@/components/PropertyForm';
import { EditProfileForm } from '@/components/EditProfileForm';
import { 
  Building, 
  MessageCircle, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowLeft,
  LogOut,
  Settings,
  User,
  Bell,
  Shield,
  Activity
} from 'lucide-react';

function AdminPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { logout } = useLoginActions();
  const author = useAuthor(user?.pubkey || '');
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: properties, isLoading: propertiesLoading } = useProperties();

  // Set page title
  document.title = `${t.admin} Dashboard - ${t.companyName}`;

  // Redirect if not admin
  if (!isAdmin && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center text-center py-8">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.accessDenied}</h2>
            <p className="text-muted-foreground mb-6">
              {t.noPermission}
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center text-center py-8">
            <Users className="h-16 w-16 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.loginRequired2}</h2>
            <p className="text-muted-foreground mb-6">
              {t.pleaseLoginAdmin}
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAddProperty) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <PropertyForm
            onSuccess={() => setShowAddProperty(false)}
            onCancel={() => setShowAddProperty(false)}
          />
        </div>
      </div>
    );
  }

  const stats = {
    totalProperties: properties?.length || 0,
    availableProperties: properties?.filter(p => p.status === 'available').length || 0,
    soldRentedProperties: properties?.filter(p => p.status === 'sold' || p.status === 'rented').length || 0,
    pendingProperties: properties?.filter(p => p.status === 'pending').length || 0
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary-foreground/20">
                <AvatarImage src={author.data?.metadata?.picture} alt={author.data?.metadata?.name || 'Admin'} />
                <AvatarFallback>
                  {author.data?.metadata?.name?.[0]?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">{t.adminPanel}</h1>
                <p className="opacity-90">
                  {t.welcomeBack}, {author.data?.metadata?.name || author.data?.metadata?.display_name || 'Admin'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowAddProperty(true)}
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                {t.addProperty}
              </Button>
              <Button
                onClick={() => {
                  if (window.confirm(`${t.logout}?`)) {
                    logout();
                    navigate('/');
                  }
                }}
                size="lg"
                variant="outline"
                className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-blue-500/10 p-3 rounded-lg mr-4">
                <Building className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalProperties}</p>
                <p className="text-sm text-muted-foreground">{t.totalPropertiesLabel}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-green-500/10 p-3 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.availableProperties}</p>
                <p className="text-sm text-muted-foreground">{t.available}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-purple-500/10 p-3 rounded-lg mr-4">
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.soldRentedProperties}</p>
                <p className="text-sm text-muted-foreground">{t.soldRented}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-orange-500/10 p-3 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingProperties}</p>
                <p className="text-sm text-muted-foreground">{t.pending}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              {t.overview}
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <Building className="h-4 w-4" />
              {t.properties}
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {t.messages}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              {t.settings}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.recentActivity}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500/10 p-2 rounded">
                        <Plus className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t.newPropertyAdded}</p>
                        <p className="text-xs text-muted-foreground">{t.hoursAgo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500/10 p-2 rounded">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t.newContactMessage}</p>
                        <p className="text-xs text-muted-foreground">4 {t.hoursAgo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500/10 p-2 rounded">
                        <Edit className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t.propertyUpdated}</p>
                        <p className="text-xs text-muted-foreground">{t.dayAgo}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.quickActions}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start gap-2"
                    onClick={() => setShowAddProperty(true)}
                  >
                    <Plus className="h-4 w-4" />
                    {t.addNewProperty}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveTab('properties')}
                  >
                    <Building className="h-4 w-4" />
                    {t.manageProperties}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t.viewMessages}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => navigate('/properties')}
                  >
                    <Eye className="h-4 w-4" />
                    {t.viewPublicSite}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.propertyManagement}</h2>
              <Button onClick={() => setShowAddProperty(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                {t.addProperty}
              </Button>
            </div>

            {propertiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : !properties || properties.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Building className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-4">{t.noPropertiesFound}</p>
                  <Button onClick={() => setShowAddProperty(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t.addYourFirstProperty}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    {property.images && property.images.length > 0 && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={property.images[0].url}
                          alt={property.images[0].alt || property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                      <p className="text-muted-foreground text-sm line-clamp-1">{property.location}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-primary">
                          {property.price} {property.currency}
                        </span>
                        <Badge variant="outline">{property.category}</Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <Eye className="h-3 w-3" />
                          {t.view}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <Edit className="h-3 w-3" />
                          {t.edit}
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.contactMessages}</h2>
            </div>

            <Alert>
              <MessageCircle className="h-4 w-4" />
              <AlertDescription>
                {t.contactMessagesWillAppear}
              </AlertDescription>
            </Alert>

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">{t.noMessagesYet}</p>
                <p className="text-muted-foreground text-center max-w-md">
                  {t.whenVisitorsSend}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Settings */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <CardTitle>{t.profileSettings || 'Profile Settings'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EditProfileForm />
                  </CardContent>
                </Card>

                {/* System Settings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      <CardTitle>{t.systemSettings || 'System Settings'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notifications">{t.notifications || 'Notifications'}</Label>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{t.emailNotifications || 'Email Notifications'}</span>
                        </div>
                        <Badge variant="outline">{t.enabled || 'Enabled'}</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>{t.security || 'Security'}</Label>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{t.twoFactorAuth || 'Two-Factor Authentication'}</span>
                        </div>
                        <Badge variant="secondary">{t.notConfigured || 'Not Configured'}</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>{t.dataManagement || 'Data Management'}</Label>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Activity className="h-4 w-4" />
                          {t.exportData || 'Export All Data'}
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          {t.deleteAccount || 'Delete Account'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Info Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.adminInfo || 'Admin Information'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={author.data?.metadata?.picture} alt={author.data?.metadata?.name || 'Admin'} />
                        <AvatarFallback className="text-2xl">
                          {author.data?.metadata?.name?.[0]?.toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {author.data?.metadata?.name || author.data?.metadata?.display_name || 'Administrator'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {author.data?.metadata?.nip05 || user?.pubkey.slice(0, 8) + '...'}
                        </p>
                      </div>
                      <Badge variant="default" className="gap-1">
                        <Shield className="h-3 w-3" />
                        {t.admin}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.role || 'Role'}:</span>
                        <span className="font-medium">{t.admin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.propertiesManaged || 'Properties'}:</span>
                        <span className="font-medium">{stats.totalProperties}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.status}:</span>
                        <Badge variant="default" className="h-5 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t.active || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.quickStats || 'Quick Stats'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t.totalViews || 'Total Views'}</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t.thisWeek || 'This Week'}</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t.inquiries || 'Inquiries'}</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPage;