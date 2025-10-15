import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeoMeta } from '@unhead/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoginArea } from '@/components/auth/LoginArea';
import { PropertyForm } from '@/components/PropertyForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useI18n } from '@/contexts/I18nContext';
import { useProperties } from '@/hooks/useProperties';
import { useContactMessages } from '@/hooks/useAdmin';
import { useDeleteProperty } from '@/hooks/usePropertyManagement';
import { Skeleton } from '@/components/ui/skeleton';
import type { ContactMessage, Property } from '@/lib/types/property';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Settings, 
  MessageCircle, 
  Building, 
  Users, 
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  TrendingUp,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 }
};

export default function Admin() {
  const { t, language } = useI18n();
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('properties');
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Helper function to get localized text
  const getLocalizedText = (property: Property, field: 'title' | 'description') => {
    if (language === 'fa') {
      return field === 'title' ? (property.title_fa || property.title) : (property.description_fa || property.description);
    } else if (language === 'ar') {
      return field === 'title' ? (property.title_ar || property.title) : (property.description_ar || property.description);
    }
    return field === 'title' ? (property.title_en || property.title) : (property.description_en || property.description);
  };

  // Fetch properties
  const { data: properties = [], isLoading: isLoadingProperties } = useProperties({});

  // Fetch contact messages
  const { data: messages = [], isLoading: isLoadingMessages } = useContactMessages();

  // Delete property mutation
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();

  useSeoMeta({
    title: `${t.admin} - ${t.companyName}`,
    description: 'Admin panel for Creative Construction Services',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                >
                  <Settings className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t.admin}
                </CardTitle>
                <CardDescription className="text-base">
                  {t.accessAdminPanel}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t.pleaseLoginToAccess}
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <LoginArea className="w-full max-w-sm" />
                  </div>

                  <div className="text-xs text-center text-muted-foreground">
                    {t.onlyAuthorizedAdministrators}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Calculate real stats from properties
  const totalProperties = properties.length;
  const activeListings = properties.filter(p => p.status === 'available').length;
  const soldProperties = properties.filter(p => p.status === 'sold').length;
  const rentedProperties = properties.filter(p => p.status === 'rented').length;
  const totalMessages = messages.length;

  // Calculate percentages
  const activePercentage = totalProperties > 0 ? Math.round((activeListings / totalProperties) * 100) : 0;

  const stats = [
    { label: t.totalProperties, value: isLoadingProperties ? '...' : totalProperties.toString(), icon: Building, change: `${activeListings} ${t.available}`, trend: 'up' },
    { label: t.activeListings, value: isLoadingProperties ? '...' : activeListings.toString(), icon: TrendingUp, change: `${activePercentage}% ${t.ofTotal}`, trend: 'up' },
    { label: t.soldProperties, value: isLoadingProperties ? '...' : soldProperties.toString(), icon: Building, change: `${rentedProperties} ${t.rented}`, trend: 'up' },
    { label: t.newMessages, value: isLoadingMessages ? '...' : totalMessages.toString(), icon: MessageCircle, change: totalMessages > 0 ? `${totalMessages} ${t.unread}` : t.noMessages, trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t.adminDashboard}
              </h1>
              <p className="text-muted-foreground mt-1">{t.manageRealEstateBusiness}</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowAddProperty(!showAddProperty)}
                size="lg"
                className="gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                {t.addProperty}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="relative overflow-hidden border-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {showAddProperty && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{t.addNewProperty}</CardTitle>
                      <CardDescription>{t.fillDetailsToList}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddProperty(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <PropertyForm />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Property Dialog */}
        <AnimatePresence>
          {propertyToEdit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Edit Property</CardTitle>
                      <CardDescription>Update property details</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPropertyToEdit(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <PropertyForm 
                    property={propertyToEdit}
                    onSuccess={() => setPropertyToEdit(null)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Property Confirmation Dialog */}
        <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Property</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{propertyToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
                onClick={() => {
                  if (propertyToDelete) {
                    deleteProperty(propertyToDelete.d, {
                      onSuccess: () => {
                        setPropertyToDelete(null);
                      },
                    });
                  }
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg border">
              {[
                { id: 'properties', label: t.properties, icon: Building },
                { id: 'messages', label: t.messages, icon: MessageCircle },
                { id: 'users', label: t.users, icon: Users },
                { id: 'settings', label: t.settings, icon: Settings },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-background shadow-md text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'properties' && (
              <motion.div
                key="properties"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-2xl">{t.propertyManagement}</CardTitle>
                        <CardDescription>
                          {t.viewEditManage}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                          <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                          >
                            <LayoutGrid className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                          >
                            <List className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search properties..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Select 
                        value={statusFilter} 
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Properties</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProperties ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4 space-y-2">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : properties.length === 0 ? (
                      <div className="text-center py-12">
                        <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t.noPropertiesYet}</h3>
                        <p className="text-muted-foreground mb-4">
                          {t.getStartedByAdding}
                        </p>
                        <Button
                          onClick={() => setShowAddProperty(true)}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t.addYourFirstProperty}
                        </Button>
                      </div>
                    ) : (
                      <div className={viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                        : 'space-y-4'
                      }>
                        {properties
                          .filter(property => {
                            // Get localized text for search
                            const localizedTitle = getLocalizedText(property, 'title');
                            const localizedDescription = getLocalizedText(property, 'description');
                            
                            // Filter by search query
                            const matchesSearch = !searchQuery || 
                              localizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              localizedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              property.location.toLowerCase().includes(searchQuery.toLowerCase());
                            
                            // Filter by status
                            const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
                            
                            return matchesSearch && matchesStatus;
                          })
                          .map((property) => {
                            const localizedTitle = getLocalizedText(property, 'title');
                            const localizedDescription = getLocalizedText(property, 'description');
                            
                            return (
                            <motion.div
                              key={property.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ y: -4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                {property.images && property.images.length > 0 && (
                                  <div className="relative h-48 overflow-hidden">
                                    <img
                                      src={property.images[0].url}
                                      alt={property.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                        property.status === 'available' ? 'bg-green-500' :
                                        property.status === 'pending' ? 'bg-yellow-500' :
                                        property.status === 'sold' ? 'bg-red-500' :
                                        'bg-blue-500'
                                      } text-white`}>
                                        {property.status.toUpperCase()}
                                      </span>
                                      <span className="px-2 py-1 text-xs font-semibold rounded bg-primary text-primary-foreground">
                                        {property.type.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                <CardContent className="p-4">
                                  <h3 className="text-lg font-bold mb-2 line-clamp-1">
                                    {localizedTitle}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {localizedDescription}
                                  </p>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">Price:</span>
                                      <span className="font-bold text-lg">
                                        {property.price} {property.currency}
                                      </span>
                                    </div>
                                    {property.area && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Area:</span>
                                        <span className="font-medium">{property.area} m²</span>
                                      </div>
                                    )}
                                    {(property.bedrooms || property.bathrooms) && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Bed/Bath:</span>
                                        <span className="font-medium">
                                          {property.bedrooms || '?'} / {property.bathrooms || '?'}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">Location:</span>
                                      <span className="font-medium line-clamp-1">{property.location}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-4">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="flex-1"
                                      onClick={() => window.open(`/property/${property.d}`, '_blank')}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      {t.view}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="flex-1"
                                      onClick={() => setPropertyToEdit(property)}
                                    >
                                      <Pencil className="w-4 h-4 mr-1" />
                                      {t.edit}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => setPropertyToDelete(property)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                            );
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t.messages}</CardTitle>
                    <CardDescription>
                      {t.respondToInquiries}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMessages ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t.messageCenter}</h3>
                        <p className="text-muted-foreground">
                          No messages received yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message: ContactMessage) => {
                          const date = new Date(message.created_at * 1000);
                          const formattedDate = date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <CardTitle className="text-lg">
                                        {message.name}
                                      </CardTitle>
                                      <CardDescription className="text-sm">
                                        {message.email}
                                      </CardDescription>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {formattedDate}
                                    </span>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-semibold text-primary mb-1">
                                      {message.subject}
                                    </p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {message.message}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm">
                                      {t.reply}
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      {t.archive}
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t.userManagement}</CardTitle>
                    <CardDescription>
                      {t.manageAdminUsers}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{t.userManagement}</h3>
                      <p className="text-muted-foreground">
                        {t.featuresAvailableSoon}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t.settings}</CardTitle>
                    <CardDescription>
                      {t.configurePreferences}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t.systemConfiguration}</h3>
                        <p className="text-muted-foreground">
                          {t.featuresAvailableSoon}
                        </p>
                      </div>

                      <div className="pt-6 border-t">
                        <div className="text-sm text-muted-foreground">
                          <p><strong>{t.loggedInAs}:</strong> {user.pubkey.slice(0, 16)}...</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
