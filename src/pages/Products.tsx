import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download, Loader2, Package, Search } from 'lucide-react';
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
      header: 'Catalog ID',
      sortable: true,
      render: (item: Product) => (
        <span className="font-mono text-xs text-primary font-black tracking-tight">{item.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Equipment Type',
      sortable: true,
      render: (item: Product) => (
        <div className="max-w-[250px]">
          <p className="font-bold text-foreground truncate">{item.name}</p>
          <p className="text-[10px] text-muted-foreground truncate uppercase font-black tracking-tighter">
            {item.description || 'No specialized description'}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Classification',
      render: (item: Product) => (
        <Badge variant="outline" className="bg-secondary/30 border-border/50 font-black text-[10px] uppercase tracking-widest border-2">
          {getCategoryName(item.category_id)}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Value / Price',
      sortable: true,
      render: (item: Product) => (
        <span className="font-bold text-foreground tabular-nums">${item.price.toLocaleString()}</span>
      ),
    },
  ], [getCategoryName]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Equipment Catalog"
          description="Manage the list of allowed equipment types and furniture for the organization."
        >
          <div className="flex gap-2">
            <Button variant="outline" className="border-border hidden sm:flex font-bold rounded-full px-5" onClick={handleExport} disabled={!products?.length}>
                <Download className="w-4 h-4 mr-2" />
                Export Catalog
            </Button>
            {canManageCatalog && (
                <Button className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full px-6 font-black tracking-tight" onClick={() => {
                    setEditingProduct(undefined);
                    setCreateModalOpen(true);
                }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item Type
                </Button>
            )}
          </div>
        </PageHeader>

        <div className="flex flex-wrap items-center gap-3">
            <Select
                value={filters.categoryId}
                onValueChange={(value) => setFilters(f => ({ ...f, categoryId: value === 'all' ? '' : value }))}
            >
                <SelectTrigger className="w-[200px] bg-secondary/50 border-border font-bold">
                    <SelectValue placeholder="All Classifications" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border border-2">
                    <SelectItem value="all">All Classifications</SelectItem>
                    {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="animate-slide-up glass rounded-3xl border-border/30 overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-card/50">
               <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
               <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing catalog data...</p>
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
