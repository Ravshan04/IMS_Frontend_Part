import { Package, AlertTriangle, FolderTree, Truck, DollarSign, TrendingUp } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import StockChart from '@/components/dashboard/StockChart';
import SalesChart from '@/components/dashboard/SalesChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import RecentProducts from '@/components/dashboard/RecentProducts';
import { dashboardStats } from '@/data/mockData';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your inventory.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={dashboardStats.totalProducts}
            icon={<Package className="w-5 h-5" />}
            trend={8.2}
            trendLabel="vs last month"
            className="animate-slide-up"
          />
          <StatCard
            title="Low Stock Items"
            value={dashboardStats.lowStockItems}
            icon={<AlertTriangle className="w-5 h-5" />}
            trend={-15}
            trendLabel="vs last month"
            className="animate-slide-up [animation-delay:50ms]"
          />
          <StatCard
            title="Categories"
            value={dashboardStats.totalCategories}
            icon={<FolderTree className="w-5 h-5" />}
            className="animate-slide-up [animation-delay:100ms]"
          />
          <StatCard
            title="Suppliers"
            value={dashboardStats.totalSuppliers}
            icon={<Truck className="w-5 h-5" />}
            trend={2}
            trendLabel="new this month"
            className="animate-slide-up [animation-delay:150ms]"
          />
          <StatCard
            title="Total Value"
            value={`$${(dashboardStats.totalValue / 1000).toFixed(0)}k`}
            icon={<DollarSign className="w-5 h-5" />}
            trend={12.5}
            trendLabel="vs last month"
            className="animate-slide-up [animation-delay:200ms]"
          />
          <StatCard
            title="Monthly Growth"
            value={`${dashboardStats.monthlyGrowth}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend={dashboardStats.monthlyGrowth}
            className="animate-slide-up [animation-delay:250ms]"
          />
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
    </MainLayout>
  );
}
