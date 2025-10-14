import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeoMeta } from '@unhead/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoginArea } from '@/components/auth/LoginArea';
import { PropertyForm } from '@/components/PropertyForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useI18n } from '@/contexts/I18nContext';
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
  Eye
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
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

export default function Admin() {
  const { t } = useI18n();
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('properties');
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

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
                  Access the admin panel to manage properties, messages, and system settings
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
                      Please log in to access the admin panel
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <LoginArea className="w-full max-w-sm" />
                  </div>

                  <div className="text-xs text-center text-muted-foreground">
                    Only authorized administrators can access this panel
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Properties', value: '12', icon: Building, change: '+2 this month', trend: 'up' },
    { label: 'Active Listings', value: '8', icon: TrendingUp, change: '66% active', trend: 'up' },
    { label: 'New Messages', value: '5', icon: MessageCircle, change: '2 unread', trend: 'up' },
    { label: 'Total Views', value: '1.2k', icon: Eye, change: '+15% this week', trend: 'up' },
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
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Manage your real estate business</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowAddProperty(!showAddProperty)}
                size="lg"
                className="gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Property
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
                      <CardTitle className="text-2xl">Add New Property</CardTitle>
                      <CardDescription>Fill in the details to list a new property</CardDescription>
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

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg border">
              {[
                { id: 'properties', label: 'Properties', icon: Building },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'settings', label: 'Settings', icon: Settings },
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
                        <CardTitle className="text-2xl">Property Management</CardTitle>
                        <CardDescription>
                          View, edit, and manage your property listings
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
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Properties</SelectItem>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Get started by adding your first property listing
                      </p>
                      <Button
                        onClick={() => setShowAddProperty(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Your First Property
                      </Button>
                    </div>
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
                    <CardTitle className="text-2xl">Messages & Inquiries</CardTitle>
                    <CardDescription>
                      View and respond to customer inquiries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Message Center</h3>
                      <p className="text-muted-foreground">
                        Message management features will be available soon
                      </p>
                    </div>
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
                    <CardTitle className="text-2xl">User Management</CardTitle>
                    <CardDescription>
                      Manage admin users and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">User Management</h3>
                      <p className="text-muted-foreground">
                        User management features will be available soon
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
                    <CardTitle className="text-2xl">System Settings</CardTitle>
                    <CardDescription>
                      Configure system preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
                        <p className="text-muted-foreground">
                          System settings will be available soon
                        </p>
                      </div>

                      <div className="pt-6 border-t">
                        <div className="text-sm text-muted-foreground">
                          <p><strong>Logged in as:</strong> {user.pubkey.slice(0, 16)}...</p>
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
