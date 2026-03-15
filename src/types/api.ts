export interface CategoryDto {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierDto {
  id: string;
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  rating?: number;
  leadTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerDto {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDto {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  unit?: string | null;
  cost?: number;
  sellingPrice?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrderItemDto {
  productId?: string | null;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface PurchaseOrderDto {
  id: string;
  poNumber?: string;
  supplierId?: string | null;
  warehouseId?: string | null;
  status?: string;
  items?: PurchaseOrderItemDto[];
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationDto {
  id: string;
  userId: string;
  type?: string;
  title: string;
  message: string;
  referenceId?: string | null;
  referenceType?: string | null;
  read?: boolean;
  createdAt?: string;
}

export interface AssetDto {
  id: string;
  assetCode: string;
  productId: string;
  warehouseId: string;
  serialNumber?: string | null;
  status: string;
  condition: string;
  assignedUserId?: string | null;
  notes?: string | null;
  organizationId?: string;
  createdAt?: string;
  lastMovedAt?: string;
}

export interface WarehouseDto {
  id: string;
  name: string;
  code?: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStatsDto {
  totalProducts: number;
  lowStockItems: number;
  totalCategories: number;
  totalSuppliers: number;
  totalValue: number;
  pendingOrders: number;
}

export interface SalesTrendDto {
  date?: string;
  totalSales?: number;
}

export interface CategoryDistributionDto {
  categoryName?: string;
  totalValue?: number;
  productCount?: number;
}
