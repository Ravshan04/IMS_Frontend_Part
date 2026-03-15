import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import ProductFormModal from '@/components/products/ProductFormModal';
import { Product } from '@/types/database';

export default function Products() {
  const [searchParams] = useSearchParams();
  const { canManageCatalog } = useAuth();

  const [filters, setFilters] = useState({
    categoryId: searchParams.get('category') || '',
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  

  const { data: products, isLoading } = useProducts(filters.categoryId ? {
    categoryId: filters.categoryId || undefined,
  } : undefined);
  const { data: categories } = useCategories();

  const getCategoryName = useCallback((categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    return categories?.find(c => c.id === categoryId)?.name || 'Uncategorized';
  }, [categories]);

  const handleExport = useCallback(() => {
    if (!products) return;

    const headers = ['SKU', 'Name', 'Description', 'Category', 'Unit', 'Price', 'Cost'];
    const rows = products.map(p => [
      p.sku,
      p.name,
      p.description || '',
      getCategoryName(p.category_id),
      p.unit || 'Piece',
      p.price.toString(),
      p.cost.toString(),
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [products, getCategoryName]);

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
          {getCategoryName(item.category_id)}
        </Badge>
      ),
    },
    {
      key: 'unit',
      header: 'Unit',
      sortable: true,
      render: (item: Product) => (
        <span className="text-muted-foreground text-sm">{item.unit || 'Piece'}</span>
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
      key: 'actions',
      header: 'Actions',
      render: (item: Product) => (
        <div className="text-xs text-muted-foreground">-</div>
      ),
    },
  ], [getCategoryName]);

  const clearFilters = useCallback(() => {
    setFilters({ categoryId: '' });
  }, []);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Products"
          description="Manage your product catalog and pricing."
        >
          <Button variant="outline" className="border-border hidden sm:flex" onClick={handleExport} disabled={!products?.length}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {canManageCatalog && (
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

          {(filters.categoryId) && (
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
    </MainLayout>
  );
}
