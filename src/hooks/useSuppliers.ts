import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Supplier } from '@/types/database';
import { SupplierDto } from '@/types/api';
import { mapSupplierDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      try {
        const data = await apiService.get<SupplierDto[]>('/suppliers');
        return data.map(mapSupplierDto);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
        throw error;
      }
    },
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: async () => {
      try {
        const data = await apiService.get<SupplierDto>(`/suppliers/${id}`);
        return mapSupplierDto(data);
      } catch (error) {
        console.error(`Failed to fetch supplier ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at' | 'product_count'>) => {
      const data = await apiService.post<SupplierDto>('/suppliers', {
        name: supplier.name,
        contactPerson: supplier.contact_person ?? '',
        email: supplier.email ?? '',
        phone: supplier.phone ?? '',
        address: supplier.address ?? '',
        rating: supplier.rating ?? 0,
        leadTime: supplier.lead_time ?? 0,
      });
      return mapSupplierDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({ title: 'Supplier created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating supplier', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Supplier> }) => {
      const data = await apiService.put<SupplierDto>(`/suppliers/${id}`, {
        name: updates.name ?? '',
        contactPerson: updates.contact_person ?? '',
        email: updates.email ?? '',
        phone: updates.phone ?? '',
        address: updates.address ?? '',
        rating: updates.rating ?? 0,
        leadTime: updates.lead_time ?? 0,
      });
      return mapSupplierDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({ title: 'Supplier updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating supplier', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Supplier deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting supplier', description: error.message, variant: 'destructive' });
    },
  });
}
