import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, DoorClosed } from 'lucide-react';
import { useCreateWarehouse, useUpdateWarehouse } from '@/hooks/useWarehouses';
import { Warehouse } from '@/types/database';

interface WarehouseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse?: Warehouse;
  mode: 'create' | 'edit';
}

export default function WarehouseFormModal({ open, onOpenChange, warehouse, mode }: WarehouseFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    contact_person: '',
    phone: '',
  });

  const [errors, setErrors] = useState<{ phone?: string }>({});

  const validatePhone = (phone: string) => {
    if (!phone) return true; // optional
    const cleaned = phone.replace(/\s/g, '');
    // +998 dan keyin aynan 9 ta raqam bo'lishi shart
    const phoneRegex = /^\+998\d{9}$/; 
    return phoneRegex.test(cleaned);
  };

  useEffect(() => {
    if (warehouse && mode === 'edit') {
      setFormData({
        name: warehouse.name || '',
        location: warehouse.location || '',
        description: warehouse.description || '',
        contact_person: warehouse.contact_person || '',
        phone: warehouse.phone || '',
      });
    } else {
      setFormData({
        name: '',
        location: '',
        description: '',
        contact_person: '',
        phone: '',
      });
      setErrors({});
    }
  }, [warehouse, mode, open]);

  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.phone && !validatePhone(formData.phone)) {
        setErrors({ phone: "Invalid phone format. Example: +998 90 123 45 67" });
        return;
    }

    if (mode === 'create') {
      await createWarehouse.mutateAsync({
        name: formData.name,
        location: formData.location || null,
        description: formData.description || null,
        contact_person: formData.contact_person || null,
        phone: formData.phone || null,
        is_active: true,
        organization_id: '',
      });
    } else if (warehouse) {
      await updateWarehouse.mutateAsync({
        id: warehouse.id,
        name: formData.name,
        street: formData.location, 
        contactPerson: formData.contact_person,
        phone: formData.phone,
      });
    }

    onOpenChange(false);
  };

  const isLoading = createWarehouse.isPending || updateWarehouse.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border-border border-2 rounded-3xl p-0 overflow-hidden shadow-2xl">
        <div className="bg-primary/5 p-6 border-b border-border/50">
            <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DoorClosed className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                    {mode === 'create' ? 'Register Facility / Room' : 'Edit Facility Details'}
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-medium italic">Define rooms, offices, or buildings where internal assets can be located.</p>
            </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Facility Name / Room Number *</Label>
            <Input
              placeholder="e.g. IT Department, Server Room, Room 402"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-secondary/50 border-border font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Building / Location</Label>
            <Input
              placeholder="e.g. Main Building, 4th Floor"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-secondary/50 border-border font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Internal Usage Description</Label>
            <Textarea
              placeholder="e.g. Primary storage for networking equipment"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-secondary/50 border-border min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Responsible Person</Label>
                <Input
                  placeholder="e.g. John Doe"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="bg-secondary/50 border-border font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Contact Phone</Label>
                <div className="relative flex items-center">
                  <span className="absolute left-[14px] text-sm tabular-nums font-bold text-foreground select-none pointer-events-none">
                    +998
                  </span>
                  <Input
                    type="tel"
                    placeholder="90 123 45 67"
                    maxLength={12}
                    value={(() => {
                      // +998 dan keyingi raqamlarni olamiz va formatlashtiramiz: XX XXX XX XX
                      const raw = formData.phone.startsWith('+998') ? formData.phone.slice(4) : formData.phone;
                      const digits = raw.replace(/\D/g, '');
                      if (!digits) return '';
                      const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
                      return parts.filter(Boolean).join(' ');
                    })()}
                    onChange={(e) => {
                      // Faqat raqamlarni qoldiramiz, max 9 ta
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                      setFormData({ ...formData, phone: digits ? '+998' + digits : '' });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    className={`bg-secondary/50 font-bold tabular-nums pl-[3.5rem] ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-destructive font-semibold mt-1">{errors.phone}</p>}
              </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full px-6 font-bold">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-full px-12 font-black shadow-xl shadow-primary/20 h-12" disabled={isLoading}>
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {mode === 'create' ? 'Register Facility' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
