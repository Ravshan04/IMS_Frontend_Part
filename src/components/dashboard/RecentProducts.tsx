import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

export default function RecentProducts() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const categoryMap = useMemo(
    () => new Map((categories || []).map((category) => [category.id, category.name])),
    [categories]
  );

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Products</h3>
        <p className="text-sm text-muted-foreground">Latest product updates</p>
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
                Unit
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {(products || []).slice(0, 5).map((product) => {
              return (
                <tr key={product.id} className="border-b border-border/50 table-row-hover">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {categoryMap.get(product.category_id || '') || 'Uncategorized'}
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {product.unit || 'Piece'}
                  </td>
                  <td className="py-4 px-6 font-medium text-foreground">
                    ${(product.price || 0).toLocaleString()}
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
