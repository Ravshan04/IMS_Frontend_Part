import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateProduct } from '@/hooks/useProducts';
import { Loader2, PackagePlus } from 'lucide-react';

interface QuickAddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickAddProductModal({ open, onOpenChange }: QuickAddProductModalProps) {
  const createProduct = useCreateProduct();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      await createProduct.mutateAsync({
        name,
        sku: `EQ-${Date.now().toString(36).toUpperCase()}`,
        price: 0,
        cost: 0,
        unit: 'Piece',
        category_id: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      setName('');
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-card border-border border-2 rounded-3xl overflow-hidden p-0 shadow-2xl">
            <div className="bg-success/5 p-6 border-b border-border/50">
                <DialogHeader>
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                        <PackagePlus className="w-6 h-6 text-success" />
                    </div>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">
                        Quick Catalog Entry
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground font-medium">Add a basic equipment type name to the registry quickly.</p>
                </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Item Name (General Type)</Label>
                    <Input 
                        placeholder="e.g. Ergonomic Office Chair" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 bg-secondary/50 border-border font-bold text-lg"
                        required
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" className="rounded-full px-6 font-bold" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        className="bg-success hover:bg-success/90 rounded-full px-10 font-black h-12 shadow-xl shadow-success/20"
                        disabled={createProduct.isPending}
                    >
                        {createProduct.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Item'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  );
}
