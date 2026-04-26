import { useState, useMemo } from 'react';
import { Plus, Download, Loader2, Tag, User, MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssets } from '@/hooks/useAssets';
import { useProducts } from '@/hooks/useProducts';
import { useWarehouses } from '@/hooks/useWarehouses';
import { useCategories } from '@/hooks/useCategories';
import { AssetItem } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import RegisterAssetModal from '@/components/assets/RegisterAssetModal';
import AssetDetailsModal from '@/components/assets/AssetDetailsModal';
import { cn } from '@/lib/utils';

export default function Assets() {
  const { t } = useLanguage();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    warehouseId: '',
    categoryId: '',
    status: '',
  });

  const { data: products } = useProducts();
  const { data: assets, isLoading } = useAssets(filters);
  const { data: warehouses } = useWarehouses();
  const { data: categories } = useCategories();

  const productMap = useMemo(() => new Map((products || []).map(p => [p.id, p])), [products]);
  const warehouseMap = useMemo(() => new Map((warehouses || []).map(w => [w.id, w])), [warehouses]);

  const columns = useMemo(() => [
    {
      key: 'asset_code',
      header: 'Asset code',
      sortable: true,
      render: (item: AssetItem) => (
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-sm font-medium text-foreground">{item.asset_code}</span>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (item: AssetItem) => (
        <div className="max-w-[220px]">
          <p className="text-sm font-medium text-foreground truncate">{productMap.get(item.product_id)?.name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.serial_number || 'No serial'}</p>
        </div>
      ),
    },
    {
      key: 'warehouse',
      header: 'Location',
      render: (item: AssetItem) => (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[160px]">{warehouseMap.get(item.warehouse_id)?.name || '—'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: AssetItem) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
          InWarehouse: 'success',
          Assigned: 'default',
          InRepair: 'warning',
          Lost: 'destructive',
          Retired: 'secondary',
        };
        return <Badge variant={variants[item.status] || 'outline'}>{item.status}</Badge>;
      },
    },
    {
      key: 'condition',
      header: 'Condition',
      render: (item: AssetItem) => {
        const condColors: Record<string, string> = {
          New: 'bg-primary/10 text-primary',
          Good: 'bg-success/10 text-success',
          Damaged: 'bg-warning/10 text-warning',
          Broken: 'bg-destructive/10 text-destructive',
        };
        return (
          <Badge variant="outline" className={cn('border-transparent font-medium', condColors[item.condition])}>
            {item.condition}
          </Badge>
        );
      },
    },
    {
      key: 'assigned',
      header: 'Assignment',
      render: (item: AssetItem) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">
            {item.assigned_to_user_id ? 'Assigned' : 'Available'}
          </span>
        </div>
      ),
    },
  ], [productMap, warehouseMap]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          title={t('assets')}
          description="Track individual units, serial numbers, and equipment assets."
        >
          <Button variant="outline" className="hidden sm:flex">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setRegisterModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Register asset
          </Button>
        </PageHeader>

        <div className="flex flex-wrap items-center gap-3 animate-fade-in">
          <Select
            value={filters.categoryId || 'all'}
            onValueChange={(value) => setFilters((f) => ({ ...f, categoryId: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.warehouseId || 'all'}
            onValueChange={(value) => setFilters((f) => ({ ...f, warehouseId: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All warehouses</SelectItem>
              {warehouses?.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => setFilters((f) => ({ ...f, status: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="InWarehouse">In warehouse</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="InRepair">In repair</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading assets…</p>
            </div>
          ) : (
            <DataTable
              data={assets || []}
              columns={columns}
              searchKeys={['asset_code', 'serial_number']}
              emptyMessage="No assets found."
              onRowClick={(item) => {
                setSelectedAsset(item);
                setDetailsModalOpen(true);
              }}
            />
          )}
        </div>

        <RegisterAssetModal
            open={registerModalOpen}
            onOpenChange={setRegisterModalOpen}
        />

        <AssetDetailsModal
            asset={selectedAsset}
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
            productName={selectedAsset ? productMap.get(selectedAsset.product_id)?.name : ''}
            locationName={selectedAsset ? warehouseMap.get(selectedAsset.warehouse_id)?.name : ''}
        />
      </div>
    </MainLayout>
  );
}
