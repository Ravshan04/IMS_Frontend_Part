import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, ShoppingBag, DollarSign } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const mockCustomers = [
  { id: '1', name: 'Acme Corporation', email: 'orders@acme.com', phone: '+1 555-0201', totalOrders: 45, totalSpent: 125000, status: 'active' },
  { id: '2', name: 'TechStart Inc', email: 'procurement@techstart.io', phone: '+1 555-0202', totalOrders: 28, totalSpent: 78500, status: 'active' },
  { id: '3', name: 'Global Enterprises', email: 'supply@globalent.com', phone: '+1 555-0203', totalOrders: 62, totalSpent: 195000, status: 'active' },
  { id: '4', name: 'StartUp Labs', email: 'admin@startuplabs.co', phone: '+1 555-0204', totalOrders: 15, totalSpent: 32000, status: 'inactive' },
  { id: '5', name: 'Digital Solutions', email: 'orders@digsol.com', phone: '+1 555-0205', totalOrders: 38, totalSpent: 89000, status: 'active' },
  { id: '6', name: 'Innovation Hub', email: 'purchase@innohub.net', phone: '+1 555-0206', totalOrders: 22, totalSpent: 54000, status: 'active' },
];

export default function Customers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (item: typeof mockCustomers[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (item: typeof mockCustomers[0]) => (
        <span className="text-muted-foreground">{item.phone}</span>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      sortable: true,
      render: (item: typeof mockCustomers[0]) => (
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{item.totalOrders}</span>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      render: (item: typeof mockCustomers[0]) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">${item.totalSpent.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof mockCustomers[0]) => (
        <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
          {item.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Mail className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Customers</h1>
            <p className="text-muted-foreground">Manage your customer relationships</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Company name" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@company.com" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+1 555-0000" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Company address" className="bg-secondary border-border" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    Add Customer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">210</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:50ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">$573.5k</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:100ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Active Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:150ms]">
          <DataTable
            data={mockCustomers}
            columns={columns}
            searchKeys={['name', 'email']}
          />
        </div>
      </div>
    </MainLayout>
  );
}
