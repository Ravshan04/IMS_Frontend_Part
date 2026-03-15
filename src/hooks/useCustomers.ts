import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Customer, CustomerStatus } from '@/types/database';
import { CustomerDto } from '@/types/api';
import { mapCustomerDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const data = await apiService.get<CustomerDto[]>('/customers');
        return data.map(mapCustomerDto);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        throw error;
      }
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      try {
        const data = await apiService.get<CustomerDto>(`/customers/${id}`);
        return mapCustomerDto(data);
      } catch (error) {
        console.error(`Failed to fetch customer ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'total_orders' | 'total_spent'>) => {
      const data = await apiService.post<CustomerDto>('/customers', {
        name: customer.name,
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        address: customer.address ?? '',
        status: customer.status ?? 'active',
      });
      return mapCustomerDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Customer created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating customer', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Customer> }) => {
      const data = await apiService.put<CustomerDto>(`/customers/${id}`, {
        name: updates.name ?? '',
        email: updates.email ?? '',
        phone: updates.phone ?? '',
        address: updates.address ?? '',
        status: (updates.status ?? 'active') as CustomerStatus,
      });
      return mapCustomerDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Customer updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating customer', description: error.message, variant: 'destructive' });
    },
  });
}

export function useToggleCustomerStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (customer: Customer) => {
      const newStatus: CustomerStatus = customer.status === 'active' ? 'inactive' : 'active';
      const data = await apiService.put<CustomerDto>(`/customers/${customer.id}`, {
        name: customer.name,
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        address: customer.address ?? '',
        status: newStatus,
      });
      return mapCustomerDto(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: `Customer ${data.status === 'active' ? 'activated' : 'deactivated'} successfully` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating customer status', description: error.message, variant: 'destructive' });
    },
  });
}
