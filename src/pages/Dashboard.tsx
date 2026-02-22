import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, FolderTree, Truck, DollarSign, ShoppingCart, Bell, Plus } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import StockChart from '@/components/dashboard/StockChart';
import SalesChart from '@/components/dashboard/SalesChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import RecentProducts from '@/components/dashboard/RecentProducts';
import LowStockModal from '@/components/dashboard/LowStockModal';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import CreateOrderModal from '@/components/orders/CreateOrderModal';
import QuickAddProductModal from '@/components/dashboard/QuickAddProductModal';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUnreadNotificationsCount } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdminOrManager } = useAuth();
  const { data: stats } = useDashboardStats();
  const { data: unreadCount } = useUnreadNotificationsCount();

  const [lowStockOpen, setLowStockOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const dashboardStats = stats || {
    totalProducts: 0,
    lowStockItems: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    totalValue: 0,
    pendingOrders: 0,
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Dashboard"
          description="Overview of your inventory performance and alerts."
        >
          <Button
            variant="outline"
            className="border-border relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            {unreadCount && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                {unreadCount}
              </span>
            )}
          </Button>
          {isAdminOrManager && (
            <div className="flex items-center gap-2">
              <Button
                className="bg-primary hover:bg-primary/90 shadow-sm"
                onClick={() => setCreateOrderOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                New Order
              </Button>
              <Button
                size="icon"
                className="bg-success hover:bg-success/90 rounded-full h-10 w-10 shadow-sm"
                onClick={() => setQuickAddOpen(true)}
                title="Quick Add Product"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          )}
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10 overflow-hidden">
          <div
            className="cursor-pointer group"
            onClick={() => navigate('/products')}
          >
            <StatCard
              title="Total Products"
              value={dashboardStats.totalProducts}
              icon={<Package className="w-5 h-5" />}
              trend={8.2}
              trendLabel="vs last month"
              className="animate-slide-up hover:border-primary/50 transition-all hover:shadow-md"
            />
          </div>
          <div
            className="cursor-pointer group"
            onClick={() => setLowStockOpen(true)}
          >
            <StatCard
              title="Low Stock"
              value={dashboardStats.lowStockItems}
              icon={<AlertTriangle className="w-5 h-5" />}
              trend={dashboardStats.lowStockItems > 0 ? -dashboardStats.lowStockItems : 0}
              trendLabel="needs attention"
              className="animate-slide-up [animation-delay:50ms] hover:border-warning/50 transition-all hover:shadow-md"
            />
          </div>
          <div
            className="cursor-pointer group"
            onClick={() => navigate('/categories')}
          >
            <StatCard
              title="Categories"
              value={dashboardStats.totalCategories}
              icon={<FolderTree className="w-5 h-5" />}
              className="animate-slide-up [animation-delay:100ms] hover:border-primary/50 transition-all hover:shadow-md"
            />
          </div>
          <div
            className="cursor-pointer group"
            onClick={() => navigate('/suppliers')}
          >
            <StatCard
              title="Suppliers"
              value={dashboardStats.totalSuppliers}
              icon={<Truck className="w-5 h-5" />}
              trend={2}
              trendLabel="new this month"
              className="animate-slide-up [animation-delay:150ms] hover:border-primary/50 transition-all hover:shadow-md"
            />
          </div>
          <StatCard
            title="Total Value"
            value={`$${(dashboardStats.totalValue / 1000).toFixed(0)}k`}
            icon={<DollarSign className="w-5 h-5" />}
            trend={12.5}
            trendLabel="vs last month"
            className="animate-slide-up [animation-delay:200ms]"
          />
          <div
            className="cursor-pointer group"
            onClick={() => navigate('/orders')}
          >
            <StatCard
              title="Pending Orders"
              value={dashboardStats.pendingOrders}
              icon={<ShoppingCart className="w-5 h-5" />}
              className="animate-slide-up [animation-delay:250ms] hover:border-primary/50 transition-all hover:shadow-md"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 overflow-hidden">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col gap-3 border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all animate-fade-in [animation-delay:300ms]"
            onClick={() => navigate('/products')}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">All Products</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col gap-3 border-border bg-card/50 hover:border-warning/50 hover:bg-warning/5 transition-all animate-fade-in [animation-delay:350ms]"
            onClick={() => setLowStockOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <span className="font-medium">Low Stock Alerts</span>
          </Button>
          {isAdminOrManager && (
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-3 border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all animate-fade-in [animation-delay:400ms]"
              onClick={() => setCreateOrderOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">New Purchase Order</span>
            </Button>
          )}
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col gap-3 border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all relative animate-fade-in [animation-delay:450ms]"
            onClick={() => setNotificationsOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Notifications</span>
            {unreadCount && unreadCount > 0 && (
              <span className="absolute top-4 right-6 w-5 h-5 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 overflow-hidden">
          <div className="animate-slide-up [animation-delay:500ms]">
            <SalesChart />
          </div>
          <div className="animate-slide-up [animation-delay:550ms]">
            <StockChart />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 overflow-hidden">
          <div className="lg:col-span-2 animate-slide-up [animation-delay:600ms]">
            <RecentProducts />
          </div>
          <div className="animate-slide-up [animation-delay:650ms]">
            <CategoryPieChart />
          </div>
        </div>
      </div>

      {/* Modals */}
      <LowStockModal
        open={lowStockOpen}
        onOpenChange={setLowStockOpen}
        onCreateOrder={() => setCreateOrderOpen(true)}
      />
      <NotificationsPanel
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
      <CreateOrderModal
        open={createOrderOpen}
        onOpenChange={setCreateOrderOpen}
      />
      <QuickAddProductModal
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />
    </MainLayout>
  );
}
