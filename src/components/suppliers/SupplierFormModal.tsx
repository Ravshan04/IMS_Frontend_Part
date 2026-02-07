import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Star } from 'lucide-react';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/useSuppliers';
import { Supplier } from '@/types/database';
import { cn } from '@/lib/utils';

interface SupplierFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier;
  mode: 'create' | 'edit';
}

export default function SupplierFormModal({ open, onOpenChange, supplier, mode }: SupplierFormModalProps) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contact_person: supplier?.contact_person || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    rating: supplier?.rating || 0,
    lead_time: supplier?.lead_time || 0,
  });

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      contact_person: formData.contact_person || null,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      rating: formData.rating,
      lead_time: formData.lead_time,
    };

    if (mode === 'create') {
      await createSupplier.mutateAsync(data);
    } else if (supplier) {
      await updateSupplier.mutateAsync({
        id: supplier.id,
        updates: data,
      });
    }

    onOpenChange(false);
  };

  const isLoading = createSupplier.isPending || updateSupplier.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'create' ? 'Add New Supplier' : 'Edit Supplier'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Supplier Name *</Label>
            <Input
              placeholder="Supplier name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Person</Label>
            <Input
              placeholder="Contact person name"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                placeholder="+1 555-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              placeholder="Supplier address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        'w-5 h-5 transition-colors',
                        star <= formData.rating
                          ? 'fill-warning text-warning'
                          : 'text-muted-foreground'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lead Time (days)</Label>
              <Input
                type="number"
                min="0"
                value={formData.lead_time}
                onChange={(e) => setFormData({ ...formData, lead_time: parseInt(e.target.value) || 0 })}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Add Supplier' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
