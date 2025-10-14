import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useI18n } from '@/contexts/I18nContext';
import { Settings, MessageCircle, Building, Users } from 'lucide-react';

export default function Admin() {
  const { t } = useI18n();
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('login');

  useSeoMeta({
    title: `${t.admin} - ${t.companyName}`,
    description: 'Admin panel for Creative Construction Services',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t.admin}</CardTitle>
                <CardDescription>
                  Access the admin panel to manage properties, messages, and system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Please log in to access the admin panel
                    </p>
                  </div>
                  
                  {/* Login Area */}
                  <div className="flex justify-center">
                    <LoginArea className="w-full max-w-sm" />
                  </div>

                  <div className="text-xs text-center text-muted-foreground">
                    Only authorized administrators can access this panel
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your real estate business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties" className="gap-2">
              <Building className="w-4 h-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  Add, edit, and manage your property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Property Management</h3>
                  <p className="text-muted-foreground">
                    Property management features will be available soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages & Inquiries</CardTitle>
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
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
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
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}