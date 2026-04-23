import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { AssetItem } from '@/types/database';
import { mapAssetDto, mapAssetLabelDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';
import { AssetDto, AssetLabelDto } from '@/types/api';

export function useAssets(filters?: {
  productId?: string;
  warehouseId?: string;
  categoryId?: string;
  status?: string;
}) {
  const query = useQuery({
    queryKey: ['assets', 'list', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.productId) params.append('productId', filters.productId);
      if (filters?.warehouseId) params.append('warehouseId', filters.warehouseId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      
      const url = `/assets${params.toString() ? `?${params.toString()}` : ''}`;
      const assets = (await apiService.get<AssetDto[]>(url)).map(mapAssetDto);
      
      // Local status filtering if needed, but backend could also handle this.
      // For now keeping status filter local to avoid backend changes for every small filter.
      if (filters?.status) {
        return assets.filter(a => a.status === filters.status);
      }
      
      return assets;
    },
  });

  return query;
}

export function useAsset(assetCode: string | undefined) {
  return useQuery({
    queryKey: ['asset', assetCode],
    queryFn: async () => {
      const data = await apiService.get<AssetDto>(`/assets/${assetCode}`);
      return mapAssetDto(data);
    },
    enabled: !!assetCode,
  });
}

export function useAssetLabel(assetCode: string | undefined) {
  return useQuery({
    queryKey: ['asset-label', assetCode],
    queryFn: async () => {
      const data = await apiService.get<AssetLabelDto>(`/assets/${assetCode}/label`);
      return mapAssetLabelDto(data);
    },
    enabled: !!assetCode,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (asset: Omit<AssetItem, 'id' | 'created_at' | 'updated_at' | 'product' | 'warehouse'>) => {
      const data = await apiService.post<AssetDto>('/assets/register', {
        productId: asset.product_id,
        warehouseId: asset.warehouse_id,
        serialNumber: asset.serial_number ?? '',
        condition: asset.condition,
        notes: asset.notes ?? '',
      });
      return mapAssetDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast({ title: 'Asset registered successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error registering asset', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateAssetStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      assetCode, 
      status, 
      condition, 
      assignedUserId, 
      notes 
    }: { 
      assetCode: string; 
      status: string; 
      condition?: string; 
      assignedUserId?: string; 
      notes?: string; 
    }) => {
      const data = await apiService.patch<AssetDto>(`/assets/${assetCode}/status`, {
        status,
        condition,
        assignedUserId,
        notes
      });
      return mapAssetDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast({ title: 'Asset status updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating asset', description: error.message, variant: 'destructive' });
    },
  });
}

export function useMoveAsset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ assetCode, toWarehouseId, notes }: { assetCode: string; toWarehouseId: string; notes?: string }) => {
      const data = await apiService.patch<AssetDto>(`/assets/${assetCode}/move`, {
        toWarehouseId,
        notes: notes ?? '',
      });
      return mapAssetDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast({ title: 'Asset moved successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error moving asset', description: error.message, variant: 'destructive' });
    },
  });
}
