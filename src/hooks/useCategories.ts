import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Category } from '@/types/database';
import { CategoryDto } from '@/types/api';
import { mapCategoryDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const data = await apiService.get<CategoryDto[]>('/categories');
        return data.map(mapCategoryDto);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
      }
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      try {
        const data = await apiService.get<CategoryDto>(`/categories/${id}`);
        return mapCategoryDto(data);
      } catch (error) {
        console.error(`Failed to fetch category ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: { name: string; description?: string; parent_id?: string | null }) => {
      const data = await apiService.post<CategoryDto>('/categories', {
        name: category.name,
        description: category.description ?? '',
        parentId: category.parent_id ?? null,
      });
      return mapCategoryDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating category', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Category> }) => {
      const data = await apiService.put<CategoryDto>(`/categories/${id}`, {
        name: updates.name ?? '',
        description: updates.description ?? '',
        parentId: updates.parent_id ?? null,
      });
      return mapCategoryDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating category', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Category deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting category', description: error.message, variant: 'destructive' });
    },
  });
}
