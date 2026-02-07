import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Product } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  mode: 'create' | 'edit';
}

export default function ProductFormModal({ open, onOpenChange, product, mode }: ProductFormModalProps) {
  const { role } = useAuth();
  const isStaff = role === 'staff';
  
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    supplier_id: product?.supplier_id || '',
    quantity: product?.quantity || 0,
    reorder_level: product?.reorder_level || 10,
    price: product?.price || 0,
    cost: product?.cost || 0,
    location: product?.location || '',
  });

  const { data: categories } = useCategories();
  const { data: suppliers } = useSuppliers();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const generateSku = () => {
    const prefix = 'PROD';
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      await createProduct.mutateAsync({
        sku: formData.sku || generateSku(),
        name: formData.name,
        description: formData.description || null,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null,
        quantity: formData.quantity,
        reorder_level: formData.reorder_level,
        price: formData.price,
        cost: formData.cost,
        location: formData.location || null,
      });
    } else if (product) {
      const updates = isStaff 
        ? { quantity: formData.quantity, location: formData.location }
        : {
            name: formData.name,
            description: formData.description || null,
            category_id: formData.category_id || null,
            supplier_id: formData.supplier_id || null,
            quantity: formData.quantity,
            reorder_level: formData.reorder_level,
            price: formData.price,
            cost: formData.cost,
            location: formData.location || null,
          };
      
      await updateProduct.mutateAsync({
        id: product.id,
        updates,
        oldProduct: product,
      });
    }

    onOpenChange(false);
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label>SKU</Label>
            <Input
              placeholder="PROD-001"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              disabled={mode === 'edit'}
              className="bg-secondary border-border"
            />
            {mode === 'create' && (
              <p className="text-xs text-muted-foreground">Leave empty to auto-generate</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              placeholder="Product name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isStaff}
              className="bg-secondary border-border"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Product description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isStaff}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              disabled={isStaff}
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select
              value={formData.supplier_id}
              onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
              disabled={isStaff}
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {suppliers?.map((sup) => (
                  <SelectItem key={sup.id} value={sup.id}>
                    {sup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Reorder Level</Label>
            <Input
              type="number"
              min="0"
              value={formData.reorder_level}
              onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 10 })}
              disabled={isStaff}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Price ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              disabled={isStaff}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Cost ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              disabled={isStaff}
              className="bg-secondary border-border"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Location / Warehouse</Label>
            <Input
              placeholder="Warehouse A"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Add Product' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
