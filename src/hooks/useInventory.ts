import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { InventoryStatus, StockMovement } from '@/types/database';
import { mapInventoryDto, mapStockMovementDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';
import { 
  InventoryStatusDto, 
  StockMovementDto, 
  InventoryImportRequest, 
  InventoryImportResult,
  MovementType,
  ReferenceType
} from '@/types/api';

export function useInventory(warehouseId?: string) {
  return useQuery({
    queryKey: ['inventory', warehouseId],
    queryFn: async () => {
      try {
        const url = warehouseId ? `/inventory?warehouseId=${warehouseId}` : '/inventory';
        const data = await apiService.get<InventoryStatusDto[]>(url);
        return data.map(mapInventoryDto);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        throw error;
      }
    },
  });
}

export function useStockMovements(filters?: { productId?: string; warehouseId?: string }) {
  return useQuery({
    queryKey: ['stock-movements', filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.productId) params.append('productId', filters.productId);
        if (filters?.warehouseId) params.append('warehouseId', filters.warehouseId);
        
        const url = `/inventory/movements${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await apiService.get<StockMovementDto[]>(url);
        return data.map(mapStockMovementDto);
      } catch (error) {
        console.error('Failed to fetch movements:', error);
        throw error;
      }
    },
  });
}

export function useRegisterMovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (movement: {
      productId: string;
      warehouseId: string;
      quantity: number;
      type: MovementType;
      refType: ReferenceType;
      refId: string;
      notes?: string;
    }) => {
      await apiService.post('/inventory/movement', {
        productId: movement.productId,
        warehouseId: movement.warehouseId,
        quantity: movement.quantity,
        type: movement.type,
        refType: movement.refType,
        refId: movement.refId,
        notes: movement.notes ?? ''
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      toast({ title: 'Movement registered successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error registering movement', description: error.message, variant: 'destructive' });
    },
  });
}

export function useProductStock(productId: string | undefined, warehouseId: string | undefined) {
  return useQuery({
    queryKey: ['product-stock', productId, warehouseId],
    queryFn: async () => {
      const data = await apiService.get<{ productId: string; warehouseId: string; availableStock: number }>(
        `/inventory/product/${productId}/warehouse/${warehouseId}`
      );
      return data;
    },
    enabled: !!productId && !!warehouseId,
  });
}

export function useImportInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: InventoryImportRequest) => {
      return await apiService.post<InventoryImportResult>('/inventory/import', request);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      toast({ title: `Import successful: ${data.movementCount} movements created` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error importing inventory', description: error.message, variant: 'destructive' });
    },
  });
}
