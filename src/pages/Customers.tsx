import { useState } from 'react';
import { Plus, Edit, Mail, ShoppingBag, DollarSign, Loader2, UserX, UserCheck } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers, useToggleCustomerStatus } from '@/hooks/useCustomers';
import { useAuth } from '@/contexts/AuthContext';
import CustomerFormModal from '@/components/customers/CustomerFormModal';
import { Customer } from '@/types/database';

export default function Customers() {
  const { isAdminOrManager } = useAuth();
  const { data: customers, isLoading } = useCustomers();
  const toggleStatus = useToggleCustomerStatus();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const activeCustomers = customers?.filter(c => c.status === 'active').length || 0;
  const totalOrders = customers?.reduce((sum, c) => sum + c.total_orders, 0) || 0;
  const totalRevenue = customers?.reduce((sum, c) => sum + Number(c.total_spent), 0) || 0;

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (item: Customer) => (
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
      render: (item: Customer) => (
        <span className="text-muted-foreground">{item.phone || 'N/A'}</span>
      ),
    },
    {
      key: 'total_orders',
      header: 'Orders',
      sortable: true,
      render: (item: Customer) => (
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{item.total_orders}</span>
        </div>
      ),
    },
    {
      key: 'total_spent',
      header: 'Total Spent',
      sortable: true,
      render: (item: Customer) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">${Number(item.total_spent).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Customer) => (
        <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
          {item.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Customer) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:text-primary h-8 w-8">
            <Mail className="w-4 h-4" />
          </Button>
          {isAdminOrManager && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary h-8 w-8"
                onClick={() => setEditCustomer(item)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={item.status === 'active' ? 'hover:text-destructive h-8 w-8' : 'hover:text-success h-8 w-8'}
                onClick={() => toggleStatus.mutate({ id: item.id, currentStatus: item.status })}
                disabled={toggleStatus.isPending}
              >
                {item.status === 'active' ? (
                  <UserX className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </Button>
            </>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Customers</h1>
            <p className="text-muted-foreground">Manage your customer relationships</p>
          </div>
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
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
                <p className="text-2xl font-bold text-foreground">
                  ${(totalRevenue / 1000).toFixed(1)}k
                </p>
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
                <p className="text-2xl font-bold text-foreground">{activeCustomers}</p>
                <p className="text-sm text-muted-foreground">Active Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:150ms]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              data={customers || []}
              columns={columns}
              searchKeys={['name', 'email']}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CustomerFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode="create"
      />
      {editCustomer && (
        <CustomerFormModal
          open={!!editCustomer}
          onOpenChange={(open) => !open && setEditCustomer(null)}
          customer={editCustomer}
          mode="edit"
        />
      )}
    </MainLayout>
  );
}
