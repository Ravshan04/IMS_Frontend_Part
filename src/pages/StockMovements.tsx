import { useState, useMemo } from 'react';
import { History, Search, Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw, FileEdit, Undo2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockMovements } from '@/hooks/useInventory';
import { useProducts } from '@/hooks/useProducts';
import { useWarehouses } from '@/hooks/useWarehouses';
import { StockMovement } from '@/types/database';
import { cn } from '@/lib/utils';

export default function StockMovements() {
  const [filters, setFilters] = useState({
    productId: 'all',
    warehouseId: 'all'
  });

  const { data: movements, isLoading } = useStockMovements({
    productId: filters.productId === 'all' ? undefined : filters.productId,
    warehouseId: filters.warehouseId === 'all' ? undefined : filters.warehouseId
  });

  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();

  const productMap = useMemo(() => new Map((products || []).map(p => [p.id, p])), [products]);
  const warehouseMap = useMemo(() => new Map((warehouses || []).map(w => [w.id, w])), [warehouses]);

  const getMovementConfig = (type: string) => {
    switch (type) {
      case 'IN':
        return { label: 'Inbound', icon: ArrowDownLeft, color: 'text-success', bg: 'bg-success/10' };
      case 'OUT':
        return { label: 'Outbound', icon: ArrowUpRight, color: 'text-destructive', bg: 'bg-destructive/10' };
      case 'TRANSFER':
        return { label: 'Transfer', icon: RefreshCcw, color: 'text-primary', bg: 'bg-primary/10' };
      case 'ADJUSTMENT':
        return { label: 'Adjustment', icon: FileEdit, color: 'text-warning', bg: 'bg-warning/10' };
      case 'RETURN':
        return { label: 'Return', icon: Undo2, color: 'text-secondary-foreground', bg: 'bg-secondary/20' };
      default:
        return { label: type, icon: History, color: 'text-muted-foreground', bg: 'bg-muted/10' };
    }
  };

  const columns = useMemo(() => [
    {
      key: 'created_at',
      header: 'Timestamp',
      sortable: true,
      render: (item: StockMovement) => (
        <span className="text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (item: StockMovement) => {
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
      render: (item: StockMovement) => (
        <span className="text-sm font-medium">{warehouseMap.get(item.warehouse_id)?.name || 'Default'}</span>
      ),
    },
    {
      key: 'type',
      header: 'Event',
      render: (item: StockMovement) => {
        const config = getMovementConfig(item.movement_type);
        const Icon = config.icon;
        return (
          <Badge variant="outline" className={cn("gap-1.5 border-2 font-black text-[10px] uppercase tracking-widest px-2", config.color, config.bg, "border-transparent")}>
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'quantity',
      header: 'Qty',
      render: (item: StockMovement) => {
        const isPositive = ['IN', 'RETURN', 'ADJUSTMENT'].includes(item.movement_type) && item.quantity > 0;
        return (
            <span className={cn("font-black tabular-nums", isPositive ? "text-success" : "text-destructive")}>
                {isPositive ? '+' : ''}{item.quantity}
            </span>
        );
      }
    },
    {
      key: 'notes',
      header: 'Comments',
      render: (item: StockMovement) => (
        <span className="text-xs text-muted-foreground italic truncate max-w-[150px] inline-block">
          {item.notes || '-'}
        </span>
      ),
    },
  ], [productMap, warehouseMap]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Stock Ledger"
          description="Consolidated history of all physical inventory movements."
        >
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
           </div>
        </PageHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 glass p-6 rounded-3xl border-border/30 shadow-xl">
           <div className="space-y-2">
               <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Filter by Product</span>
               <Select value={filters.productId} onValueChange={(v) => setFilters(f => ({ ...f, productId: v }))}>
                    <SelectTrigger className="bg-secondary/50 border-none rounded-2xl h-11 font-bold">
                        <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2">
                        <SelectItem value="all">All Catalog Items</SelectItem>
                        {products?.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
               </Select>
           </div>
           
           <div className="space-y-2">
               <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Filter by Facility</span>
               <Select value={filters.warehouseId} onValueChange={(v) => setFilters(f => ({ ...f, warehouseId: v }))}>
                    <SelectTrigger className="bg-secondary/50 border-none rounded-2xl h-11 font-bold">
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
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Retrieving historical ledger...</p>
            </div>
          ) : (
            <DataTable
              data={movements || []}
              columns={columns}
              searchKeys={[]}
              emptyMessage="No movement logs found for current selection."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
