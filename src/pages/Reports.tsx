import { FileText, Download, Filter, Calendar } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
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

const reportTypes = [
  { id: 'inventory', name: 'Inventory Report', description: 'Complete stock levels and valuation', icon: FileText },
  { id: 'sales', name: 'Sales Report', description: 'Sales trends and revenue analysis', icon: FileText },
  { id: 'supplier', name: 'Supplier Report', description: 'Supplier performance and delivery metrics', icon: FileText },
  { id: 'category', name: 'Category Report', description: 'Category-wise stock distribution', icon: FileText },
];

export default function Reports() {
  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
            <p className="text-muted-foreground">Generate and export inventory reports</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-6 mb-8 animate-slide-up">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select>
              <SelectTrigger className="w-[180px] bg-secondary border-border">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {reportTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input type="date" className="w-[150px] bg-secondary border-border" />
              <span className="text-muted-foreground">to</span>
              <Input type="date" className="w-[150px] bg-secondary border-border" />
            </div>
            <div className="flex-1" />
            <Button variant="outline" className="border-border">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="border-border">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reportTypes.map((report, index) => (
            <div
              key={report.id}
              className={`stat-card cursor-pointer animate-slide-up [animation-delay:${index * 50}ms]`}
            >
              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                  <report.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{report.name}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6 h-[400px] animate-slide-up [animation-delay:200ms]">
            <h3 className="text-lg font-semibold text-foreground mb-6">Supplier Performance</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={supplierPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  dataKey="deliveries" 
                  name="Total Deliveries" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="onTime" 
                  name="On-Time" 
                  fill="hsl(var(--success))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-xl p-6 animate-slide-up [animation-delay:250ms]">
            <h3 className="text-lg font-semibold text-foreground mb-6">Quick Stats</h3>
            <div className="space-y-4">
              {categoryDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.value}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
