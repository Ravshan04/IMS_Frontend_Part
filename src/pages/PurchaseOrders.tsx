import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Eye, FileText, Truck, CheckCircle, XCircle, Clock, Loader2, Check, Package } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePurchaseOrders, usePurchaseOrder, useUpdatePurchaseOrderStatus, useReceivePurchaseOrder } from '@/hooks/usePurchaseOrders';
import { useAuth } from '@/contexts/AuthContext';
import CreateOrderModal from '@/components/orders/CreateOrderModal';
import { PurchaseOrder, OrderStatus } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function PurchaseOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdminOrManager } = useAuth();
  const supplierId = searchParams.get('supplier') || undefined;

  const { data: orders, isLoading } = usePurchaseOrders({ supplierId });
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
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('create');
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  const getStatusConfig = useCallback((status: OrderStatus) => {
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
  }, []);

  const handleUpdateStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    await updateStatus.mutateAsync({ id: orderId, status });
    setViewOrderId(null);
  }, [updateStatus]);

  const handleReceiveOrder = useCallback(async () => {
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
  }, [receiveOrderData, receivedQuantities, receiveOrder]);

  const statusStats = useMemo(() => {
    if (!orders) return { pending: 0, approved: 0, shipped: 0, received: 0 };
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      approved: orders.filter(o => o.status === 'approved').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      received: orders.filter(o => o.status === 'received').length,
    };
  }, [orders]);

  const columns = useMemo(() => [
    {
      key: 'order_number',
      header: 'Order ID',
      sortable: true,
      render: (item: PurchaseOrder) => (
        <span className="font-mono text-sm text-primary font-medium">{item.order_number}</span>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (item: PurchaseOrder) => (
        <span className="font-medium text-foreground">{item.supplier?.name || 'Unknown'}</span>
      ),
    },
    {
      key: 'total_amount',
      header: 'Total Amount',
      sortable: true,
      render: (item: PurchaseOrder) => (
        <span className="font-semibold text-foreground">${Number(item.total_amount).toLocaleString()}</span>
      ),
    },
    {
      key: 'order_date',
      header: 'Order Date',
      sortable: true,
      render: (item: PurchaseOrder) => (
        <span className="text-muted-foreground text-sm">
          {new Date(item.order_date).toLocaleDateString()}
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
          <Badge variant={config.variant} className="gap-1.5 capitalize font-medium py-0.5">
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
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => setViewOrderId(item.id)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {isAdminOrManager && item.status === 'pending' && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-[10px] uppercase font-bold tracking-wider"
              onClick={() => handleUpdateStatus(item.id, 'approved')}
            >
              Approve
            </Button>
          )}
          {isAdminOrManager && item.status === 'approved' && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-[10px] uppercase font-bold tracking-wider"
              onClick={() => handleUpdateStatus(item.id, 'shipped')}
            >
              Ship
            </Button>
          )}
          {item.status === 'shipped' && (
            <Button
              variant="default"
              size="sm"
              className="h-7 text-[10px] uppercase font-bold tracking-wider"
              onClick={() => setReceiveOrderId(item.id)}
            >
              Receive
            </Button>
          )}
        </div>
      ),
    },
  ], [isAdminOrManager, getStatusConfig, handleUpdateStatus]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Purchase Orders"
          description="Track incoming shipments and manage procurement."
        >
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90 shadow-sm" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          )}
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending Approval', count: statusStats.pending, color: 'text-warning', variant: 'bg-warning/10' },
            { label: 'In Production', count: statusStats.approved, color: 'text-muted-foreground', variant: 'bg-muted/10' },
            { label: 'In Transit', count: statusStats.shipped, color: 'text-primary', variant: 'bg-primary/10' },
            { label: 'Completed', count: statusStats.received, color: 'text-success', variant: 'bg-success/10' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={cn("glass rounded-xl p-5 border border-border/50 animate-slide-up")}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3", stat.variant)}>
                <div className={cn("w-2 h-2 rounded-full", stat.color.replace('text-', 'bg-'))} />
              </div>
              <p className={cn("text-3xl font-bold mb-1", stat.color)}>{stat.count}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:250ms]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground animate-pulse">Loading orders...</p>
            </div>
          ) : (
            <DataTable
              data={orders || []}
              columns={columns}
              searchKeys={['order_number']}
              emptyMessage="No purchase orders found."
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
        <DialogContent className="max-w-2xl bg-card border-border border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              PO #{viewOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-8 mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Supplier</p>
                  <p className="font-semibold text-foreground">{viewOrder.supplier?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Status</p>
                  <Badge variant={getStatusConfig(viewOrder.status).variant} className="capitalize py-0">
                    {getStatusConfig(viewOrder.status).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Order Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(viewOrder.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Expected</p>
                  <p className="font-semibold text-foreground">
                    {viewOrder.expected_date ? new Date(viewOrder.expected_date).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
              </div>

              {viewOrder.items && viewOrder.items.length > 0 && (
                <div className="bg-secondary/30 rounded-2xl border border-border/50 overflow-hidden">
                  <div className="bg-secondary/50 px-6 py-4 border-b border-border/50">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-foreground flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      Order manifest
                    </h4>
                  </div>
                  <div className="px-6 py-4 space-y-4">
                    {viewOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {item.product?.name || 'Unknown Item'}
                          </span>
                          <span className="text-xs text-muted-foreground">Unit cost: ${Number(item.unit_cost).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="text-muted-foreground font-mono">×{item.quantity}</span>
                          <span className="text-foreground font-bold tabular-nums">
                            ${(item.quantity * Number(item.unit_cost)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-border/50 pt-4 flex justify-between items-end">
                      <span className="text-sm font-bold uppercase tracking-widest">Grand Total</span>
                      <span className="text-2xl font-black text-primary tabular-nums">
                        ${Number(viewOrder.total_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {viewOrder.notes && (
                <div className="bg-warning/5 border border-warning/10 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-warning mb-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Special Instructions
                  </p>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">{viewOrder.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-8 gap-2">
            {isAdminOrManager && viewOrder?.status === 'pending' && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleUpdateStatus(viewOrder.id, 'cancelled')}
                  className="text-destructive hover:bg-destructive/10 rounded-full"
                >
                  Cancel Order
                </Button>
                <Button
                  className="bg-success hover:bg-success/90 rounded-full px-8 shadow-lg shadow-success/20"
                  onClick={() => handleUpdateStatus(viewOrder.id, 'approved')}
                >
                  Approve Order
                </Button>
              </>
            )}
            {isAdminOrManager && viewOrder?.status === 'approved' && (
              <Button
                className="bg-primary hover:bg-primary/90 rounded-full px-8 shadow-lg shadow-primary/20"
                onClick={() => handleUpdateStatus(viewOrder.id, 'shipped')}
              >
                Dispatch Shipment
              </Button>
            )}
            {viewOrder?.status === 'shipped' && (
              <Button
                className="bg-success hover:bg-success/90 rounded-full px-8 shadow-lg shadow-success/20"
                onClick={() => {
                  setViewOrderId(null);
                  setReceiveOrderId(viewOrder.id);
                }}
              >
                Mark as Received
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Order Modal */}
      <Dialog open={!!receiveOrderId} onOpenChange={(open) => !open && setReceiveOrderId(null)}>
        <DialogContent className="max-w-lg bg-card border-border border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              Confirm Receipt
            </DialogTitle>
          </DialogHeader>

          {receiveOrderData?.items && (
            <div className="space-y-6 mt-6">
              <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl border border-border/50">
                Verify the quantities received against the purchase order. This will update your inventory stock levels.
              </p>
              <div className="space-y-4">
                {receiveOrderData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-6 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{item.product?.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Package className="w-3 h-3" />
                        Expected: {item.quantity} units
                      </p>
                    </div>
                    <div className="w-24">
                      <Label className="sr-only">Received</Label>
                      <Input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={receivedQuantities[item.id] ?? item.quantity}
                        onChange={(e) => setReceivedQuantities({
                          ...receivedQuantities,
                          [item.id]: parseInt(e.target.value) || 0,
                        })}
                        className="bg-secondary border-border rounded-lg text-center font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="mt-8 gap-2">
            <Button variant="ghost" onClick={() => setReceiveOrderId(null)} className="rounded-full">
              Discard
            </Button>
            <Button
              className="bg-success hover:bg-success/90 rounded-full px-8 shadow-lg shadow-success/20"
              onClick={handleReceiveOrder}
              disabled={receiveOrder.isPending}
            >
              {receiveOrder.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Complete Intake
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
