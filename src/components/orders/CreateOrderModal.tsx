import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useProducts } from '@/hooks/useProducts';
import { useCreatePurchaseOrder } from '@/hooks/usePurchaseOrders';
import { Plus, Trash2, Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedProductId?: string;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
}

export default function CreateOrderModal({ open, onOpenChange, preselectedProductId }: CreateOrderModalProps) {
  const [step, setStep] = useState(1);
  const [supplierId, setSupplierId] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const { data: suppliers } = useSuppliers();
  const { data: products } = useProducts();
  const createOrder = useCreatePurchaseOrder();

  const selectedSupplier = suppliers?.find(s => s.id === supplierId);
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);

  const handleAddProduct = () => {
    const product = products?.find(p => p.id === selectedProductId);
    if (product && !items.find(i => i.product_id === selectedProductId)) {
      setItems([...items, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_cost: product.cost,
      }]);
      setSelectedProductId('');
    }
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(i => i.product_id !== productId));
  };

  const handleUpdateItem = (productId: string, field: 'quantity' | 'unit_cost', value: number) => {
    setItems(items.map(item => 
      item.product_id === productId ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    await createOrder.mutateAsync({
      order: {
        supplier_id: supplierId,
        expected_date: expectedDate || undefined,
        notes: notes || undefined,
      },
      items: items.map(({ product_id, quantity, unit_cost }) => ({
        product_id,
        quantity,
        unit_cost,
      })),
    });
    
    // Reset form
    setStep(1);
    setSupplierId('');
    setExpectedDate('');
    setNotes('');
    setItems([]);
    onOpenChange(false);
  };

  const canProceedToStep2 = !!supplierId;
  const canProceedToStep3 = items.length > 0;
  const canSubmit = canProceedToStep2 && canProceedToStep3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Purchase Order</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors',
                step >= s 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground'
              )}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div className={cn(
                  'w-8 h-0.5 mx-1',
                  step > s ? 'bg-primary' : 'bg-secondary'
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Supplier */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Choose a supplier" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {suppliers?.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSupplier && (
              <div className="glass rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-foreground">Supplier Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contact</p>
                    <p className="text-foreground">{selectedSupplier.contact_person || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedSupplier.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="text-foreground">{selectedSupplier.rating}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lead Time</p>
                    <p className="text-foreground">{selectedSupplier.lead_time} days</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Add Products */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="flex-1 bg-secondary border-border">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-[200px]">
                  {products?.filter(p => !items.find(i => i.product_id === p.id)).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku}) - Stock: {product.quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddProduct} disabled={!selectedProductId} className="bg-primary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No products added yet. Select products above.
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.product_id} className="glass rounded-lg p-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.product_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.product_id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20 bg-secondary border-border"
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_cost}
                        onChange={(e) => handleUpdateItem(item.product_id, 'unit_cost', parseFloat(e.target.value) || 0)}
                        className="w-24 bg-secondary border-border"
                      />
                      <span className="text-foreground font-medium w-24 text-right">
                        ${(item.quantity * item.unit_cost).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Set Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-secondary border-border"
              />
              {selectedSupplier && (
                <p className="text-xs text-muted-foreground">
                  Supplier lead time: {selectedSupplier.lead_time} days
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any notes for this order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="glass rounded-lg p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supplier</span>
                <span className="text-foreground font-medium">{selectedSupplier?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="text-foreground font-medium">{items.length} products</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Date</span>
                <span className="text-foreground font-medium">
                  {expectedDate || 'Not set'}
                </span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between">
                <span className="text-foreground font-semibold">Total Amount</span>
                <span className="text-primary font-bold text-xl">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="glass rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Order Items</h4>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="text-foreground">
                      ${(item.quantity * item.unit_cost).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedToStep2) ||
                (step === 2 && !canProceedToStep3)
              }
              className="bg-primary hover:bg-primary/90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || createOrder.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createOrder.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Order
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
