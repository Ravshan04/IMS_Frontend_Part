import { mockProducts, mockCategories, mockSuppliers } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function RecentProducts() {
  const getCategory = (id: string) => mockCategories.find((c) => c.id === id)?.name || 'Unknown';
  const getSupplier = (id: string) => mockSuppliers.find((s) => s.id === id)?.name || 'Unknown';

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity <= 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= reorderLevel) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Products</h3>
        <p className="text-sm text-muted-foreground">Latest inventory updates</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Product
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Supplier
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.slice(0, 5).map((product) => {
              const status = getStockStatus(product.quantity, product.reorderLevel);
              return (
                <tr key={product.id} className="border-b border-border/50 table-row-hover">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {getCategory(product.categoryId)}
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {getSupplier(product.supplierId)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      'font-medium',
                      product.quantity <= product.reorderLevel ? 'text-warning' : 'text-foreground'
                    )}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-foreground">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <Badge
                      variant={status.variant === 'success' ? 'default' : status.variant === 'warning' ? 'secondary' : 'destructive'}
                      className={cn(
                        status.variant === 'success' && 'bg-success/10 text-success border-success/20',
                        status.variant === 'warning' && 'bg-warning/10 text-warning border-warning/20'
                      )}
                    >
                      {status.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
