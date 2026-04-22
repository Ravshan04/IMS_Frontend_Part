export interface CategoryDto {
  id: string;
  name: string;
  description: string;
  parentId?: string | null;
  productCount: number;
  totalValue: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ProductDto {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  categoryId: string;
  unit: string;
  cost: number;
  sellingPrice: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  reorderPoint: number;
  reorderQuantity: number;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface NotificationDto {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  referenceId?: string | null;
  referenceType?: string | null;
  read: boolean;
  createdAt: string;
}

export interface AssetDto {
  id: string;
  assetCode: string;
  productId: string;
  warehouseId: string;
  status: string;
  condition: string;
  serialNumber: string;
  notes: string;
  assignedUserId?: string | null;
  organizationId: string;
  createdAt: string;
  lastMovedAt?: string | null;
  isActive: boolean;
}

export interface WarehouseDto {
  id: string;
  code: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  contactPerson: string;
  phone: string;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt?: string | null;
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
  categoryName: string;
  itemCount: number;
  totalValue: number;
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

export interface UserSummaryDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  warehouseIds: string[];
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AssetLabelDto {
  assetCode: string;
  qrPayload: string;
  barcodePayload: string;
  qrImageUrl: string;
  barcodeImageUrl: string;
}

export interface AssetConditionDistDto {
  condition: string;
  count: number;
  hexColor: string;
}

export interface FacilityDistributionDto {
  facilityName: string;
  assetCount: number;
  totalValue: number;
}

export interface InventoryImportItemRequest {
  productId: string;
  warehouseId: string;
  quantity: number;
  notes?: string;
}

export interface InventoryImportRequest {
  items: InventoryImportItemRequest[];
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}

export interface InventoryImportResult {
  requestedRows: number;
  movementCount: number;
  inventoryRecordsUpdated: number;
  referenceId: string;
}

export enum MovementType {
  IN = 0,
  OUT = 1,
  TRANSFER = 2,
  ADJUSTMENT = 3,
  RETURN = 4,
  ASSIGNMENT = 5,
  REPAIR = 6
}

export enum ReferenceType {
  Adjustment = 0,
  Transfer = 1,
  Import = 2,
  AssetRegistration = 3,
  AssetAssignment = 4,
  AssetRepair = 5
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  roles: string[];
  permissions: string[];
}
