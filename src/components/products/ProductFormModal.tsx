import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Product } from '@/types/database';

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  mode: 'create' | 'edit';
}

export default function ProductFormModal({ open, onOpenChange, product, mode }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category_id: '',
    price: 0,
    barcode: '',
    unit: 'Piece',
  });

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || '',
        price: product.price || 0,
        barcode: product.barcode || '',
        unit: product.unit || 'Piece',
      });
    } else {
      setFormData({
        sku: '',
        name: '',
        description: '',
        category_id: '',
        price: 0,
        barcode: '',
        unit: 'Piece',
      });
    }
  }, [product, mode, open]);

  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const generateSku = () => {
    const prefix = 'EQ';
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      sku: formData.sku || generateSku(),
      name: formData.name,
      description: formData.description || null,
      category_id: formData.category_id || null,
      barcode: formData.barcode || '',
      unit: formData.unit || 'Piece',
      price: formData.price,
      cost: 0,
      reorder_point: 0,
      reorder_quantity: 0,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      tags: [],
      images: [],
    };

    if (mode === 'create') {
      await createProduct.mutateAsync(payload);
    } else if (product) {
      await updateProduct.mutateAsync({
        id: product.id,
        ...payload,
      });
    }

    onOpenChange(false);
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border-border rounded-xl p-0 overflow-hidden shadow-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-lg font-semibold text-foreground">
                {mode === 'create' ? 'New equipment type' : 'Edit equipment type'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Define the standard specifications for this asset type.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">SKU</Label>
              <Input
                placeholder="EQ-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                disabled={mode === 'edit'}
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Dell Latitude 5420"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Description</Label>
            <Textarea
              placeholder="Processor, RAM, color, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[96px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Unit value ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price === 0 ? '' : formData.price}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData({ ...formData, price: v === '' ? 0 : parseFloat(v) || 0 });
                }}
                className="tabular-nums"
              />
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
