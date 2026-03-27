export interface CategoryDto {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
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
  unit: string;
  cost?: number;
  sellingPrice: number;
  reorderPoint: number;
  reorderQuantity?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  tags?: string[];
  images?: string[];
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
  contactPerson?: string | null;
  phone?: string | null;
  isActive?: boolean;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStatsDto {
  totalAssetUnits: number;
  totalEquipmentTypes: number;
  totalFacilities: number;
  totalAssetValue: number;
  assignedAssets: number;
  maintenanceRequiredCount: number;
}

export interface CategoryDistributionDto {
  categoryName?: string;
  itemCount?: number;
  totalValue?: number;
}

export interface InventoryStatusDto {
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastStockUpdate: string;
}

export interface StockMovementDto {
  id: string;
  productId: string;
  warehouseId: string;
  movementType: string;
  quantity: number;
  referenceType: string;
  referenceId: string;
  notes: string;
  performedBy: string;
  createdAt: string;
}
