import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, FolderTree, Bell, Plus, History, MapPin, ShieldCheck, DollarSign, UserCheck, Wrench } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import QuickAddProductModal from '../components/products/QuickAddProductModal';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, session, isAdminOrManager, canManageCatalog } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const { data: dashboardStats, isLoading } = useDashboardStats();

  if (isLoading || !dashboardStats) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-black uppercase tracking-widest animate-pulse">Syncing Inventory Records...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader
          title={t('dashboard')}
          description={`${t('welcome_back')}, ${session?.firstName || 'Manager'}. Here is your organizational asset overview.`}
        >
          <div className="flex items-center gap-2">
            {canManageCatalog && (
              <Button
                size="icon"
                className="bg-success hover:bg-success/90 rounded-full h-10 w-10 shadow-xl shadow-success/20"
                onClick={() => setQuickAddOpen(true)}
                title={t('quick_add_product')}
              >
                <Plus className="w-5 h-5" />
              </Button>
            )}
          </div>
        </PageHeader>

        {/* Major Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Asset Units"
            value={dashboardStats.totalAssetUnits}
            icon={<ShieldCheck className="w-5 h-5" />}
            className="animate-slide-up hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
          />
          <StatCard
            title="Assigned To Staff"
            value={dashboardStats.assignedAssets}
            icon={<UserCheck className="w-5 h-5" />}
            className="animate-slide-up [animation-delay:100ms] hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
          />
          <StatCard
            title="Asset Portfolio Value"
            value={`$${dashboardStats.totalAssetValue.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            className="animate-slide-up [animation-delay:200ms] hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
          />
          <StatCard
             title="Req. Maintenance"
             value={dashboardStats.maintenanceRequiredCount}
             icon={<Wrench className="w-5 h-5" />}
             className={`animate-slide-up [animation-delay:300ms] hover:border-destructive/50 transition-all hover:shadow-xl hover:shadow-destructive/5 ${dashboardStats.maintenanceRequiredCount > 0 ? "border-destructive/30 bg-destructive/5" : ""}`}
          />
        </div>

        {/* Secondary Info & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card border-2 border-border/50 rounded-3xl p-6 hover:border-primary/30 transition-all group">
                         <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Managed Facilities</h3>
                         </div>
                         <p className="text-3xl font-black">{dashboardStats.totalFacilities}</p>
                    </div>
                    <div className="bg-card border-2 border-border/50 rounded-3xl p-6 hover:border-primary/30 transition-all group">
                         <div className="flex items-center gap-3 mb-2">
                            <Package className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Equipment Types</h3>
                         </div>
                         <p className="text-3xl font-black">{dashboardStats.totalEquipmentTypes}</p>
                    </div>
                </div>

                <div className="bg-card border-2 border-border/50 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                     <History className="w-12 h-12 text-primary/20 mb-2 group-hover:text-primary transition-colors" />
                     <h2 className="text-xl font-black tracking-tight uppercase">Recent Inventory Changes</h2>
                     <p className="text-sm text-muted-foreground font-medium">View the full transaction history of asset movements and assignments.</p>
                     <Button 
                        variant="link" 
                        onClick={() => navigate('/movements')}
                        className="text-primary font-black uppercase tracking-widest text-[10px]"
                     >
                        Enter Audit Log
                     </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-card border-2 border-border/50 rounded-3xl p-6 space-y-6 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quick Access</h3>
                    <div className="flex flex-col gap-3">
                        <Button 
                            className="bg-primary hover:bg-primary/90 rounded-2xl h-14 font-black shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]"
                            onClick={() => navigate('/assets')}
                        >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Inventory Search
                        </Button>
                        <Button 
                            variant="outline"
                            className="rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border-2"
                            onClick={() => navigate('/warehouses')}
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            Room Mapping
                        </Button>
                        <Button 
                            variant="outline"
                            className="rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border-2"
                            onClick={() => setNotificationsOpen(true)}
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            Security Logs
                        </Button>
                    </div>
                </div>
            </div>
        </div>

      </div>

      <NotificationsPanel
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
      
      <QuickAddProductModal
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />
    </MainLayout>
  );
}
