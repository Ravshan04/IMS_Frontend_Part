import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, FolderTree, Package, DollarSign, Eye, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
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

  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    return categories?.find((c) => c.id === parentId)?.name;
  };

  const handleViewProducts = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteCategory.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
            <p className="text-muted-foreground">Organize your products into categories</p>
          </div>
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={cn(
                  'stat-card animate-slide-up',
                  `[animation-delay:${index * 50}ms]`
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-primary h-8 w-8"
                        onClick={() => handleViewProducts(category.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {isAdminOrManager && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary h-8 w-8"
                          onClick={() => setEditCategory(category)}
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
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-1">{category.name}</h3>
                  {category.parent_id && (
                    <p className="text-sm text-primary mb-2">
                      Parent: {getParentName(category.parent_id)}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold text-foreground">{category.product_count}</p>
                        <p className="text-xs text-muted-foreground">Products</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          ${(Number(category.total_value) / 1000).toFixed(0)}k
                        </p>
                        <p className="text-xs text-muted-foreground">Total Value</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <FolderTree className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No categories yet</h3>
            <p className="text-muted-foreground mb-4">Create your first category to organize products.</p>
            {isAdminOrManager && (
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
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
            <AlertDialogTitle className="text-foreground">Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.product_count && deleteConfirm.product_count > 0 ? (
                <>
                  This category has <strong>{deleteConfirm.product_count} products</strong>. 
                  Deleting will set their category to null. Continue?
                </>
              ) : (
                'Are you sure you want to delete this category? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteCategory.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
