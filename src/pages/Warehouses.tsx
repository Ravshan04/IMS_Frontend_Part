import { useState, useMemo } from 'react';
import { Building2 as BuildingIcon, Plus, MapPin, Globe, Loader2, DoorClosed } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useWarehouses } from '@/hooks/useWarehouses';
import { Warehouse } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Warehouses() {
  const { t } = useLanguage();
  const { data: warehouses, isLoading } = useWarehouses();

  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Room / Facility Name',
      sortable: true,
      render: (item: Warehouse) => (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <DoorClosed className="w-5 h-5 text-primary" />
            </div>
            <div>
                <span className="font-black text-foreground uppercase tracking-tight block">{item.name}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.location || 'Main Building'}</span>
            </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Internal Usage',
      render: (item: Warehouse) => (
        <p className="text-sm font-medium text-muted-foreground max-w-[400px] truncate">{item.description || 'General Purpose Room'}</p>
      ),
    },
    {
        key: 'type',
        header: 'Facility Type',
        render: (item: Warehouse) => (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/50 rounded-full border border-border w-fit">
                <BuildingIcon className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Office / Lab</span>
            </div>
        )
    }
  ], []);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader
          title={t('warehouses')}
          description="Manage rooms, labs, offices and storage facilities across your organization buildings."
        >
          <Button className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full px-6 font-black tracking-tight">
            <Plus className="w-4 h-4 mr-2" />
            Regiser Facility
          </Button>
        </PageHeader>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
           <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BuildingIcon className="w-16 h-16" />
               </div>
               <h3 className="font-black text-3xl mb-1">{warehouses?.length || 0}</h3>
               <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Total Active Facilities</p>
           </div>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up glass border-border/30 rounded-3xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-card/50">
               <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
               <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing facility data...</p>
            </div>
          ) : (
            <DataTable
              data={warehouses || []}
              columns={columns}
              searchKeys={['name', 'location', 'description']}
              emptyMessage="No facilities defined. Add your first room or office."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
