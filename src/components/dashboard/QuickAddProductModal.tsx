import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

interface QuickAddProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function QuickAddProductModal({ open, onOpenChange }: QuickAddProductModalProps) {
    const { data: categories } = useCategories();
    const createProduct = useCreateProduct();

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        quantity: '',
        price: '',
        cost: '',
        reorder_level: '',
        category_id: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await createProduct.mutateAsync({
            name: formData.name,
            sku: formData.sku,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            cost: Number(formData.cost),
            reorder_level: Number(formData.reorder_level),
            category_id: formData.category_id || null,
            supplier_id: null,
            description: null,
            location: null,
        });

        // Reset form
        setFormData({
            name: '',
            sku: '',
            quantity: '',
            price: '',
            cost: '',
            reorder_level: '',
            category_id: '',
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Quick Add Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="text-foreground">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                        <div>
                            <Label htmlFor="sku" className="text-foreground">SKU *</Label>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="quantity" className="text-foreground">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                                min="0"
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                        <div>
                            <Label htmlFor="reorder_level" className="text-foreground">Reorder Level *</Label>
                            <Input
                                id="reorder_level"
                                type="number"
                                value={formData.reorder_level}
                                onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                                required
                                min="0"
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cost" className="text-foreground">Cost *</Label>
                            <Input
                                id="cost"
                                type="number"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                required
                                min="0"
                                step="0.01"
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                        <div>
                            <Label htmlFor="price" className="text-foreground">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                min="0"
                                step="0.01"
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="category" className="text-foreground">Category</Label>
                        <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                            <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-border"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createProduct.isPending}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {createProduct.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Add Product
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
