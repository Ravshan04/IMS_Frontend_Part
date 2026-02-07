import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProductHistory } from '@/hooks/useProducts';
import { Product } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';
import { History, User } from 'lucide-react';

interface ProductHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export default function ProductHistoryModal({ open, onOpenChange, product }: ProductHistoryModalProps) {
  const { data: history, isLoading } = useProductHistory(product.id);

  const formatFieldName = (field: string) => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <History className="w-5 h-5" />
            Product History: {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading history...</div>
          ) : history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((entry: any) => (
                <div key={entry.id} className="glass rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {formatFieldName(entry.field_name)} changed
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="text-destructive line-through">{entry.old_value || 'null'}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-success">{entry.new_value || 'null'}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {entry.profile && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>
                        {entry.profile.first_name} {entry.profile.last_name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No history available for this product</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
