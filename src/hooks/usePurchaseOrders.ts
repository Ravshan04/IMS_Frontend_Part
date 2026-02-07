import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PurchaseOrder, PurchaseOrderItem, OrderStatus } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function usePurchaseOrders(filters?: { supplierId?: string; status?: OrderStatus }) {
  return useQuery({
    queryKey: ['purchase-orders', filters],
    queryFn: async () => {
      let query = supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.supplierId) {
        query = query.eq('supplier_id', filters.supplierId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as PurchaseOrder[];
    },
  });
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(*),
          items:purchase_order_items(
            *,
            product:products(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as PurchaseOrder;
    },
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      order,
      items,
    }: {
      order: {
        supplier_id: string;
        expected_date?: string;
        notes?: string;
      };
      items: Array<{
        product_id: string;
        quantity: number;
        unit_cost: number;
      }>;
    }) => {
      // Generate order number
      const { data: orderNumber } = await supabase.rpc('generate_order_number');

      // Calculate total
      const total_amount = items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          order_number: orderNumber,
          supplier_id: order.supplier_id,
          expected_date: order.expected_date,
          notes: order.notes,
          total_amount,
          created_by: user?.id,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return orderData;
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
      const updates: Partial<PurchaseOrder> = { status };
      
      if (status === 'received') {
        updates.received_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('purchase_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
    mutationFn: async ({
      orderId,
      receivedItems,
    }: {
      orderId: string;
      receivedItems: Array<{ itemId: string; productId: string; receivedQuantity: number }>;
    }) => {
      // Update received quantities on order items
      for (const item of receivedItems) {
        await supabase
          .from('purchase_order_items')
          .update({ received_quantity: item.receivedQuantity })
          .eq('id', item.itemId);

        // Update product quantities
        const { data: product } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.productId)
          .single();

        if (product) {
          await supabase
            .from('products')
            .update({ quantity: product.quantity + item.receivedQuantity })
            .eq('id', item.productId);
        }
      }

      // Update order status
      const { data, error } = await supabase
        .from('purchase_orders')
        .update({
          status: 'received',
          received_date: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
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
