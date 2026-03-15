import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Notification } from '@/types/database';
import { mapNotificationDto } from '@/services/apiMappers';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationDto } from '@/types/api';

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const data = await apiService.get<NotificationDto[]>('/notifications');
        return data.map(mapNotificationDto);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
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

      try {
        const notifications = (await apiService.get<NotificationDto[]>('/notifications')).map(mapNotificationDto);
        return notifications.filter(n => !n.read).length;
      } catch (error) {
        console.error('Failed to fetch unread notifications count:', error);
        throw error;
      }
    },
    enabled: !!user,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.patch(`/notifications/${id}/read`, {});
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
      await apiService.post('/notifications/read-all', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });
}

// Backend does not expose create notification endpoint for clients.
