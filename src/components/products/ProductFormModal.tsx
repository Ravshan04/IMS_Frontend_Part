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
      <DialogContent className="max-w-xl bg-card border-border border-2 rounded-3xl p-0 overflow-hidden shadow-2xl">
        <div className="bg-primary/5 p-6 border-b border-border/50">
            <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                    {mode === 'create' ? 'Define Equipment Type' : 'Edit Equipment Specs'}
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-medium italic">Define the standard specifications for this type of organizational asset.</p>
            </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Catalog ID (SKU)</Label>
                <Input
                  placeholder="EQ-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  disabled={mode === 'edit'}
                  className="bg-secondary/50 border-border font-mono font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Short Name *</Label>
                <Input
                  placeholder="e.g. Dell Latitude 5420"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-secondary/50 border-border font-bold"
                />
              </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Detailed Specifications</Label>
            <Textarea
              placeholder="Processor, RAM, Color, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-secondary/50 border-border min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Classification</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border font-bold text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border border-2">
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-xs font-bold">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Estimated Unit Value ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price === 0 ? '' : formData.price}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, price: v === '' ? 0 : parseFloat(v) || 0 });
                  }}
                  className="bg-secondary/50 border-border font-bold tabular-nums"
                />
              </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full px-6 font-bold">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-full px-12 font-black shadow-xl shadow-primary/20 h-12" disabled={isLoading}>
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {mode === 'create' ? 'Add to Catalog' : 'Update Specifications'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
