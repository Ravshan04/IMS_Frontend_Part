import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, FolderTree, Truck, DollarSign, ShoppingCart, Bell } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import StockChart from '@/components/dashboard/StockChart';
import SalesChart from '@/components/dashboard/SalesChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import RecentProducts from '@/components/dashboard/RecentProducts';
import LowStockModal from '@/components/dashboard/LowStockModal';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import CreateOrderModal from '@/components/orders/CreateOrderModal';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUnreadNotificationsCount } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdminOrManager } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: unreadCount } = useUnreadNotificationsCount();

  const [lowStockOpen, setLowStockOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

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
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your inventory.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-border relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {unreadCount && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            {isAdminOrManager && (
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateOrderOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div
            className="cursor-pointer"
            onClick={() => navigate('/products')}
          >
            <StatCard
              title="Total Products"
              value={dashboardStats.totalProducts}
              icon={<Package className="w-5 h-5" />}
              trend={8.2}
              trendLabel="vs last month"
              className="animate-slide-up hover:border-primary/50 transition-colors"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setLowStockOpen(true)}
          >
            <StatCard
              title="Low Stock Items"
              value={dashboardStats.lowStockItems}
              icon={<AlertTriangle className="w-5 h-5" />}
              trend={dashboardStats.lowStockItems > 0 ? -dashboardStats.lowStockItems : 0}
              trendLabel="needs attention"
              className="animate-slide-up [animation-delay:50ms] hover:border-warning/50 transition-colors"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => navigate('/categories')}
          >
            <StatCard
              title="Categories"
              value={dashboardStats.totalCategories}
              icon={<FolderTree className="w-5 h-5" />}
              className="animate-slide-up [animation-delay:100ms] hover:border-primary/50 transition-colors"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => navigate('/suppliers')}
          >
            <StatCard
              title="Suppliers"
              value={dashboardStats.totalSuppliers}
              icon={<Truck className="w-5 h-5" />}
              trend={2}
              trendLabel="new this month"
              className="animate-slide-up [animation-delay:150ms] hover:border-primary/50 transition-colors"
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
            className="cursor-pointer"
            onClick={() => navigate('/orders')}
          >
            <StatCard
              title="Pending Orders"
              value={dashboardStats.pendingOrders}
              icon={<ShoppingCart className="w-5 h-5" />}
              className="animate-slide-up [animation-delay:250ms] hover:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50"
            onClick={() => navigate('/products')}
          >
            <Package className="w-6 h-6 text-primary" />
            <span>View All Products</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 border-border hover:border-warning/50"
            onClick={() => setLowStockOpen(true)}
          >
            <AlertTriangle className="w-6 h-6 text-warning" />
            <span>Low Stock Alerts</span>
          </Button>
          {isAdminOrManager && (
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50"
              onClick={() => setCreateOrderOpen(true)}
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              <span>Create Purchase Order</span>
            </Button>
          )}
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="w-6 h-6 text-primary" />
            <span>View Notifications</span>
            {unreadCount && unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-slide-up [animation-delay:300ms]">
            <SalesChart />
          </div>
          <div className="animate-slide-up [animation-delay:350ms]">
            <StockChart />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 animate-slide-up [animation-delay:400ms]">
            <RecentProducts />
          </div>
          <div className="animate-slide-up [animation-delay:450ms]">
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
    </MainLayout>
  );
}
