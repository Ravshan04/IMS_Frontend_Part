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
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Categories"
          description="Organize your products into logical groups for better inventory management."
        >
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90 shadow-sm" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}
        </PageHeader>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
            <p className="text-muted-foreground animate-pulse">Loading categories...</p>
          </div>
        ) : renderedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderedCategories.map((category, index) => (
              <div
                key={category.id}
                className={cn(
                  'stat-card animate-slide-up group overflow-hidden',
                  `[animation-delay:${index * 50}ms]`
                )}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <FolderTree className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-primary h-8 w-8"
                        onClick={() => handleViewProducts(category.id)}
                        title="View Products"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {isAdminOrManager && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary h-8 w-8"
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
                          className="hover:text-destructive h-8 w-8"
                          onClick={() => setDeleteConfirm(category)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                    {category.parent_id && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                        <Info className="w-3 h-3" />
                        Child of {getParentName(category.parent_id)}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">{category.description || 'No description provided for this category.'}</p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{category.product_count}</p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Products</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          ${(Number(category.total_value) / 1000).toFixed(0)}k
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Total Value</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-20 text-center border-dashed border-2 animate-fade-in">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderTree className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No categories yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Create your first category to start organizing your products and see analytics.</p>
            {isAdminOrManager && (
              <Button className="bg-primary hover:bg-primary/90 px-8 h-12 rounded-full shadow-lg" onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Category
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
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-full text-white"
            >
              {deleteCategory.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
