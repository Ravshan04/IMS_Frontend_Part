import { useState } from 'react';
import { Plus, Upload, Download, Edit, Trash2, Eye } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProducts, mockCategories, mockSuppliers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getCategory = (id: string) => mockCategories.find((c) => c.id === id)?.name || 'Unknown';
  const getSupplier = (id: string) => mockSuppliers.find((s) => s.id === id)?.name || 'Unknown';

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity <= 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= reorderLevel) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

  const columns = [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      render: (item: typeof mockProducts[0]) => (
        <span className="font-mono text-sm text-primary">{item.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (item: typeof mockProducts[0]) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {item.description}
          </p>
        </div>
      ),
    },
    {
      key: 'categoryId',
      header: 'Category',
      render: (item: typeof mockProducts[0]) => (
        <Badge variant="outline" className="bg-secondary/50">
          {getCategory(item.categoryId)}
        </Badge>
      ),
    },
    {
      key: 'supplierId',
      header: 'Supplier',
      render: (item: typeof mockProducts[0]) => (
        <span className="text-muted-foreground">{getSupplier(item.supplierId)}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
      render: (item: typeof mockProducts[0]) => (
        <span
          className={cn(
            'font-medium',
            item.quantity <= item.reorderLevel ? 'text-warning' : 'text-foreground'
          )}
        >
          {item.quantity}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (item: typeof mockProducts[0]) => (
        <span className="font-medium text-foreground">${item.price.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof mockProducts[0]) => {
        const status = getStockStatus(item.quantity, item.reorderLevel);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="border-border">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input placeholder="PROD-001" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Product name" className="bg-secondary border-border" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Product description" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {mockCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {mockSuppliers.map((sup) => (
                          <SelectItem key={sup.id} value={sup.id}>
                            {sup.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="0" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Reorder Level</Label>
                    <Input type="number" placeholder="10" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input type="number" placeholder="0.00" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cost ($)</Label>
                    <Input type="number" placeholder="0.00" className="bg-secondary border-border" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Location / Warehouse</Label>
                    <Input placeholder="Warehouse A" className="bg-secondary border-border" />
                  </div>
                  <div className="col-span-2 flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      Add Product
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Data Table */}
        <div className="animate-slide-up">
          <DataTable
            data={mockProducts}
            columns={columns}
            searchKeys={['name', 'sku', 'description']}
          />
        </div>
      </div>
    </MainLayout>
  );
}
