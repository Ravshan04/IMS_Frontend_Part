import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers';
import { Customer, CustomerStatus } from '@/types/database';

interface CustomerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  mode: 'create' | 'edit';
}

export default function CustomerFormModal({ open, onOpenChange, customer, mode }: CustomerFormModalProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    status: customer?.status || 'active' as CustomerStatus,
  });

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      status: formData.status,
    };

    if (mode === 'create') {
      await createCustomer.mutateAsync(data);
    } else if (customer) {
      await updateCustomer.mutateAsync({
        id: customer.id,
        updates: data,
      });
    }

    onOpenChange(false);
  };

  const isLoading = createCustomer.isPending || updateCustomer.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'create' ? 'Add New Customer' : 'Edit Customer'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input
              placeholder="Company name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@company.com"
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
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              placeholder="Company address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: CustomerStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Add Customer' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
