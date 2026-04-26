import { useState, useMemo } from 'react';
import { Building2 as BuildingIcon, Plus, Loader2, DoorClosed } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useWarehouses } from '@/hooks/useWarehouses';
import { Warehouse } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import WarehouseFormModal from '@/components/warehouses/WarehouseFormModal';

export default function Warehouses() {
  const { t } = useLanguage();
  const { data: warehouses, isLoading } = useWarehouses();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | undefined>();

  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Facility',
      sortable: true,
      render: (item: Warehouse) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <DoorClosed className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.location || 'Main Building'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Warehouse) => (
        <p className="text-sm text-muted-foreground max-w-[400px] truncate">
          {item.description || 'General purpose'}
        </p>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: () => (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-full">
          <BuildingIcon className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Office / Lab</span>
        </div>
      ),
    },
  ], []);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          title={t('warehouses')}
          description="Manage rooms, labs, offices and storage facilities across the organization."
        >
          <Button
            onClick={() => {
              setEditingWarehouse(undefined);
              setCreateModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add facility
          </Button>
        </PageHeader>

        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 animate-fade-in max-w-sm">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <BuildingIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">{warehouses?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Active facilities</p>
          </div>
        </div>

        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading facilities…</p>
            </div>
          ) : (
            <DataTable
              data={warehouses || []}
              columns={columns}
              searchKeys={['name', 'location', 'description']}
              emptyMessage="No facilities defined. Add your first room or office."
              onRowClick={(item) => {
                setEditingWarehouse(item);
                setCreateModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <WarehouseFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        warehouse={editingWarehouse}
        mode={editingWarehouse ? 'edit' : 'create'}
      />
    </MainLayout>
  );
}
