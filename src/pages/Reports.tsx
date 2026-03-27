import { FileText, Download, Filter, ShieldCheck, Activity, AlignLeft, LayoutGrid, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategoryDistribution, useConditionDistribution, useFacilityDistribution } from '@/hooks/useReporting';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const reportTypes = [
  { id: 'assets', name: 'Asset Overview', description: 'Total units, status & condition', icon: ShieldCheck, color: 'text-primary' },
  { id: 'condition', name: 'Condition Analysis', description: 'Physical state distribution', icon: Activity, color: 'text-success' },
  { id: 'facility', name: 'Facility Distribution', description: 'Assets per location/room', icon: AlignLeft, color: 'text-warning' },
  { id: 'category', name: 'Equipment Hierarchy', description: 'Distribution across categories', icon: LayoutGrid, color: 'text-primary' },
];

export default function Reports() {
  const { data: categoryData, isLoading: catLoading } = useCategoryDistribution();
  const { data: conditionData, isLoading: condLoading } = useConditionDistribution();
  const { data: facilityData, isLoading: facLoading } = useFacilityDistribution();

  const isLoading = catLoading || condLoading || facLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
          <p className="text-muted-foreground animate-pulse">Analyzing Assets...</p>
        </div>
      </MainLayout>
    );
  }

  // Build condition pie chart data
  const conditionChartData = (conditionData || []).map(c => ({
    name: c.condition,
    value: c.count,
    fill: c.color,
  }));

  // Build facility bar chart data
  const facilityChartData = (facilityData || []).map(f => ({
    name: f.facilityName,
    assets: f.assetCount,
    value: f.totalValue,
  }));

  // Build category progress bars
  const totalCatAssets = (categoryData || []).reduce((sum, c) => sum + c.assetCount, 0);

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Asset Reports"
          description="In-depth analytics on your organization's equipment and asset portfolio."
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
              <Select defaultValue="assets">
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
          {/* Facility Bar Chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-8 h-[450px] animate-slide-up [animation-delay:300ms] border border-border/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="w-2 h-6 bg-primary rounded-full" />
                Facility Distribution
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Asset Count</span>
                </div>
              </div>
            </div>
            {facilityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={facilityChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                    dataKey="assets"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[80%] text-muted-foreground text-sm">
                No facility data available yet. Add assets to see distribution.
              </div>
            )}
          </div>

          {/* Condition Pie + Category Bars */}
          <div className="flex flex-col gap-8">
            {/* Condition Pie Chart */}
            <div className="glass rounded-2xl p-6 animate-slide-up [animation-delay:350ms] border border-border/50">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-2 h-5 bg-success rounded-full" />
                Condition Summary
              </h3>
              {conditionChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={conditionChartData} cx="50%" cy="50%" outerRadius={64} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                      {conditionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`${val} assets`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">No condition data yet.</p>
              )}
            </div>

            {/* Category progress bars */}
            <div className="glass rounded-2xl p-6 animate-slide-up [animation-delay:400ms] border border-border/50 flex-1">
              <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                <div className="w-2 h-5 bg-warning rounded-full" />
                By Category
              </h3>
              <div className="space-y-5">
                {(categoryData || []).slice(0, 5).map((item, index) => {
                  const pct = totalCatAssets > 0 ? Math.round((item.assetCount / totalCatAssets) * 100) : 0;
                  return (
                    <div key={item.name} className="group cursor-default">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate max-w-[120px]">{item.name}</span>
                        <span className="text-xs font-black text-primary tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden border border-border/30">
                        <div
                          className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%`, animationDelay: `${index * 150}ms` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!categoryData || categoryData.length === 0) && (
                  <p className="text-xs text-muted-foreground text-center py-4">No category data yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
