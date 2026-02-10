import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockService } from '@/services/mockData';

export function useProducts(filters?: {
  categoryId?: string;
  supplierId?: string;
  lowStockOnly?: boolean;
}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const isMockMode = localStorage.getItem('mockSession');

      if (isMockMode) {
        let products = mockService.get<Product>('products');

        if (filters?.categoryId) {
          products = products.filter(p => p.category_id === filters.categoryId);
        }
        if (filters?.supplierId) {
          products = products.filter(p => p.supplier_id === filters.supplierId);
        }
        if (filters?.lowStockOnly) {
          products = products.filter(p => p.quantity <= p.reorder_level);
        }

        return products;
      }

      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            supplier:suppliers(*)
          `)
          .order('created_at', { ascending: false });

        if (filters?.categoryId) {
          query = query.eq('category_id', filters.categoryId);
        }
        if (filters?.supplierId) {
          query = query.eq('supplier_id', filters.supplierId);
        }

        const { data, error } = await query;
        if (error) throw error;

        let products = data as unknown as Product[];

        if (filters?.lowStockOnly) {
          products = products.filter(p => p.quantity <= p.reorder_level);
        }

        return products;
      } catch (error) {
        console.warn('Supabase fetch failed, falling back to mock data', error);
        let products = mockService.get<Product>('products');

        if (filters?.categoryId) {
          products = products.filter(p => p.category_id === filters.categoryId);
        }
        if (filters?.supplierId) {
          products = products.filter(p => p.supplier_id === filters.supplierId);
        }
        if (filters?.lowStockOnly) {
          products = products.filter(p => p.quantity <= p.reorder_level);
        }

        return products;
      }
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const isMockMode = localStorage.getItem('mockSession');

      if (isMockMode) {
        return mockService.getById<Product>('products', id);
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            supplier:suppliers(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as unknown as Product;
      } catch (error) {
        console.warn('Supabase fetch failed, falling back to mock data', error);
        return mockService.getById<Product>('products', id);
      }
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'supplier'>) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(product)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase create failed, falling back to mock data', error);
        return mockService.insert<Product>('products', product as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({ title: 'Product created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating product', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates, oldProduct }: { id: string; updates: Partial<Product>; oldProduct: Product }) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Record history for important fields
        const fieldsToTrack = ['quantity', 'price', 'cost', 'reorder_level', 'supplier_id', 'category_id'];
        for (const field of fieldsToTrack) {
          if (updates[field as keyof Product] !== undefined &&
            updates[field as keyof Product] !== oldProduct[field as keyof Product]) {
            await supabase.from('product_history').insert({
              product_id: id,
              field_name: field,
              old_value: String(oldProduct[field as keyof Product]),
              new_value: String(updates[field as keyof Product]),
              changed_by: user?.id,
            });
          }
        }

        return data;
      } catch (error) {
        console.warn('Supabase update failed, falling back to mock data', error);
        return mockService.update<Product>('products', id, updates);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Product updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('Supabase delete failed, falling back to mock data', error);
        mockService.delete('products', id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({ title: 'Product deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    },
  });
}

export function useProductHistory(productId: string) {
  return useQuery({
    queryKey: ['product-history', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_history')
        .select(`
          *,
          profile:profiles(first_name, last_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: async () => {
      const isMockMode = localStorage.getItem('mockSession');

      if (isMockMode) {
        const products = mockService.get<Product>('products');
        return products.filter(p => p.quantity <= p.reorder_level);
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            supplier:suppliers(*)
          `)
          .order('quantity', { ascending: true });

        if (error) throw error;

        // Filter products where quantity <= reorder_level
        const lowStockProducts = (data as unknown as Product[]).filter(
          p => p.quantity <= p.reorder_level
        );

        return lowStockProducts;
      } catch (error) {
        console.warn('Supabase fetch failed, falling back to mock data', error);
        const products = mockService.get<Product>('products');
        return products.filter(p => p.quantity <= p.reorder_level);
      }
    },
  });
}
