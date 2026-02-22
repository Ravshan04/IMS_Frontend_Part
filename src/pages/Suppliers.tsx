import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Truck, Package, ShoppingCart, Star, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSuppliers, useDeleteSupplier } from '@/hooks/useSuppliers';
import { useAuth } from '@/contexts/AuthContext';
import SupplierFormModal from '@/components/suppliers/SupplierFormModal';
import { Supplier } from '@/types/database';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Suppliers() {
  const navigate = useNavigate();
  const { isAdmin, isAdminOrManager } = useAuth();
  const { data: suppliers, isLoading } = useSuppliers();
  const deleteSupplier = useDeleteSupplier();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Supplier | null>(null);

  const handleViewProducts = useCallback((supplierId: string) => {
    navigate(`/products?supplier=${supplierId}`);
  }, [navigate]);

  const handleViewOrders = useCallback((supplierId: string) => {
    navigate(`/orders?supplier=${supplierId}`);
  }, [navigate]);

  const handleDelete = useCallback(async () => {
    if (deleteConfirm) {
      await deleteSupplier.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteSupplier]);

  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Supplier',
      sortable: true,
      render: (item: Supplier) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.contact_person || 'No contact person'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact Info',
      render: (item: Supplier) => (
        <div className="text-sm">
          <p className="text-foreground font-medium">{item.email || 'N/A'}</p>
          <p className="text-muted-foreground">{item.phone || ''}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (item: Supplier) => (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'w-3.5 h-3.5',
                star <= Number(item.rating)
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground/30'
              )}
            />
          ))}
          <span className="ml-1.5 text-xs font-semibold text-muted-foreground">{item.rating}</span>
        </div>
      ),
    },
    {
      key: 'lead_time',
      header: 'Lead Time',
      sortable: true,
      render: (item: Supplier) => (
        <Badge variant="outline" className="bg-secondary/30 border-border/50 font-normal">
          {item.lead_time} days
        </Badge>
      ),
    },
    {
      key: 'product_count',
      header: 'Products',
      sortable: true,
      render: (item: Supplier) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary bg-primary/10 rounded p-0.5" />
          <span className="text-sm font-medium">{item.product_count}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Supplier) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => handleViewProducts(item.id)}
            title="View Products"
          >
            <Package className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => handleViewOrders(item.id)}
            title="Purchase History"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          {isAdminOrManager && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary h-8 w-8"
              onClick={() => setEditSupplier(item)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-destructive h-8 w-8"
              onClick={() => setDeleteConfirm(item)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ], [isAdmin, isAdminOrManager, handleViewProducts, handleViewOrders]);

  const supplierStats = useMemo(() => {
    if (!suppliers || suppliers.length === 0) return { count: 0, avgRating: '0', totalProducts: 0 };
    return {
      count: suppliers.length,
      avgRating: (suppliers.reduce((sum, s) => sum + Number(s.rating), 0) / suppliers.length).toFixed(1),
      totalProducts: suppliers.reduce((sum, s) => sum + s.product_count, 0)
    };
  }, [suppliers]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Suppliers"
          description="Manage your partner relationships and supply chain."
        >
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90 shadow-sm" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          )}
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{supplierStats.count}</p>
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Total Suppliers</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:100ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10 text-warning">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{supplierStats.avgRating}</p>
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:200ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{supplierStats.totalProducts}</p>
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Associated Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:300ms]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground animate-pulse">Loading suppliers...</p>
            </div>
          ) : (
            <DataTable
              data={suppliers || []}
              columns={columns}
              searchKeys={['name', 'contact_person', 'email']}
              emptyMessage="No suppliers found."
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <SupplierFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode="create"
      />
      {editSupplier && (
        <SupplierFormModal
          open={!!editSupplier}
          onOpenChange={(open) => !open && setEditSupplier(null)}
          supplier={editSupplier}
          mode="edit"
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {deleteConfirm?.product_count && deleteConfirm.product_count > 0 ? (
                <>
                  Warning: This supplier is linked to <span className="font-bold text-foreground">{deleteConfirm.product_count} products</span>.
                  Deleting it may leave products without a supplier. This action is permanent.
                </>
              ) : (
                'Are you sure you want to delete this supplier? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-full text-white"
            >
              {deleteSupplier.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Supplier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
