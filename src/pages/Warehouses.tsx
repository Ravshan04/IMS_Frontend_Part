import { useState, useMemo } from 'react';
import { Warehouse as WarehouseIcon, Plus, MapPin, Globe, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWarehouses } from '@/hooks/useWarehouses';
import { Warehouse } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Warehouses() {
  const { t } = useLanguage();
  const { data: warehouses, isLoading } = useWarehouses();

  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Warehouse Name',
      sortable: true,
      render: (item: Warehouse) => (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <WarehouseIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (item: Warehouse) => (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-3.5 h-3.5" />
          {item.location || 'Not Specified'}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Warehouse) => (
        <p className="text-sm text-muted-foreground max-w-[300px] truncate">{item.description || '-'}</p>
      ),
    },
  ], []);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title={t('warehouses')}
          description="Manage physical storage locations and distribution centers."
        >
          <Button className="bg-primary hover:bg-primary/90 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Warehouse
          </Button>
        </PageHeader>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2 animate-fade-in">
           <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
               <Globe className="w-8 h-8 text-primary/50 mb-3" />
               <h3 className="font-bold text-lg">{warehouses?.length || 0}</h3>
               <p className="text-sm text-muted-foreground">Total Active Locations</p>
           </div>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground animate-pulse">Loading warehouses...</p>
            </div>
          ) : (
            <DataTable
              data={warehouses || []}
              columns={columns}
              searchKeys={['name', 'location', 'description']}
              emptyMessage="No warehouses found. Establish your first location."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
