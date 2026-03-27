import { useState, useMemo } from 'react';
import { Package, Search, Download, Loader2, Warehouse as WarehouseIcon, AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
            <span className="font-bold text-foreground">{product?.name || 'Unknown'}</span>
            <span className="text-xs font-mono text-muted-foreground">{product?.sku || '-'}</span>
          </div>
        );
      },
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (item: InventoryStatus) => (
        <div className="flex items-center gap-2">
           <WarehouseIcon className="w-4 h-4 text-muted-foreground" />
           <span className="text-sm font-medium">{warehouseMap.get(item.warehouse_id)?.name || 'Default'}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'On Hand',
      sortable: true,
      render: (item: InventoryStatus) => (
        <span className="font-black text-foreground tabular-nums">{item.quantity}</span>
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
            <span className={cn("font-black tabular-nums", isLow ? "text-destructive" : "text-success")}>
              {item.available_quantity}
            </span>
            {isLow && <AlertTriangle className="w-3 h-3 text-destructive animate-pulse" />}
          </div>
        );
      },
    },
    {
      key: 'last_update',
      header: 'Last Sync',
      render: (item: InventoryStatus) => (
        <span className="text-[10px] font-bold uppercase text-muted-foreground">
          {new Date(item.last_stock_update).toLocaleString()}
        </span>
      ),
    },
  ], [productMap, warehouseMap]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Inventory Levels"
          description="Real-time stock quantities across all global fulfilment centers."
        >
          <Button variant="outline" className="rounded-full px-6 gap-2 border-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </PageHeader>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass p-4 rounded-3xl border-border/30 shadow-xl">
           <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by SKU or Name..." 
                    className="pl-10 bg-secondary/50 border-none rounded-2xl h-11"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
           </div>
           
           <div className="flex items-center gap-4 w-full sm:w-auto">
               <span className="text-xs font-black uppercase text-muted-foreground tracking-widest whitespace-nowrap">Facility:</span>
               <Select value={warehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger className="w-full sm:w-[220px] bg-primary/5 border-primary/20 rounded-2xl h-11 font-bold">
                        <SelectValue placeholder="All Warehouses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2">
                        <SelectItem value="all">Global (All Warehouses)</SelectItem>
                        {warehouses?.map(w => (
                            <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                    </SelectContent>
               </Select>
           </div>
        </div>

        <div className="animate-slide-up glass rounded-3xl border-border/30 overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Scanning facility grids...</p>
            </div>
          ) : (
            <DataTable
              data={filteredData}
              columns={columns}
              searchKeys={[]} // Using custom search
              emptyMessage="No stock records found for current filters."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
