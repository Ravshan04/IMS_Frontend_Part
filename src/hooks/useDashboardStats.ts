import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      // Fetch all counts in parallel
      const [
        productsResult,
        categoriesResult,
        suppliersResult,
        ordersResult,
      ] = await Promise.all([
        supabase.from('products').select('quantity, reorder_level, price, cost'),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('suppliers').select('id', { count: 'exact', head: true }),
        supabase.from('purchase_orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const products = productsResult.data || [];
      const totalProducts = products.length;
      const lowStockItems = products.filter(p => p.quantity <= p.reorder_level).length;
      const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.cost), 0);

      return {
        totalProducts,
        lowStockItems,
        totalCategories: categoriesResult.count || 0,
        totalSuppliers: suppliersResult.count || 0,
        totalValue,
        pendingOrders: ordersResult.count || 0,
      };
    },
  });
}
