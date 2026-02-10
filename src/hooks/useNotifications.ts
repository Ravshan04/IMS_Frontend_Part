import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { mockService } from '@/services/mockData';

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const isMockMode = localStorage.getItem('mockSession');

      if (isMockMode) {
        return mockService.get<Notification>('notifications');
      }

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Notification[];
      } catch (error) {
        console.warn('Supabase fetch failed, falling back to mock data', error);
        return mockService.get<Notification>('notifications');
      }
    },
    enabled: !!user,
  });
}

export function useUnreadNotificationsCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const isMockMode = localStorage.getItem('mockSession');

      if (isMockMode) {
        const notifications = mockService.get<Notification>('notifications');
        return notifications.filter(n => !n.read).length;
      }

      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);

        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.warn('Supabase fetch failed, falling back to mock data', error);
        const notifications = mockService.get<Notification>('notifications');
        return notifications.filter(n => !n.read).length;
      }
    },
    enabled: !!user,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('Supabase update failed, falling back to mock data', error);
        mockService.update<Notification>('notifications', id, { read: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false);

        if (error) throw error;
      } catch (error) {
        console.warn('Supabase update failed, falling back to mock data', error);
        const notifications = mockService.get<Notification>('notifications');
        notifications.forEach(n => {
          if (!n.read) {
            mockService.update<Notification>('notifications', n.id, { read: true });
          }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });
}
