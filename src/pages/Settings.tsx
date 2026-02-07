import { User, Bell, Shield, Palette, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  const { profile, role, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const getRoleBadgeVariant = () => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary border border-border p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="glass rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                {role && (
                  <Badge variant={getRoleBadgeVariant()} className="capitalize">
                    {role}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    defaultValue={profile?.first_name || ''} 
                    className="bg-secondary border-border" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    defaultValue={profile?.last_name || ''} 
                    className="bg-secondary border-border" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    defaultValue={profile?.email || ''} 
                    disabled
                    className="bg-secondary border-border" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    defaultValue={profile?.phone || ''} 
                    placeholder="+1 555-0000"
                    className="bg-secondary border-border" 
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="animate-fade-in">
            <div className="glass rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when products are below reorder level</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Order Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="animate-fade-in">
            <div className="glass rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">
                  Update Password
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="animate-fade-in">
            <div className="glass rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Application Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Compact View</p>
                    <p className="text-sm text-muted-foreground">Show more items in tables</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Auto-refresh Data</p>
                    <p className="text-sm text-muted-foreground">Automatically refresh data every 5 minutes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
