import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, CustomerStatus } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Customer[];
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Customer;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'total_orders' | 'total_spent'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: CustomerStatus }) => {
      const newStatus: CustomerStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { data, error } = await supabase
        .from('customers')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
