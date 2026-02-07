import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLowStockProducts } from '@/hooks/useProducts';
import { AlertTriangle, Package, ShoppingCart, Edit, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LowStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder?: (productId: string) => void;
}

export default function LowStockModal({ open, onOpenChange, onCreateOrder }: LowStockModalProps) {
  const { data: products, isLoading } = useLowStockProducts();
  const navigate = useNavigate();

  // Sort by severity (lowest stock percentage first)
  const sortedProducts = products?.sort((a, b) => {
    const percentageA = a.reorder_level > 0 ? a.quantity / a.reorder_level : 0;
    const percentageB = b.reorder_level > 0 ? b.quantity / b.reorder_level : 0;
    return percentageA - percentageB;
  });

  const getSeverityColor = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return 'bg-destructive/10 text-destructive border-destructive/20';
    const percentage = quantity / reorderLevel;
    if (percentage <= 0.5) return 'bg-destructive/10 text-destructive border-destructive/20';
    return 'bg-warning/10 text-warning border-warning/20';
  };

  const getSuggestedReorderQuantity = (product: { quantity: number; reorder_level: number }) => {
    return Math.max(product.reorder_level * 2 - product.quantity, product.reorder_level);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Low Stock Alerts
            {products && products.length > 0 && (
              <Badge variant="destructive">{products.length} items</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sortedProducts && sortedProducts.length > 0 ? (
            <div className="space-y-3">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    'glass rounded-lg p-4 border-l-4',
                    product.quantity === 0 ? 'border-l-destructive' : 'border-l-warning'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-semibold text-foreground">{product.name}</h4>
                        <span className="text-sm text-muted-foreground">({product.sku})</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current Quantity</p>
                          <p className={cn(
                            'font-bold text-lg',
                            product.quantity === 0 ? 'text-destructive' : 'text-warning'
                          )}>
                            {product.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reorder Level</p>
                          <p className="font-medium text-foreground">{product.reorder_level}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Suggested Order</p>
                          <p className="font-medium text-success">
                            +{getSuggestedReorderQuantity(product)}
                          </p>
                        </div>
                      </div>
                      {product.supplier && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Supplier: {product.supplier.name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getSeverityColor(product.quantity, product.reorder_level)}>
                        {product.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border"
                          onClick={() => {
                            onOpenChange(false);
                            navigate(`/products?edit=${product.id}`);
                          }}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => {
                            onOpenChange(false);
                            if (onCreateOrder) {
                              onCreateOrder(product.id);
                            } else {
                              navigate('/orders?create=true');
                            }
                          }}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Order
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-success mb-3" />
              <p className="text-lg font-medium text-foreground">All Stock Levels Are Good!</p>
              <p className="text-muted-foreground mt-1">No products are below their reorder level.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
