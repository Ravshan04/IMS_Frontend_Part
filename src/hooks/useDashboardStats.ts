import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  totalCategories: number;
  totalSuppliers: number;
  totalValue: number;
  pendingOrders: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        const stats = await apiService.get<DashboardStats>('/reporting/dashboard-stats');
        return stats;
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        throw error;
      }
    },
  });
}
