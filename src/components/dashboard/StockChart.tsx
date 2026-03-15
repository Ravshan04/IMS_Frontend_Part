import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStockLevels } from '@/hooks/useReporting';
import { Loader2 } from 'lucide-react';

export default function StockChart() {
  const { data: stockData, isLoading } = useStockLevels();

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6 h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 h-[400px]">
      <h3 className="text-lg font-semibold text-foreground mb-6">Stock Levels by Category</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={stockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Legend />
          <Bar 
            dataKey="inStock" 
            name="In Stock" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="lowStock" 
            name="Low Stock" 
            fill="hsl(var(--warning))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
