import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';

// ---------------------------------------------------------------------------
// Backend DTO shapes (matching OmborPro.Application.DTOs.Reporting)
// ---------------------------------------------------------------------------
interface AssetConditionDto {
  condition: string;
  count: number;
  hexColor: string;
}

interface FacilityDistributionDto {
  facilityName: string;
  assetCount: number;
  totalValue: number;
}

interface CategoryDistributionDto {
  categoryName: string;
  itemCount: number;
  totalValue: number;
}

// ---------------------------------------------------------------------------
// Public hook return types (used by Reports.tsx)
// ---------------------------------------------------------------------------
export interface ConditionDistributionItem {
  condition: string;
  count: number;
  color: string;
}

export interface FacilityDistributionItem {
  facilityName: string;
  assetCount: number;
  totalValue: number;
}

export interface CategoryDistributionItem {
  name: string;
  assetCount: number;
  totalValue: number;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useConditionDistribution() {
  return useQuery<ConditionDistributionItem[]>({
    queryKey: ['reporting', 'condition-distribution'],
    queryFn: async () => {
      try {
        const data = await apiService.get<AssetConditionDto[]>('/reporting/condition-distribution');
        return data.map((d) => ({
          condition: d.condition,
          count: d.count,
          color: d.hexColor,
        }));
      } catch (error) {
        console.error('Failed to fetch condition distribution:', error);
        return [];
      }
    },
  });
}

export function useFacilityDistribution() {
  return useQuery<FacilityDistributionItem[]>({
    queryKey: ['reporting', 'facility-distribution'],
    queryFn: async () => {
      try {
        const data = await apiService.get<FacilityDistributionDto[]>('/reporting/facility-distribution');
        return data.map((d) => ({
          facilityName: d.facilityName,
          assetCount: d.assetCount,
          totalValue: d.totalValue,
        }));
      } catch (error) {
        console.error('Failed to fetch facility distribution:', error);
        return [];
      }
    },
  });
}

export function useCategoryDistribution() {
  return useQuery<CategoryDistributionItem[]>({
    queryKey: ['reporting', 'category-distribution'],
    queryFn: async () => {
      try {
        const data = await apiService.get<CategoryDistributionDto[]>('/reporting/category-distribution');
        return data.map((d) => ({
          name: d.categoryName,
          assetCount: d.itemCount,
          totalValue: d.totalValue,
        }));
      } catch (error) {
        console.error('Failed to fetch category distribution:', error);
        return [];
      }
    },
  });
}
