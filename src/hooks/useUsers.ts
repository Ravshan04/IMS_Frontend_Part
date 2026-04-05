import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { mapUserSummaryDto } from '@/services/apiMappers';
import { useToast } from '@/hooks/use-toast';
import { UserSummaryDto, AuthResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await apiService.get<UserSummaryDto[]>('/users');
      return data.map(mapUserSummaryDto);
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (user: {
      email: string;
      password?: string;
      firstName: string;
      lastName: string;
    }) => {
      // Use the current organization ID
      const organizationId = session?.organizationId || '00000000-0000-0000-0000-000000000001';
      
      const response = await apiService.post<AuthResponse>('/auth/register', {
        email: user.email,
        password: user.password || 'Temporary@123', // Default temporary password
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: organizationId,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating user', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const data = await apiService.get<UserSummaryDto>(`/users/${id}`);
      return mapUserSummaryDto(data);
    },
    enabled: !!id,
  });
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: string[] }) => {
      const data = await apiService.patch<UserSummaryDto>(`/users/${userId}/roles`, { roles });
      return mapUserSummaryDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User roles updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating user roles', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateUserWarehouses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, warehouseIds }: { userId: string; warehouseIds: string[] }) => {
      const data = await apiService.patch<UserSummaryDto>(`/users/${userId}/warehouses`, { warehouseIds });
      return mapUserSummaryDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User warehouses updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating user warehouses', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const data = await apiService.patch<UserSummaryDto>(`/users/${userId}/status`, { isActive });
      return mapUserSummaryDto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User status updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating user status', description: error.message, variant: 'destructive' });
    },
  });
}
