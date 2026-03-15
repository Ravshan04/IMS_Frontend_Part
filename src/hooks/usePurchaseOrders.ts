import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { PurchaseOrder, PurchaseOrderItem, OrderStatus } from '@/types/database';
import { mapPurchaseOrderDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';
import { PurchaseOrderDto } from '@/types/api';

export function usePurchaseOrders(filters?: { supplierId?: string; status?: OrderStatus }) {
  return useQuery({
    queryKey: ['purchase-orders', filters],
    queryFn: async () => {
      try {
        let url = '/purchaseorders';
        const params = new URLSearchParams();
        if (filters?.supplierId) params.append('supplierId', filters.supplierId);
        if (filters?.status) params.append('status', filters.status);
        if (params.toString()) url += `?${params.toString()}`;
        
        const data = await apiService.get<PurchaseOrderDto[]>(url);
        return data.map(mapPurchaseOrderDto);
      } catch (error) {
        console.error('Failed to fetch purchase orders:', error);
        throw error;
      }
    },
  });
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: async () => {
      try {
        const data = await apiService.get<PurchaseOrderDto>(`/purchaseorders/${id}`);
        return mapPurchaseOrderDto(data);
      } catch (error) {
        console.error(`Failed to fetch purchase order ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      order,
      items,
    }: {
      order: {
        supplier_id: string;
        warehouse_id: string;
        po_number?: string;
      };
      items: Array<{
        product_id: string;
        quantity: number;
        unit_cost: number;
      }>;
    }) => {
      const poNumber = order.po_number || `PO-${Date.now().toString(36).toUpperCase()}`;
      const data = await apiService.post<PurchaseOrderDto>('/purchaseorders', {
        poNumber,
        supplierId: order.supplier_id,
        warehouseId: order.warehouse_id,
        items: items.map(i => ({
          productId: i.product_id,
          quantity: i.quantity,
          unitPrice: i.unit_cost,
        })),
      });
      return mapPurchaseOrderDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast({ title: 'Purchase order created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating purchase order', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const data = await apiService.patch<PurchaseOrderDto>(`/purchaseorders/${id}/status`, status);
      return mapPurchaseOrderDto(data);
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast({ title: `Order ${status} successfully` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating order status', description: error.message, variant: 'destructive' });
    },
  });
}

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId }: { orderId: string }) => {
      const data = await apiService.patch<PurchaseOrderDto>(`/purchaseorders/${orderId}/status`, 'received');
      return mapPurchaseOrderDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Order received successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error receiving order', description: error.message, variant: 'destructive' });
    },
  });
}
