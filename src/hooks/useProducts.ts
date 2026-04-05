import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Product, ProductHistory } from '@/types/database';
import { mapProductDto, EMPTY_GUID } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';
import { ProductDto } from '@/types/api';

export function useProducts(filters?: {
  categoryId?: string;
}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
        let products = (await apiService.get<ProductDto[]>('/products')).map(mapProductDto);

        if (filters?.categoryId) {
          products = products.filter(p => p.category_id === filters.categoryId);
        }
        return products;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
      }
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const data = await apiService.get<ProductDto>(`/products/${id}`);
        return mapProductDto(data);
      } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
      const data = await apiService.post<ProductDto>('/products', {
        sku: product.sku,
        barcode: product.barcode ?? '',
        name: product.name,
        description: product.description ?? '',
        categoryId: product.category_id ?? EMPTY_GUID,
        unit: product.unit ?? 'Piece',
        cost: product.cost ?? 0,
        sellingPrice: product.price ?? 0,
        weight: product.weight ?? 0,
        length: product.length ?? 0,
        width: product.width ?? 0,
        height: product.height ?? 0,
        reorderPoint: product.reorder_point ?? 0,
        reorderQuantity: product.reorder_quantity ?? 0,
      });
      return mapProductDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
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

  return useMutation({
    mutationFn: async (product: Partial<Product> & { id: string }) => {
      const data = await apiService.put<ProductDto>(`/products/${product.id}`, {
        sku: product.sku,
        barcode: product.barcode ?? '',
        name: product.name,
        description: product.description ?? '',
        categoryId: product.category_id ?? EMPTY_GUID,
        unit: product.unit ?? 'Piece',
        cost: product.cost ?? 0,
        sellingPrice: product.price ?? 0,
        reorderPoint: product.reorder_point ?? 0,
        reorderQuantity: product.reorder_quantity ?? 0,
      });
      return mapProductDto(data);
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
      await apiService.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Product deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    },
  });
}

export function useProductHistory(productId: string) {
  return useQuery<ProductHistory[]>({
    queryKey: ['product-history', productId],
    queryFn: async () => {
      try {
        // Updated to use real history if backend becomes ready
        return [];
      } catch (error) {
        return [];
      }
    },
    enabled: !!productId,
  });
}

export function useLowStockProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'low-stock'],
    queryFn: async () => {
      try {
        return [];
      } catch (error) {
        console.error('Failed to fetch low stock products:', error);
        throw error;
      }
    },
  });
}
