import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { mockService } from '@/services/mockData';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Check if we are in mock mode
      const isMockMode = localStorage.getItem('mockSession');

      if (isMockMode) {
        return mockService.get('categories') as Category[];
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.warn('Supabase fetch failed, falling back to mock data', error);
        return mockService.get('categories') as Category[];
      }
      return data as Category[];
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const isMockMode = localStorage.getItem('mockSession');

      if (isMockMode) {
        return mockService.getById('categories', id) as Category;
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Supabase fetch failed, falling back to mock data', error);
        return mockService.getById('categories', id) as Category;
      }
      return data as Category;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: { name: string; description?: string; parent_id?: string | null }) => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert(category)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase create failed, falling back to mock data', error);
        return mockService.insert('categories', category);
      }
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
      try {
        const { data, error } = await supabase
          .from('categories')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase update failed, falling back to mock data', error);
        return mockService.update('categories', id, updates);
      }
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
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('Supabase delete failed, falling back to mock data', error);
        mockService.delete('categories', id);
      }
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
