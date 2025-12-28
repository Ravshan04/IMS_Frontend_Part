export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  supplierId: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  cost: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  productCount: number;
  totalValue: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  leadTime: number;
  productCount: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  orderDate: Date;
  expectedDate: Date;
  receivedDate?: Date;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  totalCategories: number;
  totalSuppliers: number;
  totalValue: number;
  monthlyGrowth: number;
}

export interface ChartData {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}
