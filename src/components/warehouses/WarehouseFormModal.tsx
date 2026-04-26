import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, DoorClosed } from 'lucide-react';
import { useCreateWarehouse, useUpdateWarehouse } from '@/hooks/useWarehouses';
import { Warehouse } from '@/types/database';
import { cn } from '@/lib/utils';

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
      <DialogContent className="max-w-xl bg-card border-border rounded-xl p-0 overflow-hidden shadow-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <DoorClosed className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-lg font-semibold text-foreground">
                {mode === 'create' ? 'New facility' : 'Edit facility'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Define a room, office, or building where assets can be located.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Facility name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. IT Department, Server Room, Room 402"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Building / location</Label>
            <Input
              placeholder="e.g. Main Building, 4th Floor"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Description</Label>
            <Textarea
              placeholder="e.g. Primary storage for networking equipment"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Responsible person</Label>
              <Input
                placeholder="e.g. John Doe"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Contact phone</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm tabular-nums text-muted-foreground select-none pointer-events-none">
                  +998
                </span>
                <Input
                  type="tel"
                  placeholder="90 123 45 67"
                  maxLength={12}
                  value={(() => {
                    const raw = formData.phone.startsWith('+998') ? formData.phone.slice(4) : formData.phone;
                    const digits = raw.replace(/\D/g, '');
                    if (!digits) return '';
                    const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
                    return parts.filter(Boolean).join(' ');
                  })()}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setFormData({ ...formData, phone: digits ? '+998' + digits : '' });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className={cn('pl-14 tabular-nums', errors.phone && 'border-destructive focus-visible:ring-destructive')}
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-32">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Create' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
