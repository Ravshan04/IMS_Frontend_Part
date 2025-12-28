import { useState } from 'react';
import { Plus, Eye, FileText, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockSuppliers } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockOrders = [
  { id: 'PO-001', supplierId: '1', status: 'pending', totalAmount: 12500, orderDate: new Date('2024-01-15'), expectedDate: new Date('2024-01-22'), items: 5 },
  { id: 'PO-002', supplierId: '2', status: 'approved', totalAmount: 8750, orderDate: new Date('2024-01-14'), expectedDate: new Date('2024-01-21'), items: 3 },
  { id: 'PO-003', supplierId: '3', status: 'shipped', totalAmount: 25000, orderDate: new Date('2024-01-10'), expectedDate: new Date('2024-01-24'), items: 8 },
  { id: 'PO-004', supplierId: '4', status: 'received', totalAmount: 4200, orderDate: new Date('2024-01-05'), expectedDate: new Date('2024-01-12'), items: 12 },
  { id: 'PO-005', supplierId: '5', status: 'cancelled', totalAmount: 6800, orderDate: new Date('2024-01-03'), expectedDate: new Date('2024-01-10'), items: 4 },
  { id: 'PO-006', supplierId: '1', status: 'pending', totalAmount: 15600, orderDate: new Date('2024-01-16'), expectedDate: new Date('2024-01-23'), items: 7 },
];

export default function PurchaseOrders() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSupplier = (id: string) => mockSuppliers.find((s) => s.id === id)?.name || 'Unknown';

  const getStatusConfig = (status: string) => {
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
      default:
        return { label: status, variant: 'outline' as const, icon: FileText };
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      render: (item: typeof mockOrders[0]) => (
        <span className="font-mono text-sm text-primary">{item.id}</span>
      ),
    },
    {
      key: 'supplierId',
      header: 'Supplier',
      render: (item: typeof mockOrders[0]) => (
        <span className="text-foreground">{getSupplier(item.supplierId)}</span>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      sortable: true,
      render: (item: typeof mockOrders[0]) => (
        <span className="text-muted-foreground">{item.items} items</span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      sortable: true,
      render: (item: typeof mockOrders[0]) => (
        <span className="font-medium text-foreground">${item.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      sortable: true,
      render: (item: typeof mockOrders[0]) => (
        <span className="text-muted-foreground">
          {item.orderDate.toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'expectedDate',
      header: 'Expected Date',
      sortable: true,
      render: (item: typeof mockOrders[0]) => (
        <span className="text-muted-foreground">
          {item.expectedDate.toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof mockOrders[0]) => {
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
      render: () => (
        <Button variant="ghost" size="icon" className="hover:text-primary">
          <Eye className="w-4 h-4" />
        </Button>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create Purchase Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {mockSuppliers.map((sup) => (
                        <SelectItem key={sup.id} value={sup.id}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected Delivery Date</Label>
                  <Input type="date" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input placeholder="Order notes" className="bg-secondary border-border" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    Create Order
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending', count: 2, color: 'text-warning' },
            { label: 'Approved', count: 1, color: 'text-muted-foreground' },
            { label: 'Shipped', count: 1, color: 'text-primary' },
            { label: 'Received', count: 1, color: 'text-success' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`glass rounded-xl p-4 text-center animate-slide-up [animation-delay:${index * 50}ms]`}
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:200ms]">
          <DataTable
            data={mockOrders}
            columns={columns}
            searchKeys={['id', 'supplierId']}
          />
        </div>
      </div>
    </MainLayout>
  );
}
