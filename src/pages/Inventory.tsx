import { useState, useMemo } from 'react';
import { Search, Download, Loader2, Warehouse as WarehouseIcon, AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import { useProducts } from '@/hooks/useProducts';
import { useWarehouses } from '@/hooks/useWarehouses';
import { InventoryStatus } from '@/types/database';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Inventory() {
  const [warehouseId, setWarehouseId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: inventory, isLoading } = useInventory(warehouseId === 'all' ? undefined : warehouseId);
  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();

  const productMap = useMemo(() => new Map((products || []).map(p => [p.id, p])), [products]);
  const warehouseMap = useMemo(() => new Map((warehouses || []).map(w => [w.id, w])), [warehouses]);

  const filteredData = useMemo(() => {
    if (!inventory) return [];
    return inventory.filter(item => {
      const product = productMap.get(item.product_id);
      if (!product) return false;
      const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return searchMatch;
    });
  }, [inventory, productMap, searchQuery]);

  const columns = useMemo(() => [
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      render: (item: InventoryStatus) => {
        const product = productMap.get(item.product_id);
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{product?.name || 'Unknown'}</span>
            <span className="text-xs font-mono text-muted-foreground">{product?.sku || '—'}</span>
          </div>
        );
      },
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (item: InventoryStatus) => (
        <div className="flex items-center gap-2 text-sm">
          <WarehouseIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <span>{warehouseMap.get(item.warehouse_id)?.name || '—'}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'On hand',
      sortable: true,
      render: (item: InventoryStatus) => (
        <span className="text-sm font-semibold text-foreground tabular-nums">{item.quantity}</span>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      sortable: true,
      render: (item: InventoryStatus) => {
        const product = productMap.get(item.product_id);
        const isLow = product?.reorder_point ? item.available_quantity <= product.reorder_point : item.available_quantity < 10;
        return (
          <div className="flex items-center gap-2">
            <span className={cn('text-sm font-semibold tabular-nums', isLow ? 'text-destructive' : 'text-success')}>
              {item.available_quantity}
            </span>
            {isLow && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
          </div>
        );
      },
    },
    {
      key: 'last_update',
      header: 'Last update',
      render: (item: InventoryStatus) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.last_stock_update).toLocaleString()}
        </span>
      ),
    },
  ], [productMap, warehouseMap]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Inventory levels"
          description="Real-time stock quantities across all warehouses."
        >
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </PageHeader>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-card border border-border rounded-xl p-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU…"
              className="pl-9 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Warehouse:</span>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="All warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                {warehouses?.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading inventory…</p>
            </div>
          ) : (
            <DataTable
              data={filteredData}
              columns={columns}
              searchable={false}
              emptyMessage="No stock records match the current filters."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
