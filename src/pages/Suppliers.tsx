import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Truck, Package, ShoppingCart, Star, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
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

  const handleViewProducts = (supplierId: string) => {
    navigate(`/products?supplier=${supplierId}`);
  };

  const handleViewOrders = (supplierId: string) => {
    navigate(`/orders?supplier=${supplierId}`);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteSupplier.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Supplier',
      sortable: true,
      render: (item: Supplier) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.contact_person || 'No contact'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (item: Supplier) => (
        <div>
          <p className="text-foreground">{item.email || 'N/A'}</p>
          <p className="text-sm text-muted-foreground">{item.phone || ''}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (item: Supplier) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'w-4 h-4',
                star <= Number(item.rating)
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground'
              )}
            />
          ))}
          <span className="ml-2 text-muted-foreground">({item.rating})</span>
        </div>
      ),
    },
    {
      key: 'lead_time',
      header: 'Lead Time',
      sortable: true,
      render: (item: Supplier) => (
        <Badge variant="outline" className="bg-secondary/50">
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
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{item.product_count}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Supplier) => (
        <div className="flex items-center gap-1">
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
            title="View Orders"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          {isAdminOrManager && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary h-8 w-8"
              onClick={() => setEditSupplier(item)}
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
            >
              <Trash2 className="w-4 h-4" />
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Suppliers</h1>
            <p className="text-muted-foreground">Manage your supplier relationships</p>
          </div>
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{suppliers?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Suppliers</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:50ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10 text-warning">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {suppliers && suppliers.length > 0
                    ? (suppliers.reduce((sum, s) => sum + Number(s.rating), 0) / suppliers.length).toFixed(1)
                    : '0'}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </div>
          <div className="stat-card animate-slide-up [animation-delay:100ms]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {suppliers?.reduce((sum, s) => sum + s.product_count, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Products</p>
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
              data={suppliers || []}
              columns={columns}
              searchKeys={['name', 'contact_person', 'email']}
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
            <AlertDialogTitle className="text-foreground">Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.product_count && deleteConfirm.product_count > 0 ? (
                <>
                  This supplier has <strong>{deleteConfirm.product_count} products</strong>. 
                  Deleting will set their supplier to null. Continue?
                </>
              ) : (
                'Are you sure you want to delete this supplier? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteSupplier.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
