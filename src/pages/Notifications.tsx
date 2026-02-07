import { useState } from 'react';
import { Bell, AlertTriangle, Package, Truck, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/types/database';

const notificationIcons: Record<NotificationType, React.ElementType> = {
  low_stock: AlertTriangle,
  order_created: Package,
  order_approved: CheckCircle,
  order_shipped: Truck,
  order_received: CheckCircle,
  order_cancelled: X,
  system: Bell,
};

const notificationColors: Record<NotificationType, string> = {
  low_stock: 'text-warning',
  order_created: 'text-primary',
  order_approved: 'text-success',
  order_shipped: 'text-primary',
  order_received: 'text-success',
  order_cancelled: 'text-destructive',
  system: 'text-muted-foreground',
};

export default function Notifications() {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const handleNotificationClick = async (notification: {
    id: string;
    type: NotificationType;
    reference_id: string | null;
    read: boolean;
  }) => {
    if (!notification.read) {
      await markAsRead.mutateAsync(notification.id);
    }

    if (notification.reference_id) {
      switch (notification.type) {
        case 'low_stock':
          navigate(`/products?highlight=${notification.reference_id}`);
          break;
        case 'order_created':
        case 'order_approved':
        case 'order_shipped':
        case 'order_received':
        case 'order_cancelled':
          navigate(`/orders?view=${notification.reference_id}`);
          break;
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with inventory alerts</p>
            </div>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                className="border-border"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                {markAllAsRead.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const Icon = notificationIcons[notification.type];
              const iconColor = notificationColors[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'glass rounded-xl p-4 flex items-start gap-4 transition-all duration-300 animate-slide-up cursor-pointer hover:bg-muted/50',
                    !notification.read && 'border-l-2 border-l-primary'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={cn('p-3 rounded-xl bg-secondary', iconColor)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={cn(
                          'font-semibold',
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        )}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
