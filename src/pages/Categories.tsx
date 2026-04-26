import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, FolderTree, Package, DollarSign, Eye, Loader2, Info } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import CategoryFormModal from '@/components/categories/CategoryFormModal';
import { Category } from '@/types/database';
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

export default function Categories() {
  const navigate = useNavigate();
  const { isAdmin, isAdminOrManager } = useAuth();
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  const getParentName = useCallback((parentId: string | null) => {
    if (!parentId) return null;
    return categories?.find((c) => c.id === parentId)?.name;
  }, [categories]);

  const handleViewProducts = useCallback((categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  }, [navigate]);

  const handleDelete = useCallback(async () => {
    if (deleteConfirm) {
      await deleteCategory.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteCategory]);

  const renderedCategories = useMemo(() => {
    if (!categories) return [];
    return categories;
  }, [categories]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Categories"
          description="Organize products into logical groups for better inventory management."
        >
          {isAdminOrManager && (
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add category
            </Button>
          )}
        </PageHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading categories…</p>
          </div>
        ) : renderedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderedCategories.map((category) => (
              <div
                key={category.id}
                className="bg-card border border-border rounded-xl p-5 transition-colors hover:border-primary/40 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleViewProducts(category.id)}
                      title="View products"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {isAdminOrManager && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditCategory(category)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => setDeleteConfirm(category)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.parent_id && (
                    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Info className="w-3 h-3" />
                      Child of {getParentName(category.parent_id)}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-grow">
                  {category.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold text-foreground tabular-nums">{category.product_count}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {Number(category.total_value) >= 1000
                          ? `$${(Number(category.total_value) / 1000).toFixed(1)}k`
                          : `$${Number(category.total_value).toLocaleString()}`}
                      </p>
                      <p className="text-xs text-muted-foreground">Total value</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-xl py-16 px-6 text-center animate-fade-in">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderTree className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No categories yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Create your first category to start organizing your products.
            </p>
            {isAdminOrManager && (
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add category
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode="create"
      />
      {editCategory && (
        <CategoryFormModal
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
          category={editCategory}
          mode="edit"
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {deleteConfirm?.product_count && deleteConfirm.product_count > 0 ? (
                <>
                  Warning: This category contains <span className="font-bold text-foreground">{deleteConfirm.product_count} products</span>.
                  Deleting it will leave these products uncategorized. This action is permanent.
                </>
              ) : (
                'Are you sure you want to delete this category? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deleteCategory.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
