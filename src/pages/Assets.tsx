import { useState, useMemo } from 'react';
import { Box, Plus, Download, Loader2, Tag, ShieldCheck } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssets } from '@/hooks/useAssets';
import { useProducts } from '@/hooks/useProducts';
import { useWarehouses } from '@/hooks/useWarehouses';
import { AssetItem } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import RegisterAssetModal from '@/components/assets/RegisterAssetModal';
import AssetDetailsModal from '@/components/assets/AssetDetailsModal';
import { User, MapPin, History as HistoryIcon, ShieldCheck as ShieldCheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Assets() {
  const { t } = useLanguage();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    productId: '',
    warehouseId: '',
    status: '',
  });

  const { data: assets, isLoading } = useAssets(filters);
  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();

  const productMap = useMemo(() => new Map((products || []).map(p => [p.id, p])), [products]);
  const warehouseMap = useMemo(() => new Map((warehouses || []).map(w => [w.id, w])), [warehouses]);

  const columns = useMemo(() => [
    {
      key: 'asset_code',
      header: 'Asset Code',
      sortable: true,
      render: (item: AssetItem) => (
        <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary opacity-70" />
            <span className="font-mono text-sm font-medium text-primary">{item.asset_code}</span>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (item: AssetItem) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-foreground truncate">{productMap.get(item.product_id)?.name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.serial_number || 'No Serial'}</p>
        </div>
      ),
    },
    {
      key: 'warehouse',
      header: 'Location / Room',
      render: (item: AssetItem) => (
        <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-foreground text-sm font-semibold">{warehouseMap.get(item.warehouse_id)?.name || 'Central Store'}</span>
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
            New: 'bg-primary/20 text-primary border-primary/30',
            Good: 'bg-success/20 text-success border-success/30',
            Damaged: 'bg-warning/20 text-warning border-warning/30',
            Broken: 'bg-destructive/20 text-destructive border-destructive/30',
        };
        return (
            <Badge variant="outline" className={cn("capitalize font-black text-[10px] border-2", condColors[item.condition])}>
                {item.condition}
            </Badge>
        );
      },
    },
    {
        key: 'assigned',
        header: 'Responsible Person',
        render: (item: AssetItem) => (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center border-border border">
                     <User className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">{item.assigned_to_user_id ? "Assigned" : "Available"}</span>
            </div>
        )
    }
  ], [productMap, warehouseMap]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title={t('assets')}
          description="Track individual units, serial numbers, and equipment assets."
        >
          <Button variant="outline" className="border-border hidden sm:flex font-bold rounded-full px-5">
            <Download className="w-4 h-4 mr-2" />
            Export Audit
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full px-6 font-black tracking-tight"
            onClick={() => setRegisterModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Register New Unit
          </Button>
        </PageHeader>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in">
          <Select
            value={filters.productId}
            onValueChange={(value) => setFilters(f => ({ ...f, productId: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border font-medium">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.warehouseId}
            onValueChange={(value) => setFilters(f => ({ ...f, warehouseId: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border font-medium">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses?.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters(f => ({ ...f, status: value === 'all' ? '' : value }))}
          >
            <SelectTrigger className="w-[150px] bg-secondary/50 border-border font-medium">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="InWarehouse">In Warehouse</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="InRepair">In Repair</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground animate-pulse">Loading assets...</p>
            </div>
          ) : (
            <DataTable
              data={assets || []}
              columns={columns}
              searchKeys={['asset_code', 'serial_number']}
              emptyMessage="No individual assets found."
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
