import { User, Bell, Shield, Palette, Loader2, Save, Key, Globe, Eye, LayoutGrid } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { profile, role, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
          <p className="text-muted-foreground animate-pulse">Synchronizing preferences...</p>
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
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <PageHeader
          title="Settings"
          description="Configure your personal profile and system-wide application preferences."
        />

        <Tabs defaultValue="profile" className="space-y-8">
          <div className="bg-secondary/30 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm sticky top-0 z-10 w-fit mx-auto sm:mx-0">
            <TabsList className="bg-transparent gap-1">
              {[
                { value: 'profile', icon: User, label: 'Profile' },
                { value: 'notifications', icon: Bell, label: 'Alerts' },
                { value: 'security', icon: Shield, label: 'Security' },
                { value: 'preferences', icon: Palette, label: 'Display' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg active:scale-95"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="profile" className="animate-slide-up focus-visible:outline-none">
            <div className="glass rounded-3xl p-8 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <User size={120} />
              </div>

              <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-black shadow-xl shadow-primary/20">
                    {(profile?.first_name?.charAt(0) || 'U')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Identity</h2>
                    <p className="text-sm text-muted-foreground">Manage your public profile information</p>
                  </div>
                </div>
                {role && (
                  <Badge variant={getRoleBadgeVariant()} className="capitalize py-1 px-4 text-xs font-bold rounded-full">
                    {role} Access
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">First Name</Label>
                  <Input
                    defaultValue={profile?.first_name || ''}
                    className="bg-secondary/50 border-border/50 rounded-xl h-12 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Last Name</Label>
                  <Input
                    defaultValue={profile?.last_name || ''}
                    className="bg-secondary/50 border-border/50 rounded-xl h-12 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Email (Restricted)</Label>
                  <Input
                    defaultValue={profile?.email || ''}
                    disabled
                    className="bg-secondary/30 border-border/30 rounded-xl h-12 text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Phone Connection</Label>
                  <Input
                    defaultValue={profile?.phone || ''}
                    placeholder="+1 (555) 000-0000"
                    className="bg-secondary/50 border-border/50 rounded-xl h-12 focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-12 pt-8 border-t border-border/50">
                <Button className="bg-primary hover:bg-primary/90 rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20 gap-2">
                  <Save className="w-4 h-4" />
                  Save Identity
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="animate-slide-up focus-visible:outline-none">
            <div className="glass rounded-3xl p-8 space-y-8 border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-warning/10 text-warning rounded-2xl">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Communication</h2>
                  <p className="text-sm text-muted-foreground">Control how and when you want to be alerted</p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-border/30">
                {[
                  { title: 'Low Stock Alerts', desc: 'Real-time push notifications when inventory is critical', checked: true },
                  { title: 'Procurement Updates', desc: 'Sync status changes for active purchase orders', checked: true },
                  { title: 'System Heartbeat', desc: 'Daily summary reports of warehouse activity', checked: false },
                  { title: 'Email Relay', desc: 'Mirror all important notifications to your inbox', checked: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-5 group">
                    <div className="space-y-1">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-xs text-muted-foreground max-w-sm">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-primary" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="animate-slide-up focus-visible:outline-none">
            <div className="glass rounded-3xl p-8 space-y-8 border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-destructive/10 text-destructive rounded-2xl">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Cyber Guard</h2>
                  <p className="text-sm text-muted-foreground">Keep your account secure with strong credentials</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 max-w-md">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Current Passphrase</Label>
                    <Input type="password" placeholder="••••••••" className="bg-secondary/50 border-border/50 rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">New Passphrase</Label>
                    <Input type="password" placeholder="Minimum 12 characters" className="bg-secondary/50 border-border/50 rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Confirm New Passphrase</Label>
                    <Input type="password" placeholder="Repeat passphrase" className="bg-secondary/50 border-border/50 rounded-xl h-12" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-8 border-t border-border/50">
                <Button className="bg-destructive hover:bg-destructive/90 rounded-xl px-10 h-12 font-bold shadow-lg shadow-destructive/20 gap-2">
                  <Shield className="w-4 h-4" />
                  Update Credentials
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="animate-slide-up focus-visible:outline-none">
            <div className="glass rounded-3xl p-8 space-y-8 border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Environment</h2>
                  <p className="text-sm text-muted-foreground">Tailor the interface to match your workflow</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="w-5 h-5 text-primary" />
                      <p className="font-bold text-foreground">Compact Mode</p>
                    </div>
                    <Switch />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Reduces padding and font sizes across the system to fit more data on screen. Ideal for high-density analysis.</p>
                </div>

                <div className="glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <p className="font-bold text-foreground">Live Telemetry</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Automatically refreshes all dashboard widgets every 5 minutes using real-time inventory hooks.</p>
                </div>

                <div className="glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-primary" />
                      <p className="font-bold text-foreground">Privacy Shield</p>
                    </div>
                    <Switch />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Hides sensitive financial data like profit margins from the main dashboard unless explicitly hovered.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
