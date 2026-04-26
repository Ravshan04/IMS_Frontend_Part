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
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

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

    const headers = ['SKU', 'Name', 'Description', 'Category', 'Unit', 'Estimated Value'];
    const rows = products.map(p => [
      p.sku,
      p.name,
      p.description || '',
      getCategoryName(p.category_id),
      p.unit || 'Piece',
      p.price.toString(),
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [products, getCategoryName]);

  const columns = useMemo(() => [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      render: (item: Product) => (
        <span className="font-mono text-sm font-medium text-foreground">{item.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (item: Product) => (
        <div className="max-w-[280px]">
          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
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
        <Badge variant="secondary" className="font-medium">
          {getCategoryName(item.category_id)}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Unit value',
      sortable: true,
      render: (item: Product) => (
        <span className="text-sm font-semibold text-foreground tabular-nums">
          ${item.price.toLocaleString()}
        </span>
      ),
    },
  ], [getCategoryName]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Equipment catalog"
          description="Manage the equipment types and furniture available across the organization."
        >
          <Button variant="outline" className="hidden sm:flex" onClick={handleExport} disabled={!products?.length}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {canManageCatalog && (
            <Button onClick={() => {
              setEditingProduct(undefined);
              setCreateModalOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add item
            </Button>
          )}
        </PageHeader>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filters.categoryId || 'all'}
            onValueChange={(value) => setFilters((f) => ({ ...f, categoryId: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading catalog…</p>
            </div>
          ) : (
            <DataTable
              data={products || []}
              columns={columns}
              searchKeys={['name', 'sku', 'description']}
              onRowClick={(item) => {
                setEditingProduct(item);
                setCreateModalOpen(true);
              }}
              emptyMessage="No equipment types found."
            />
          )}
        </div>
      </div>

      <ProductFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        product={editingProduct}
        mode={editingProduct ? 'edit' : 'create'}
      />
    </MainLayout>
  );
}
