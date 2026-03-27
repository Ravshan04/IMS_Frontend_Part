import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { AssetItem } from '@/types/database';
import { mapAssetDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';
import { AssetDto } from '@/types/api';

export function useAssets(filters?: {
  productId?: string;
  warehouseId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['assets', filters],
    queryFn: async () => {
      try {
        let assets = (await apiService.get<AssetDto[]>('/assets')).map(mapAssetDto);
        
        if (filters?.productId) assets = assets.filter(a => a.product_id === filters.productId);
        if (filters?.warehouseId) assets = assets.filter(a => a.warehouse_id === filters.warehouseId);
        if (filters?.status) assets = assets.filter(a => a.status === filters.status);
        
        return assets;
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        throw error;
      }
    },
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
