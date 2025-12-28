import { Bell, AlertTriangle, Package, Truck, CheckCircle, Clock, X } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const notifications = [
  {
    id: 1,
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: '4K Monitor 27" has reached reorder level (5 remaining)',
    time: '2 minutes ago',
    read: false,
    icon: AlertTriangle,
    color: 'text-warning',
  },
  {
    id: 2,
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Ergonomic Office Chair is below reorder level (8 remaining)',
    time: '15 minutes ago',
    read: false,
    icon: AlertTriangle,
    color: 'text-warning',
  },
  {
    id: 3,
    type: 'order_shipped',
    title: 'Order Shipped',
    message: 'PO-003 from Premium Furnishings has been shipped',
    time: '1 hour ago',
    read: false,
    icon: Truck,
    color: 'text-primary',
  },
  {
    id: 4,
    type: 'order_received',
    title: 'Order Received',
    message: 'PO-004 from Office Essentials has been received and stock updated',
    time: '3 hours ago',
    read: true,
    icon: CheckCircle,
    color: 'text-success',
  },
  {
    id: 5,
    type: 'order_delayed',
    title: 'Delivery Delayed',
    message: 'PO-002 expected delivery has been delayed by 2 days',
    time: '5 hours ago',
    read: true,
    icon: Clock,
    color: 'text-destructive',
  },
  {
    id: 6,
    type: 'new_product',
    title: 'New Product Added',
    message: 'Mechanical Keyboard has been added to inventory',
    time: '1 day ago',
    read: true,
    icon: Package,
    color: 'text-primary',
  },
];

export default function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

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
            <Button variant="outline" className="border-border">
              Mark all as read
            </Button>
            <Button variant="outline" className="border-border text-destructive hover:text-destructive">
              Clear all
            </Button>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={cn(
                  'glass rounded-xl p-4 flex items-start gap-4 transition-all duration-300 animate-slide-up',
                  !notification.read && 'border-l-2 border-l-primary',
                  `[animation-delay:${index * 50}ms]`
                )}
              >
                <div className={cn('p-3 rounded-xl bg-secondary', notification.color)}>
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
                      <p className="text-xs text-muted-foreground/60 mt-2">{notification.time}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:text-destructive flex-shrink-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
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
