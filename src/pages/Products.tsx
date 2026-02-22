import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download, Edit, Trash2, History, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useAuth } from '@/contexts/AuthContext';
import ProductFormModal from '@/components/products/ProductFormModal';
import ProductHistoryModal from '@/components/products/ProductHistoryModal';
import DeleteProductModal from '@/components/products/DeleteProductModal';
import { Product } from '@/types/database';
import { cn } from '@/lib/utils';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin, isAdminOrManager } = useAuth();

  const [filters, setFilters] = useState({
    categoryId: searchParams.get('category') || '',
    supplierId: searchParams.get('supplier') || '',
    lowStockOnly: searchParams.get('lowStock') === 'true',
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useProducts(filters.categoryId || filters.supplierId || filters.lowStockOnly ? {
    categoryId: filters.categoryId || undefined,
    supplierId: filters.supplierId || undefined,
    lowStockOnly: filters.lowStockOnly,
  } : undefined);
  const { data: categories } = useCategories();
  const { data: suppliers } = useSuppliers();

  // Handle URL params for edit modal
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && products) {
      const product = products.find(p => p.id === editId);
      if (product) {
        setEditProduct(product);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('edit');
        setSearchParams(newParams);
      }
    }
  }, [searchParams, products, setSearchParams]);

  const getStockStatus = useCallback((quantity: number, reorderLevel: number) => {
    if (quantity <= 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= reorderLevel) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  }, []);

  const handleExport = useCallback(() => {
    if (!products) return;

    const headers = ['SKU', 'Name', 'Description', 'Category', 'Supplier', 'Quantity', 'Reorder Level', 'Price', 'Cost', 'Location', 'Created At', 'Updated At'];
    const rows = products.map(p => [
      p.sku,
      p.name,
      p.description || '',
      p.category?.name || '',
      p.supplier?.name || '',
      p.quantity.toString(),
      p.reorder_level.toString(),
      p.price.toString(),
      p.cost.toString(),
      p.location || '',
      new Date(p.created_at).toLocaleDateString(),
      new Date(p.updated_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [products]);

  const columns = useMemo(() => [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      render: (item: Product) => (
        <span className="font-mono text-sm text-primary font-medium">{item.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (item: Product) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-foreground truncate">{item.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {item.description || 'No description'}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item: Product) => (
        <Badge variant="outline" className="bg-secondary/30 border-border/50 font-normal">
          {item.category?.name || 'Uncategorized'}
        </Badge>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (item: Product) => (
        <span className="text-muted-foreground text-sm">{item.supplier?.name || 'No supplier'}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Qty',
      sortable: true,
      render: (item: Product) => (
        <span className={cn(
          'font-semibold',
          item.quantity <= item.reorder_level ? 'text-warning' : 'text-foreground'
        )}>
          {item.quantity}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (item: Product) => (
        <span className="font-medium text-foreground">${item.price.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Product) => {
        const status = getStockStatus(item.quantity, item.reorder_level);
        return <Badge variant={status.variant} className="capitalize">{status.label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Product) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => setHistoryProduct(item)}
            title="History"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => setEditProduct(item)}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-destructive h-8 w-8"
              onClick={() => setDeleteProduct(item)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ], [isAdmin, getStockStatus]);

  const clearFilters = useCallback(() => {
    setFilters({ categoryId: '', supplierId: '', lowStockOnly: false });
  }, []);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Products"
          description="Manage your product inventory and stock levels."
        >
          <Button variant="outline" className="border-border hidden sm:flex" onClick={handleExport} disabled={!products?.length}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {isAdminOrManager && (
            <Button className="bg-primary hover:bg-primary/90 shadow-sm" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          )}
        </PageHeader>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in [animation-delay:100ms]">
          <Select
            value={filters.categoryId}
            onValueChange={(value) => setFilters(f => ({ ...f, categoryId: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[160px] bg-secondary/50 border-border">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.supplierId}
            onValueChange={(value) => setFilters(f => ({ ...f, supplierId: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[160px] bg-secondary/50 border-border">
              <SelectValue placeholder="All Suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers?.map((sup) => (
                <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={filters.lowStockOnly ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'border-border h-9',
              filters.lowStockOnly && 'bg-warning text-warning-foreground hover:bg-warning/90 border-warning'
            )}
            onClick={() => setFilters(f => ({ ...f, lowStockOnly: !f.lowStockOnly }))}
          >
            Low Stock
          </Button>

          {(filters.categoryId || filters.supplierId || filters.lowStockOnly) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Data Table */}
        <div className="animate-slide-up [animation-delay:200ms]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground animate-pulse">Loading products...</p>
            </div>
          ) : (
            <DataTable
              data={products || []}
              columns={columns}
              searchKeys={['name', 'sku', 'description']}
              emptyMessage="No products found matching your criteria."
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode="create"
      />
      {editProduct && (
        <ProductFormModal
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          product={editProduct}
          mode="edit"
        />
      )}
      {historyProduct && (
        <ProductHistoryModal
          open={!!historyProduct}
          onOpenChange={(open) => !open && setHistoryProduct(null)}
          product={historyProduct}
        />
      )}
      {deleteProduct && (
        <DeleteProductModal
          open={!!deleteProduct}
          onOpenChange={(open) => !open && setDeleteProduct(null)}
          product={deleteProduct}
        />
      )}
    </MainLayout>
  );
}
