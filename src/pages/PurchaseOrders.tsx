import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Eye, FileText, Truck, CheckCircle, XCircle, Clock, Loader2, Check, Package } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePurchaseOrders, usePurchaseOrder, useUpdatePurchaseOrderStatus, useReceivePurchaseOrder } from '@/hooks/usePurchaseOrders';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useAuth } from '@/contexts/AuthContext';
import CreateOrderModal from '@/components/orders/CreateOrderModal';
import { PurchaseOrder, OrderStatus } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';

export default function PurchaseOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin, isAdminOrManager } = useAuth();
  const supplierId = searchParams.get('supplier') || undefined;

  const { data: orders, isLoading } = usePurchaseOrders({ supplierId });
  const { data: suppliers } = useSuppliers();
  const updateStatus = useUpdatePurchaseOrderStatus();
  const receiveOrder = useReceivePurchaseOrder();

  const [createModalOpen, setCreateModalOpen] = useState(searchParams.get('create') === 'true');
  const [viewOrderId, setViewOrderId] = useState<string | null>(searchParams.get('view'));
  const [receiveOrderId, setReceiveOrderId] = useState<string | null>(null);
  const [receivedQuantities, setReceivedQuantities] = useState<Record<string, number>>({});

  const { data: viewOrder } = usePurchaseOrder(viewOrderId || '');
  const { data: receiveOrderData } = usePurchaseOrder(receiveOrderId || '');

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setCreateModalOpen(true);
      searchParams.delete('create');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', variant: 'warning' as const, icon: Clock };
      case 'approved':
        return { label: 'Approved', variant: 'secondary' as const, icon: FileText };
      case 'shipped':
        return { label: 'Shipped', variant: 'default' as const, icon: Truck };
      case 'received':
        return { label: 'Received', variant: 'success' as const, icon: CheckCircle };
      case 'cancelled':
        return { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle };
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await updateStatus.mutateAsync({ id: orderId, status });
    setViewOrderId(null);
  };

  const handleReceiveOrder = async () => {
    if (!receiveOrderData?.items) return;

    const receivedItems = receiveOrderData.items.map((item) => ({
      itemId: item.id,
      productId: item.product_id!,
      receivedQuantity: receivedQuantities[item.id] ?? item.quantity,
    }));

    await receiveOrder.mutateAsync({
      orderId: receiveOrderData.id,
      receivedItems,
    });

    setReceiveOrderId(null);
    setReceivedQuantities({});
  };

  const statusCounts = {
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    approved: orders?.filter(o => o.status === 'approved').length || 0,
    shipped: orders?.filter(o => o.status === 'shipped').length || 0,
    received: orders?.filter(o => o.status === 'received').length || 0,
  };

  const columns = [
    {
      key: 'order_number',
      header: 'Order ID',
      sortable: true,
      render: (item: PurchaseOrder) => (
        <span className="font-mono text-sm text-primary">{item.order_number}</span>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (item: PurchaseOrder) => (
        <span className="text-foreground">{item.supplier?.name || 'Unknown'}</span>
      ),
    },
    {
      key: 'total_amount',
      header: 'Total Amount',
      sortable: true,
      render: (item: PurchaseOrder) => (
        <span className="font-medium text-foreground">${Number(item.total_amount).toLocaleString()}</span>
      ),
    },
    {
      key: 'order_date',
      header: 'Order Date',
      sortable: true,
      render: (item: PurchaseOrder) => (
        <span className="text-muted-foreground">
          {new Date(item.order_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'expected_date',
      header: 'Expected Date',
      sortable: true,
      render: (item: PurchaseOrder) => (
        <span className="text-muted-foreground">
          {item.expected_date ? new Date(item.expected_date).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: PurchaseOrder) => {
        const config = getStatusConfig(item.status);
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: PurchaseOrder) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => setViewOrderId(item.id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {isAdminOrManager && item.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-success h-8"
              onClick={() => handleUpdateStatus(item.id, 'approved')}
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}
          {isAdminOrManager && item.status === 'approved' && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-primary h-8"
              onClick={() => handleUpdateStatus(item.id, 'shipped')}
            >
              <Truck className="w-4 h-4 mr-1" />
              Ship
            </Button>
          )}
          {item.status === 'shipped' && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-success h-8"
              onClick={() => setReceiveOrderId(item.id)}
            >
              <Package className="w-4 h-4 mr-1" />
              Receive
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage purchase orders and track deliveries</p>
          </div>
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending', count: statusCounts.pending, color: 'text-warning' },
            { label: 'Approved', count: statusCounts.approved, color: 'text-muted-foreground' },
            { label: 'Shipped', count: statusCounts.shipped, color: 'text-primary' },
            { label: 'Received', count: statusCounts.received, color: 'text-success' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`glass rounded-xl p-4 text-center animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:200ms]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              data={orders || []}
              columns={columns}
              searchKeys={['order_number']}
            />
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {/* View Order Modal */}
      <Dialog open={!!viewOrderId} onOpenChange={(open) => !open && setViewOrderId(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Order Details: {viewOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          
          {viewOrder && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium text-foreground">{viewOrder.supplier?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusConfig(viewOrder.status).variant}>
                    {getStatusConfig(viewOrder.status).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(viewOrder.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Date</p>
                  <p className="font-medium text-foreground">
                    {viewOrder.expected_date ? new Date(viewOrder.expected_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {viewOrder.items && viewOrder.items.length > 0 && (
                <div className="glass rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {viewOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product?.name || 'Unknown'} × {item.quantity}
                        </span>
                        <span className="text-foreground">
                          ${(item.quantity * Number(item.unit_cost)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 flex justify-between font-medium">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${Number(viewOrder.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {viewOrder.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-foreground">{viewOrder.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {isAdminOrManager && viewOrder?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(viewOrder.id, 'cancelled')}
                  className="text-destructive"
                >
                  Cancel Order
                </Button>
                <Button
                  className="bg-success hover:bg-success/90"
                  onClick={() => handleUpdateStatus(viewOrder.id, 'approved')}
                >
                  Approve Order
                </Button>
              </>
            )}
            {isAdminOrManager && viewOrder?.status === 'approved' && (
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleUpdateStatus(viewOrder.id, 'shipped')}
              >
                Mark as Shipped
              </Button>
            )}
            {viewOrder?.status === 'shipped' && (
              <Button
                className="bg-success hover:bg-success/90"
                onClick={() => {
                  setViewOrderId(null);
                  setReceiveOrderId(viewOrder.id);
                }}
              >
                Receive Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Order Modal */}
      <Dialog open={!!receiveOrderId} onOpenChange={(open) => !open && setReceiveOrderId(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Package className="w-5 h-5" />
              Receive Order: {receiveOrderData?.order_number}
            </DialogTitle>
          </DialogHeader>
          
          {receiveOrderData?.items && (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Enter the quantity received for each item:
              </p>
              {receiveOrderData.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">Ordered: {item.quantity}</p>
                  </div>
                  <div className="w-24">
                    <Label className="sr-only">Received Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      max={item.quantity}
                      value={receivedQuantities[item.id] ?? item.quantity}
                      onChange={(e) => setReceivedQuantities({
                        ...receivedQuantities,
                        [item.id]: parseInt(e.target.value) || 0,
                      })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveOrderId(null)}>
              Cancel
            </Button>
            <Button
              className="bg-success hover:bg-success/90"
              onClick={handleReceiveOrder}
              disabled={receiveOrder.isPending}
            >
              {receiveOrder.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
