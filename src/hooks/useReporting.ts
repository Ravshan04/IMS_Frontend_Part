import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { CategoryDistributionDto, SalesTrendDto } from '@/types/api';

export interface SalesTrendItem {
  name: string;
  sales: number;
}

export interface CategoryDistributionItem {
  name: string;
  value: number;
}

export function useSalesTrend(days: number = 30) {
  return useQuery({
    queryKey: ['reporting', 'sales-trend', days],
    queryFn: async () => {
      try {
        const data = await apiService.get<SalesTrendDto[]>(`/reporting/sales-trend?days=${days}`);
        return data.map((d) => ({ name: d.date, sales: d.totalSales ?? 0 }));
      } catch (error) {
        console.error('Failed to fetch sales trend:', error);
        return [];
      }
    },
  });
}

export function useCategoryDistribution() {
  return useQuery({
    queryKey: ['reporting', 'category-distribution'],
    queryFn: async () => {
      try {
        const data = await apiService.get<CategoryDistributionDto[]>('/reporting/category-distribution');
        const totalValue = data.reduce((sum, d) => sum + (d.totalValue ?? 0), 0);
        return data.map((d) => ({
          name: d.categoryName,
          value: totalValue > 0 ? Math.round((d.totalValue ?? 0) * 100 / totalValue) : (d.productCount ?? 0),
        }));
      } catch (error) {
        console.error('Failed to fetch category distribution:', error);
        return [];
      }
    },
  });
}

export interface StockLevelItem {
  name: string;
  inStock: number;
  lowStock: number;
}

export function useStockLevels() {
  return useQuery({
    queryKey: ['reporting', 'stock-levels'],
    queryFn: async () => {
      try {
        const data = await apiService.get<CategoryDistributionDto[]>('/reporting/category-distribution').catch(() => []);
        return data.map((d) => ({
          name: d.categoryName,
          inStock: d.productCount ?? 0,
          lowStock: 0,
        }));
      } catch (error) {
        return [];
      }
    },
  });
}
