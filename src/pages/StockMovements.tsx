import { useState, useMemo } from 'react';
import { History, Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw, FileEdit, Undo2, MapPin, User, ShieldCheck } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
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
    warehouseId: 'all',
  });

  const { data: movements, isLoading } = useStockMovements({
    categoryId: filters.categoryId === 'all' ? undefined : filters.categoryId,
    warehouseId: filters.warehouseId === 'all' ? undefined : filters.warehouseId,
  });

  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();
  const { data: categories } = useCategories();
  const { data: users } = useUsers();

  const productMap = useMemo(() => new Map((products || []).map((p) => [p.id, p])), [products]);
  const warehouseMap = useMemo(() => new Map((warehouses || []).map((w) => [w.id, w])), [warehouses]);
  const userMap = useMemo(() => new Map((users || []).map((u) => [u.id, u])), [users]);

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
        return { label: 'Return', icon: Undo2, color: 'text-muted-foreground', bg: 'bg-muted' };
      case 'ASSIGNMENT':
        return { label: 'Assignment', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
      case 'REPAIR':
        return { label: 'Repair', icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' };
      default:
        return { label: type, icon: History, color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'created_at',
        header: 'Date',
        sortable: true,
        render: (item: StockMovement) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
            <span className="text-xs text-muted-foreground">
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
              <span className="text-sm font-medium text-foreground line-clamp-1">
                {product?.name || 'Unknown'}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {product?.sku || '—'}
              </span>
            </div>
          );
        },
      },
      {
        key: 'type',
        header: 'Type',
        render: (item: StockMovement) => {
          const config = getMovementConfig(item.movement_type);
          const Icon = config.icon;
          return (
            <Badge variant="outline" className={cn('gap-1.5 border-transparent font-medium', config.bg, config.color)}>
              <Icon className="w-3 h-3" />
              {config.label}
            </Badge>
          );
        },
      },
      {
        key: 'warehouse',
        header: 'Facility',
        render: (item: StockMovement) => (
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[140px]">{warehouseMap.get(item.warehouse_id)?.name || '—'}</span>
          </div>
        ),
      },
      {
        key: 'source',
        header: 'Source',
        render: (item: StockMovement) => (
          <div className="flex flex-col">
            <span className="text-sm capitalize truncate max-w-[140px]">
              {item.reference_type?.replace(/([A-Z])/g, ' $1').trim() || 'Internal'}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {item.reference_id?.substring(0, 8) || 'auto'}
            </span>
          </div>
        ),
      },
      {
        key: 'actor',
        header: 'Performed by',
        render: (item: StockMovement) => {
          const user = userMap.get(item.performed_by);
          const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : '–';
          return (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                {initials}
              </div>
              <span className="text-sm truncate max-w-[120px]">
                {user ? `${user.first_name} ${user.last_name}` : 'System'}
              </span>
            </div>
          );
        },
      },
      {
        key: 'quantity',
        header: 'Qty',
        render: (item: StockMovement) => {
          const isNegative =
            ['OUT', 'TRANSFER'].includes(item.movement_type) ||
            (item.movement_type === 'ADJUSTMENT' && item.quantity < 0);
          const displayQty = Math.abs(item.quantity);

          return (
            <span
              className={cn(
                'inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded-md text-sm font-semibold tabular-nums',
                isNegative ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
              )}
            >
              {isNegative ? '−' : '+'}
              {displayQty}
            </span>
          );
        },
      },
      {
        key: 'notes',
        header: 'Notes',
        render: (item: StockMovement) => (
          <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]" title={item.notes}>
            {item.notes || '—'}
          </span>
        ),
      },
    ],
    [productMap, warehouseMap, userMap]
  );

  const totalRecords = movements?.length || 0;
  const activeSources = new Set(movements?.map((m) => m.reference_type)).size;

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Stock movements"
          description="Audit trail of inventory events across all facilities."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total records</p>
            <p className="text-2xl font-semibold text-foreground tabular-nums">{totalRecords.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active sources</p>
            <p className="text-2xl font-semibold text-foreground tabular-nums">{activeSources}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Audit log</p>
              <p className="text-sm text-foreground">Live event stream</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <Select value={filters.categoryId} onValueChange={(v) => setFilters((f) => ({ ...f, categoryId: v }))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Warehouse</label>
            <Select value={filters.warehouseId} onValueChange={(v) => setFilters((f) => ({ ...f, warehouseId: v }))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                {warehouses?.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading movements…</p>
            </div>
          ) : (
            <DataTable
              data={movements || []}
              columns={columns}
              searchKeys={['notes', 'reference_type', 'reference_id']}
              emptyMessage="No movements match the current filters."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
