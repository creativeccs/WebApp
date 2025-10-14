import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useProperties } from '@/hooks/useProperties';
import { PropertyForm } from '@/components/PropertyForm';
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
  ArrowLeft
} from 'lucide-react';

function AdminPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const isAdmin = useIsAdmin();
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
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
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
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login with your admin account to access the dashboard.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
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
            <div>
              <h1 className="text-3xl font-bold mb-2">{t.adminPanel}</h1>
              <p className="opacity-90">
                Welcome back! Manage your properties and monitor system activity.
              </p>
            </div>
            <Button
              onClick={() => setShowAddProperty(true)}
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              {t.addProperty}
            </Button>
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
                <p className="text-sm text-muted-foreground">Total Properties</p>
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
                <p className="text-sm text-muted-foreground">Available</p>
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
                <p className="text-sm text-muted-foreground">Sold/Rented</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <Building className="h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500/10 p-2 rounded">
                        <Plus className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New property added</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500/10 p-2 rounded">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New contact message</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500/10 p-2 rounded">
                        <Edit className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Property updated</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start gap-2"
                    onClick={() => setShowAddProperty(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Property
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveTab('properties')}
                  >
                    <Building className="h-4 w-4" />
                    Manage Properties
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageCircle className="h-4 w-4" />
                    View Messages
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => navigate('/properties')}
                  >
                    <Eye className="h-4 w-4" />
                    View Public Site
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Property Management</h2>
              <Button onClick={() => setShowAddProperty(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Property
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
                  <p className="text-lg font-medium mb-4">No properties found</p>
                  <Button onClick={() => setShowAddProperty(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Property
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
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
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
              <h2 className="text-2xl font-bold">Contact Messages</h2>
            </div>

            <Alert>
              <MessageCircle className="h-4 w-4" />
              <AlertDescription>
                Contact messages from the website will appear here once the messaging system is fully integrated.
              </AlertDescription>
            </Alert>

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No messages yet</p>
                <p className="text-muted-foreground text-center max-w-md">
                  When visitors send messages through the contact form, they will appear here for you to review and respond.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPage;