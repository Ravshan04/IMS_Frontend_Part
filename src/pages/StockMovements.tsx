import { useState, useMemo } from 'react';
import { History, Search, Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw, FileEdit, Undo2, Tag, MapPin, User, ShieldCheck, Box } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockMovements } from '@/hooks/useInventory';
import { useProducts } from '@/hooks/useProducts';
import { useWarehouses } from '@/hooks/useWarehouses';
import { useCategories } from '@/hooks/useCategories';
import { useUsers } from '@/hooks/useUsers';
import { StockMovement } from '@/types/database';
import { cn } from '@/lib/utils';

export default function StockMovements() {
  const [filters, setFilters] = useState({
    categoryId: 'all',
    warehouseId: 'all'
  });

  const { data: movements, isLoading } = useStockMovements({
    categoryId: filters.categoryId === 'all' ? undefined : filters.categoryId,
    warehouseId: filters.warehouseId === 'all' ? undefined : filters.warehouseId
  });

  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();
  const { data: categories } = useCategories();
  const { data: users } = useUsers();

  const productMap = useMemo(() => new Map((products || []).map(p => [p.id, p])), [products]);
  const warehouseMap = useMemo(() => new Map((warehouses || []).map(w => [w.id, w])), [warehouses]);
  const userMap = useMemo(() => new Map((users || []).map(u => [u.id, u])), [users]);

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
      case 'ASSIGNMENT':
        return { label: 'Assignment', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
      case 'REPAIR':
        return { label: 'Repair', icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' };
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
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-foreground whitespace-nowrap">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (item: StockMovement) => {
        const product = productMap.get(item.product_id);
        return (
          <div className="flex flex-col min-w-[160px]">
            <span className="font-bold text-xs text-foreground leading-tight line-clamp-1">{product?.name || 'Unknown'}</span>
            <span className="text-[10px] font-mono text-muted-foreground/80 mt-0.5 flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {product?.sku || 'NO-SKU'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Event',
      render: (item: StockMovement) => {
        const config = getMovementConfig(item.movement_type);
        const Icon = config.icon;
        return (
          <Badge
            variant="outline"
            className={cn(
              "gap-1.5 border-none font-bold text-[9px] uppercase tracking-wider py-1 px-2 shadow-sm",
              config.bg,
              config.color
            )}
          >
            <Icon className="w-2.5 h-2.5 stroke-[2.5px]" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'warehouse',
      header: 'Facility',
      render: (item: StockMovement) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-[11px] font-semibold truncate max-w-[100px]">{warehouseMap.get(item.warehouse_id)?.name || 'Central'}</span>
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Origin / Source',
      render: (item: StockMovement) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-foreground/80 capitalize truncate max-w-[120px]">
            {item.reference_type?.replace(/([A-Z])/g, ' $1').trim() || 'Internal'}
          </span>
          <span className="text-[9px] text-muted-foreground/60 font-mono tracking-tighter">REF: {item.reference_id?.substring(0, 8) || 'AUTO'}</span>
        </div>
      )
    },
    {
      key: 'actor',
      header: 'Performed By',
      render: (item: StockMovement) => {
        const user = userMap.get(item.performed_by);
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-[9px] font-black text-muted-foreground overflow-hidden">
              {user ? (
                <span className="uppercase">{user.first_name[0]}{user.last_name[0]}</span>
              ) : (
                <Box className="w-3 h-3 opacity-40" />
              )}
            </div>
            <span className="text-[10px] font-bold truncate max-w-[100px]">{user ? `${user.first_name} ${user.last_name}` : 'System'}</span>
          </div>
        );
      }
    },
    {
      key: 'quantity',
      header: 'Qty',
      render: (item: StockMovement) => {
        const isNegative = ['OUT', 'TRANSFER'].includes(item.movement_type) || (item.movement_type === 'ADJUSTMENT' && item.quantity < 0);
        const displayQty = Math.abs(item.quantity);

        return (
          <div className="flex items-center justify-end pr-2">
            <span className={cn(
              "font-black tabular-nums text-xs px-2 py-0.5 rounded-md",
              isNegative ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
            )}>
              {isNegative ? '-' : '+'}{displayQty}
            </span>
          </div>
        );
      }
    },
    {
      key: 'notes',
      header: 'Audit Notes',
      render: (item: StockMovement) => (
        <span className="text-[10px] text-muted-foreground/70 italic line-clamp-1 max-w-[150px]" title={item.notes}>
          {item.notes || '—'}
        </span>
      ),
    },
  ], [productMap, warehouseMap, userMap]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <PageHeader
            title="Stock Ledger"
            description="Full custody trail and historical record of physical inventory events."
            className="pb-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner group">
              <History className="w-6 h-6 text-primary group-hover:rotate-[-45deg] transition-transform duration-500" />
            </div>
          </PageHeader>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Qidirish..."
                className="h-10 pl-9 pr-4 rounded-xl bg-secondary/30 border border-border/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm w-48 lg:w-80"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-border/40 bg-secondary/30 hover:bg-secondary/50">
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-5 glass rounded-[2rem] border-border/20 shadow-2xl bg-gradient-to-br from-background/80 to-secondary/10">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] px-1">Classification</span>
            <Select value={filters.categoryId} onValueChange={(v) => setFilters(f => ({ ...f, categoryId: v }))}>
              <SelectTrigger className="bg-background/40 hover:bg-background/60 border-border/30 rounded-xl h-10 font-bold text-xs min-w-[180px] transition-all">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 backdrop-blur-xl">
                <SelectItem value="all">Global: All Categories</SelectItem>
                {categories?.map(c => (
                  <SelectItem key={c.id} value={c.id} className="rounded-lg">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] px-1">Storage Node</span>
            <Select value={filters.warehouseId} onValueChange={(v) => setFilters(f => ({ ...f, warehouseId: v }))}>
              <SelectTrigger className="bg-background/40 hover:bg-background/60 border-border/30 rounded-xl h-10 font-bold text-xs min-w-[180px] transition-all">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 backdrop-blur-xl">
                <SelectItem value="all">Global: All Facilities</SelectItem>
                {warehouses?.map(w => (
                  <SelectItem key={w.id} value={w.id} className="rounded-lg">{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto self-end pb-1">
            <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Historical Records</span>
                <span className="text-lg font-black text-primary leading-none">{(movements?.length || 0).toLocaleString()}</span>
              </div>
              <div className="w-px h-8 bg-border/40" />
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Active Sources</span>
                <span className="text-lg font-black text-foreground leading-none">{new Set(movements?.map(m => m.reference_type)).size}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-slide-up glass rounded-[2.5rem] border-border/20 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-8">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse rounded-full" />
                <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Synchronizing Ledger</p>
                <div className="w-48 h-1 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-progress" />
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                data={movements || []}
                columns={columns}
                searchKeys={['notes', 'reference_type', 'reference_id']}
                emptyMessage="Historical logs appear clean for this selection."
                className="border-none shadow-none"
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
