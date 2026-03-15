import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLowStockProducts } from '@/hooks/useProducts';
import { AlertTriangle, Package, Loader2 } from 'lucide-react';

interface LowStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder?: (productId: string) => void;
}

export default function LowStockModal({ open, onOpenChange }: LowStockModalProps) {
  const { isLoading } = useLowStockProducts();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Low Stock Alerts
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium text-foreground">Stock Level Data Unavailable</p>
              <p className="text-muted-foreground mt-1">
                Inventory quantities are not exposed by the backend yet. Low stock alerts will appear here once
                tracking is enabled.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
