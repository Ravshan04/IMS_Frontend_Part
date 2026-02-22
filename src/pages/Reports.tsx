import { FileText, Download, Filter, Calendar, TrendingUp, Package, Truck, LayoutGrid } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supplierPerformance, categoryDistribution } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const reportTypes = [
  { id: 'inventory', name: 'Inventory Status', description: 'Stock levels & valuation overview', icon: Package, color: 'text-primary' },
  { id: 'sales', name: 'Revenue Analysis', description: 'Track sales trends & profitability', icon: TrendingUp, color: 'text-success' },
  { id: 'supplier', name: 'Supply Metrics', description: 'Evaluation of vendor reliability', icon: Truck, color: 'text-warning' },
  { id: 'category', name: 'Product Hierarchy', description: 'Distribution across categories', icon: LayoutGrid, color: 'text-primary' },
];

export default function Reports() {
  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Reports"
          description="In-depth analytics and data exports for your business intelligence."
        />

        {/* Global Controls */}
        <div className="glass rounded-2xl p-6 mb-8 animate-slide-up border border-border/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Report Engine</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full">
              <Select defaultValue="inventory">
                <SelectTrigger className="w-full sm:w-[220px] bg-secondary border-border/50 rounded-xl h-11">
                  <SelectValue placeholder="Select report focus" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50 rounded-xl overflow-hidden shadow-2xl">
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id} className="cursor-pointer py-3 px-4">
                      <div className="flex items-center gap-2">
                        <type.icon className={cn("w-4 h-4", type.color)} />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl border border-border/50">
                <Input type="date" className="w-[140px] bg-transparent border-none h-9 text-xs focus-visible:ring-0" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">to</span>
                <Input type="date" className="w-[140px] bg-transparent border-none h-9 text-xs focus-visible:ring-0" />
              </div>

              <div className="flex-1" />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" className="h-11 rounded-xl border-border/50 px-6 gap-2 flex-1 sm:flex-none">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <Button variant="default" className="h-11 rounded-xl px-6 gap-2 flex-1 sm:flex-none">
                  <Download className="w-4 h-4" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 overflow-hidden">
          {reportTypes.map((report, index) => (
            <div
              key={report.id}
              className={cn(
                "group relative stat-card cursor-pointer animate-slide-up",
                index === 0 ? "border-primary/20 bg-primary/5" : ""
              )}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="relative z-10">
                <div className={cn("p-4 rounded-2xl bg-background/50 border border-border/50 w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300", report.color)}>
                  <report.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">{report.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
                  Generate now →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass rounded-2xl p-8 h-[450px] animate-slide-up [animation-delay:300ms] border border-border/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="w-2 h-6 bg-primary rounded-full" />
                Supplier Reliability Analysis
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Deliveries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">On-Time</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={supplierPerformance} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--secondary) / 0.4)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Bar
                  dataKey="deliveries"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
                <Bar
                  dataKey="onTime"
                  fill="hsl(var(--success))"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-8 animate-slide-up [animation-delay:400ms] border border-border/50">
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-6 bg-success rounded-full" />
              Stock Composition
            </h3>
            <div className="space-y-8">
              {categoryDistribution.map((item, index) => (
                <div key={item.name} className="group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                    <span className="text-sm font-black text-primary tabular-nums">{item.value}%</span>
                  </div>
                  <div className="h-3 bg-secondary/50 rounded-full overflow-hidden border border-border/30">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                      style={{
                        width: `${item.value}%`,
                        animation: `slideLeft 1s ease-out ${index * 150}ms forwards`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-5 rounded-2xl bg-secondary/30 border border-border/50">
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-2">Pro Indicator</p>
              <p className="text-xs text-foreground leading-relaxed">Your most stocked category is <span className="text-primary font-bold">Electronics</span>. Consider re-evaluating storage allocation for better efficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
