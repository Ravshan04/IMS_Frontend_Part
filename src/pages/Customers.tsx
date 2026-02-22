import { useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Mail, ShoppingBag, DollarSign, Loader2, UserX, UserCheck } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers, useToggleCustomerStatus } from '@/hooks/useCustomers';
import { useAuth } from '@/contexts/AuthContext';
import CustomerFormModal from '@/components/customers/CustomerFormModal';
import { Customer } from '@/types/database';
import { cn } from '@/lib/utils';

export default function Customers() {
  const { isAdminOrManager } = useAuth();
  const { data: customers, isLoading } = useCustomers();
  const toggleStatus = useToggleCustomerStatus();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const customerStats = useMemo(() => {
    if (!customers) return { active: 0, orders: 0, revenue: 0 };
    return {
      active: customers.filter(c => c.status === 'active').length,
      orders: customers.reduce((sum, c) => sum + c.total_orders, 0),
      revenue: customers.reduce((sum, c) => sum + Number(c.total_spent), 0)
    };
  }, [customers]);

  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (item: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone Number',
      render: (item: Customer) => (
        <span className="text-muted-foreground text-sm">{item.phone || 'N/A'}</span>
      ),
    },
    {
      key: 'total_orders',
      header: 'Orders',
      sortable: true,
      render: (item: Customer) => (
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary bg-primary/10 rounded p-0.5" />
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
          <DollarSign className="w-4 h-4 text-success bg-success/10 rounded p-0.5" />
          <span className="font-semibold text-foreground">${Number(item.total_spent).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Customer) => (
        <Badge variant={item.status === 'active' ? 'success' : 'secondary'} className="capitalize py-0">
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Customer) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="hover:text-primary h-8 w-8" title="Send Email">
            <Mail className="w-4 h-4" />
          </Button>
          {isAdminOrManager && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary h-8 w-8"
                onClick={() => setEditCustomer(item)}
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", item.status === 'active' ? 'hover:text-destructive' : 'hover:text-success')}
                onClick={() => toggleStatus.mutate({ id: item.id, currentStatus: item.status })}
                disabled={toggleStatus.isPending}
                title={item.status === 'active' ? 'Deactivate' : 'Activate'}
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
  ], [isAdminOrManager, toggleStatus]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Customers"
          description="Build and maintain strong relationships with your client base."
        >
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90 shadow-sm" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          )}
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{customerStats.orders}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Total Lifetime Orders</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:100ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${(customerStats.revenue / 1000).toFixed(1)}k
                </p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Cumulative Revenue</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:200ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{customerStats.active}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Active Customer Base</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:300ms]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground animate-pulse">Loading customers...</p>
            </div>
          ) : (
            <DataTable
              data={customers || []}
              columns={columns}
              searchKeys={['name', 'email']}
              emptyMessage="No customers found."
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
