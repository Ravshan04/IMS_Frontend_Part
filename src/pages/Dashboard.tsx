import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Bell, Plus, History, MapPin, ShieldCheck, DollarSign, UserCheck, Wrench, ChevronRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import QuickAddProductModal from '../components/products/QuickAddProductModal';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          title={t('dashboard')}
          description={`${t('welcome_back')}, ${session?.firstName || 'Manager'}. Here is your asset overview.`}
        >
          {canManageCatalog && (
            <Button onClick={() => setQuickAddOpen(true)} title={t('quick_add_product')}>
              <Plus className="w-4 h-4 mr-2" />
              Quick add
            </Button>
          )}
        </PageHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total asset units"
            value={dashboardStats.totalAssetUnits}
            icon={<ShieldCheck className="w-5 h-5" />}
            className="animate-slide-up"
          />
          <StatCard
            title="Assigned to staff"
            value={dashboardStats.assignedAssets}
            icon={<UserCheck className="w-5 h-5" />}
            className="animate-slide-up [animation-delay:60ms]"
          />
          <StatCard
            title="Portfolio value"
            value={`$${dashboardStats.totalAssetValue.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            className="animate-slide-up [animation-delay:120ms]"
          />
          <StatCard
            title="Needs maintenance"
            value={dashboardStats.maintenanceRequiredCount}
            icon={<Wrench className="w-5 h-5" />}
            className={cn(
              'animate-slide-up [animation-delay:180ms]',
              dashboardStats.maintenanceRequiredCount > 0 && 'border-destructive/40 bg-destructive/5'
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <h3 className="text-sm font-medium">Managed facilities</h3>
                </div>
                <p className="text-3xl font-semibold text-foreground tabular-nums">{dashboardStats.totalFacilities}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <h3 className="text-sm font-medium">Equipment types</h3>
                </div>
                <p className="text-3xl font-semibold text-foreground tabular-nums">{dashboardStats.totalEquipmentTypes}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/movements')}
              className="w-full bg-card border border-border rounded-xl p-6 text-left hover:border-primary/40 transition-colors flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-foreground">Recent inventory changes</h2>
                <p className="text-sm text-muted-foreground">View the full audit trail of asset movements and assignments.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick access</h3>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/assets')}>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Browse assets
              </Button>
              <Button variant="outline" onClick={() => navigate('/warehouses')}>
                <MapPin className="w-4 h-4 mr-2" />
                Facilities
              </Button>
              <Button variant="outline" onClick={() => setNotificationsOpen(true)}>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
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
