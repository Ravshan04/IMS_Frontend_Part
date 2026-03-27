import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { useWarehouses } from '@/hooks/useWarehouses';
import { useCreateAsset } from '@/hooks/useAssets';
import { AssetCondition } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface RegisterAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegisterAssetModal({ open, onOpenChange }: RegisterAssetModalProps) {
  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();
  const createAsset = useCreateAsset();

  const [formData, setFormData] = useState({
    product_id: '',
    warehouse_id: '',
    serial_number: '',
    condition: 'Good' as AssetCondition,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.warehouse_id) return;

    try {
      await createAsset.mutateAsync({
        product_id: formData.product_id,
        warehouse_id: formData.warehouse_id,
        serial_number: formData.serial_number,
        condition: formData.condition,
        notes: formData.notes,
        status: 'InWarehouse',
        asset_code: '', // Backend generates this
      } as any);
      onOpenChange(false);
      setFormData({
        product_id: '',
        warehouse_id: '',
        serial_number: '',
        condition: 'Good',
        notes: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border border-2 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
            Register Individual Asset
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Add a new equipment unit with serial number to the internal inventory.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="product" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Equipment Type</Label>
            <Select
              value={formData.product_id}
              onValueChange={(val) => setFormData(p => ({ ...p, product_id: val }))}
              required
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select equipment type" />
              </SelectTrigger>
              <SelectContent>
                {products?.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warehouse" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Initial Location / Room</Label>
            <Select
              value={formData.warehouse_id}
              onValueChange={(val) => setFormData(p => ({ ...p, warehouse_id: val }))}
              required
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {warehouses?.map(w => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serial" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Serial Number / S/N</Label>
            <Input
              id="serial"
              value={formData.serial_number}
              onChange={(e) => setFormData(p => ({ ...p, serial_number: e.target.value }))}
              placeholder="e.g. SN12345678"
              className="bg-secondary/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Initial Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(val: any) => setFormData(p => ({ ...p, condition: val }))}
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Damaged">Damaged</SelectItem>
                <SelectItem value="Broken">Broken</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Notes / Description</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Internal asset description"
              className="bg-secondary/50 border-border"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={createAsset.isPending}
              className="w-full bg-primary hover:bg-primary/90 font-black h-12 rounded-full uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              {createAsset.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Unit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
