import { User, Bell, Shield, Palette, Loader2, Save, Key, Globe, Eye, LayoutGrid, Sun, Moon, Languages } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/translations';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Settings() {
  const { profile, role, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { 
    compactMode, setCompactMode, 
    liveTelemetry, setLiveTelemetry, 
    privacyShield, setPrivacyShield,
    lowStockAlerts, setLowStockAlerts,
    procurementUpdates, setProcurementUpdates,
    emailRelay, setEmailRelay
  } = useSettings();

  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
          <p className="text-muted-foreground animate-pulse">Synchronizing...</p>
        </div>
      </MainLayout>
    );
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSavingProfile(false);
    toast.success(t('identity') + ' ' + t('save').toLowerCase() + 'd successfully');
  };

  const handleUpdatePassword = async () => {
    setUpdatingPass(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUpdatingPass(false);
    toast.success(t('security') + ' settings updated');
  };

  const getRoleBadgeVariant = () => {
    switch (role) {
      case 'Owner':
      case 'Admin':
        return 'destructive';
      case 'Manager':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <PageHeader
          title={t('settings')}
          description={t('settings_description')}
        />

        <Tabs defaultValue="profile" className="space-y-8">
          <div className="bg-secondary/30 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm sticky top-0 z-10 w-fit mx-auto sm:mx-0">
            <TabsList className="bg-transparent gap-1">
              {[
                { value: 'profile', icon: User, label: t('profile') },
                { value: 'notifications', icon: Bell, label: t('alerts') },
                { value: 'security', icon: Shield, label: t('security') },
                { value: 'preferences', icon: Palette, label: t('display') },
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
                    <h2 className="text-2xl font-bold text-foreground">{t('identity')}</h2>
                    <p className="text-sm text-muted-foreground">{t('manage_profile_desc')}</p>
                  </div>
                </div>
                {role && (
                  <Badge variant={getRoleBadgeVariant()} className="capitalize py-1 px-4 text-xs font-bold rounded-full">
                    {role} {t('access')}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{t('first_name')}</Label>
                  <Input
                    defaultValue={profile?.first_name || ''}
                    className="bg-secondary/50 border-border/50 rounded-xl h-12 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{t('last_name')}</Label>
                  <Input
                    defaultValue={profile?.last_name || ''}
                    className="bg-secondary/50 border-border/50 rounded-xl h-12 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{t('email_restricted')}</Label>
                  <Input
                    defaultValue={profile?.email || ''}
                    disabled
                    className="bg-secondary/30 border-border/30 rounded-xl h-12 text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-3 pb-2 border-b border-border/30">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{t('phone_connection')}</Label>
                  <Input
                    defaultValue={profile?.phone || ''}
                    placeholder="+1 (555) 000-0000"
                    className="bg-secondary/50 border-border/50 rounded-xl h-12 focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-12 pt-8 border-t border-border/50">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-primary hover:bg-primary/90 rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20 gap-2"
                >
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t('save')} {t('identity')}
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
                  <h2 className="text-2xl font-bold text-foreground">{t('communication')}</h2>
                  <p className="text-sm text-muted-foreground">{t('control_alerts_desc')}</p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-border/30">
                {[
                  { title: t('low_stock_alerts'), desc: t('low_stock_alerts_desc'), checked: lowStockAlerts, setter: setLowStockAlerts },
                  { title: t('procurement_updates'), desc: t('procurement_updates_desc'), checked: procurementUpdates, setter: setProcurementUpdates },
                  { title: t('email_relay'), desc: t('email_relay_desc'), checked: emailRelay, setter: setEmailRelay },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-5 group">
                    <div className="space-y-1">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-xs text-muted-foreground max-w-sm">{item.desc}</p>
                    </div>
                    <Switch 
                      checked={item.checked} 
                      onCheckedChange={item.setter}
                      className="data-[state=checked]:bg-primary" 
                    />
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
                  <h2 className="text-2xl font-bold text-foreground">{t('cyber_guard')}</h2>
                  <p className="text-sm text-muted-foreground">{t('secure_account_desc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 max-w-md">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">{t('current_passphrase')}</Label>
                    <Input type="password" placeholder="••••••••" className="bg-secondary/50 border-border/50 rounded-xl h-12 font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">{t('new_passphrase')}</Label>
                    <Input type="password" placeholder={t('min_12_chars')} className="bg-secondary/50 border-border/50 rounded-xl h-12 font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">{t('confirm_new_passphrase')}</Label>
                    <Input type="password" placeholder={t('repeat_passphrase')} className="bg-secondary/50 border-border/50 rounded-xl h-12 font-mono" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-8 border-t border-border/50">
                <Button 
                  onClick={handleUpdatePassword}
                  disabled={updatingPass}
                  className="bg-destructive hover:bg-destructive/90 rounded-xl px-10 h-12 font-bold shadow-lg shadow-destructive/20 gap-2"
                >
                  {updatingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  {t('update_credentials')}
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
                  <h2 className="text-2xl font-bold text-foreground">{t('environment')}</h2>
                  <p className="text-sm text-muted-foreground">{t('environment_desc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Theme Switcher */}
                <div className="glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
                      <p className="font-bold text-foreground">{t('theme')}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl border border-border/30">
                      <Button
                        variant={theme === 'light' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-lg h-8 text-[10px] font-bold"
                        onClick={() => setTheme('light')}
                      >
                        {t('light')}
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-lg h-8 text-[10px] font-bold"
                        onClick={() => setTheme('dark')}
                      >
                        {t('dark')}
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">{t('theme_desc')}</p>
                </div>

                {/* Language Selector */}
                <div className="glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Languages className="w-5 h-5 text-primary" />
                      <p className="font-bold text-foreground">{t('language')}</p>
                    </div>
                    <Select value={language} onValueChange={(val: Language) => setLanguage(val)}>
                      <SelectTrigger className="w-[120px] h-8 text-[10px] font-bold rounded-lg bg-secondary/50 border-border/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 shadow-2xl backdrop-blur-xl bg-background/80">
                        <SelectItem value="eng" className="text-xs font-medium">English</SelectItem>
                        <SelectItem value="rus" className="text-xs font-medium">Русский</SelectItem>
                        <SelectItem value="uzb" className="text-xs font-medium">O'zbekcha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">{t('language_desc')}</p>
                </div>

                <div 
                  className={cn(
                    "glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6 transition-all",
                    compactMode && "ring-1 ring-primary/30 bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="w-5 h-5 text-primary" />
                      <p className="font-bold text-foreground">{t('compact_mode')}</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">{t('compact_mode_desc')}</p>
                </div>

                <div 
                  className={cn(
                    "glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6 transition-all",
                    liveTelemetry && "ring-1 ring-warning/30 bg-warning/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-warning" />
                      <p className="font-bold text-foreground">{t('live_telemetry')}</p>
                    </div>
                    <Switch checked={liveTelemetry} onCheckedChange={setLiveTelemetry} />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">{t('live_telemetry_desc')}</p>
                </div>

                <div 
                  className={cn(
                    "glass bg-background/30 p-6 rounded-2xl border border-border/50 space-y-6 transition-all",
                    privacyShield && "ring-1 ring-destructive/30 bg-destructive/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-destructive" />
                      <p className="font-bold text-foreground">{t('privacy_shield')}</p>
                    </div>
                    <Switch checked={privacyShield} onCheckedChange={setPrivacyShield} />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">{t('privacy_shield_desc')}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
