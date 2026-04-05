import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Warehouse } from '@/types/database';
import { mapWarehouseDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';
import { WarehouseDto } from '@/types/api';

export function useWarehouses() {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      try {
        const data = await apiService.get<WarehouseDto[]>('/warehouses');
        return data.map(mapWarehouseDto);
      } catch (error) {
        console.error('Failed to fetch warehouses:', error);
        throw error;
      }
    },
  });
}

export function useWarehouse(id: string | undefined) {
  return useQuery({
    queryKey: ['warehouses', id],
    queryFn: async () => {
      const data = await apiService.get<WarehouseDto>(`/warehouses/${id}`);
      return mapWarehouseDto(data);
    },
    enabled: !!id,
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (warehouse: Omit<Warehouse, 'id' | 'created_at' | 'updated_at'>) => {
      const data = await apiService.post<WarehouseDto>('/warehouses', {
        name: warehouse.name,
        code: warehouse.name?.slice(0, 6).toUpperCase() || 'WH',
        street: warehouse.location ?? '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        contactPerson: '',
        phone: '',
        isActive: true,
      });
      return mapWarehouseDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Warehouse created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating warehouse', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...warehouse }: { id: string; name: string; code?: string; street?: string; city?: string; state?: string; country?: string; zipCode?: string; contactPerson?: string; phone?: string }) => {
      await apiService.put(`/warehouses/${id}`, {
        name: warehouse.name,
        code: warehouse.code || warehouse.name?.slice(0, 6).toUpperCase() || 'WH',
        street: warehouse.street ?? '',
        city: warehouse.city ?? '',
        state: warehouse.state ?? '',
        country: warehouse.country ?? '',
        zipCode: warehouse.zipCode ?? '',
        contactPerson: warehouse.contactPerson ?? '',
        phone: warehouse.phone ?? '',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Warehouse updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating warehouse', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(`/warehouses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Warehouse deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting warehouse', description: error.message, variant: 'destructive' });
    },
  });
}
