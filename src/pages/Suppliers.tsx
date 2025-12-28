import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, MapPin, Star, Clock, Package } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockSuppliers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Suppliers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 4.0) return 'text-primary';
    if (rating >= 3.5) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Suppliers</h1>
            <p className="text-muted-foreground">Manage your supplier relationships</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Supplier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Supplier name" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input placeholder="Contact name" className="bg-secondary border-border" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="+1 555-0000" className="bg-secondary border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea placeholder="Full address" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Lead Time (days)</Label>
                  <Input type="number" placeholder="7" className="bg-secondary border-border" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    Add Supplier
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className={cn(
                'glass rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-glow animate-slide-up',
                `[animation-delay:${index * 50}ms]`
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {supplier.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{supplier.name}</h3>
                    <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="hover:text-primary h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:text-destructive h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{supplier.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className={cn('flex items-center justify-center gap-1', getRatingColor(supplier.rating))}>
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-lg font-semibold">{supplier.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-foreground">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">{supplier.leadTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Lead Days</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-foreground">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">{supplier.productCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
