import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Upload, Download, Edit, Trash2, Eye, History, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
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
  const navigate = useNavigate();
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
        searchParams.delete('edit');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, products]);

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity <= 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= reorderLevel) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

  const handleExport = () => {
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
  };

  const columns = [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      render: (item: Product) => (
        <span className="font-mono text-sm text-primary">{item.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (item: Product) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {item.description}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item: Product) => (
        <Badge variant="outline" className="bg-secondary/50">
          {item.category?.name || 'Uncategorized'}
        </Badge>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (item: Product) => (
        <span className="text-muted-foreground">{item.supplier?.name || 'No supplier'}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
      render: (item: Product) => (
        <span className={cn(
          'font-medium',
          item.quantity <= item.reorder_level ? 'text-warning' : 'text-foreground'
        )}>
          {item.quantity}
        </span>
      ),
    },
    {
      key: 'reorder_level',
      header: 'Reorder Level',
      sortable: true,
      render: (item: Product) => (
        <span className="text-muted-foreground">{item.reorder_level}</span>
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
      key: 'cost',
      header: 'Cost',
      sortable: true,
      render: (item: Product) => (
        <span className="text-muted-foreground">${item.cost.toLocaleString()}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (item: Product) => (
        <span className="text-muted-foreground">{item.location || 'N/A'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Product) => {
        const status = getStockStatus(item.quantity, item.reorder_level);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Product) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => setHistoryProduct(item)}
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary h-8 w-8"
            onClick={() => setEditProduct(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-destructive h-8 w-8"
              onClick={() => setDeleteProduct(item)}
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border" onClick={handleExport} disabled={!products?.length}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {isAdminOrManager && (
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <Select
            value={filters.categoryId}
            onValueChange={(value) => setFilters({ ...filters, categoryId: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.supplierId}
            onValueChange={(value) => setFilters({ ...filters, supplierId: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <SelectValue placeholder="All Suppliers" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers?.map((sup) => (
                <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={filters.lowStockOnly ? 'default' : 'outline'}
            className={cn(
              'border-border',
              filters.lowStockOnly && 'bg-warning text-warning-foreground hover:bg-warning/90'
            )}
            onClick={() => setFilters({ ...filters, lowStockOnly: !filters.lowStockOnly })}
          >
            Low Stock Only
          </Button>

          {(filters.categoryId || filters.supplierId || filters.lowStockOnly) && (
            <Button
              variant="ghost"
              onClick={() => setFilters({ categoryId: '', supplierId: '', lowStockOnly: false })}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Data Table */}
        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              data={products || []}
              columns={columns}
              searchKeys={['name', 'sku', 'description']}
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
