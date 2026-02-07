import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { AlertTriangle, Package, Truck, CheckCircle, XCircle, Bell, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/types/database';

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  low_stock: AlertTriangle,
  order_created: Package,
  order_approved: CheckCircle,
  order_shipped: Truck,
  order_received: CheckCircle,
  order_cancelled: XCircle,
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

export default function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: { id: string; type: NotificationType; reference_id: string | null; reference_type: string | null; read: boolean }) => {
    if (!notification.read) {
      await markAsRead.mutateAsync(notification.id);
    }

    // Navigate based on type
    if (notification.reference_id) {
      switch (notification.type) {
        case 'low_stock':
          onOpenChange(false);
          navigate(`/products?highlight=${notification.reference_id}`);
          break;
        case 'order_created':
        case 'order_approved':
        case 'order_shipped':
        case 'order_received':
        case 'order_cancelled':
          onOpenChange(false);
          navigate(`/orders?view=${notification.reference_id}`);
          break;
      }
    }
  };

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                {markAllAsRead.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Mark all as read'
                )}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              const iconColor = notificationColors[notification.type];

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'glass rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50',
                    !notification.read && 'border-l-2 border-l-primary'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg bg-secondary', iconColor)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          'font-medium',
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium text-foreground">No notifications</p>
              <p className="text-muted-foreground mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
