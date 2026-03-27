import type {
  Category,
  Product,
  Notification,
  NotificationType,
  AssetItem,
  AssetStatus,
  AssetCondition,
  Warehouse,
  InventoryStatus,
  StockMovement,
} from '@/types/database';
import type {
  CategoryDto,
  ProductDto,
  NotificationDto,
  AssetDto,
  WarehouseDto,
  InventoryStatusDto,
  StockMovementDto,
} from '@/types/api';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export function normalizeNotificationType(type: string | undefined): NotificationType {
  if (!type) return 'system';
  const value = type.toLowerCase();
  const mapped = value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase() as NotificationType;
  return mapped;
}

export function normalizeAssetStatus(status: string | undefined): AssetStatus {
  const value = (status ?? '').toLowerCase();
  switch (value) {
    case 'inwarehouse':
    case 'in_warehouse':
    case 'in-warehouse':
    case 'warehouse':
      return 'InWarehouse';
    case 'assigned':
    case 'inuse':
    case 'in_use':
      return 'Assigned';
    case 'inrepair':
    case 'in_repair':
    case 'in-repair':
    case 'repair':
      return 'InRepair';
    case 'lost':
      return 'Lost';
    case 'retired':
      return 'Retired';
    default:
      return 'InWarehouse';
  }
}

export function normalizeAssetCondition(condition: string | undefined): AssetCondition {
  const value = (condition ?? '').toLowerCase();
  switch (value) {
    case 'new':
      return 'New';
    case 'good':
      return 'Good';
    case 'damaged':
      return 'Damaged';
    case 'broken':
      return 'Broken';
    default:
      return 'Good';
  }
}

export function mapCategoryDto(dto: CategoryDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
    parent_id: dto.parentId ?? null,
    product_count: 0,
    total_value: 0,
    created_at: dto.createdAt ?? new Date().toISOString(),
    updated_at: dto.updatedAt ?? new Date().toISOString(),
  };
}

export function mapProductDto(dto: ProductDto): Product {
  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    description: dto.description ?? null,
    category_id: dto.categoryId ?? null,
    cost: dto.cost ?? 0,
    price: dto.sellingPrice ?? 0,
    reorder_point: dto.reorderPoint,
    reorder_quantity: dto.reorderQuantity ?? 0,
    tags: dto.tags ?? [],
    images: dto.images ?? [],
    created_at: dto.createdAt ?? new Date().toISOString(),
    updated_at: dto.updatedAt ?? new Date().toISOString(),
    barcode: dto.barcode ?? '',
    unit: dto.unit ?? 'Piece',
    weight: dto.weight ?? 0,
    length: dto.length ?? 0,
    width: dto.width ?? 0,
    height: dto.height ?? 0,
  };
}

export function mapNotificationDto(dto: NotificationDto): Notification {
  return {
    id: dto.id,
    user_id: dto.userId,
    type: normalizeNotificationType(dto.type),
    title: dto.title,
    message: dto.message,
    reference_id: dto.referenceId ?? null,
    reference_type: dto.referenceType ?? null,
    read: !!dto.read,
    created_at: dto.createdAt ?? new Date().toISOString(),
  };
}

export function mapAssetDto(dto: AssetDto): AssetItem {
  return {
    id: dto.id,
    asset_code: dto.assetCode,
    product_id: dto.productId,
    warehouse_id: dto.warehouseId,
    serial_number: dto.serialNumber ?? null,
    status: normalizeAssetStatus(dto.status),
    condition: normalizeAssetCondition(dto.condition),
    assigned_to_user_id: dto.assignedUserId ?? null,
    notes: dto.notes ?? null,
    organization_id: dto.organizationId ?? EMPTY_GUID,
    created_at: dto.createdAt ?? new Date().toISOString(),
    updated_at: dto.lastMovedAt ?? dto.createdAt ?? new Date().toISOString(),
  };
}

export function mapWarehouseDto(dto: WarehouseDto): Warehouse {
  const locationParts = [dto.street, dto.city, dto.state, dto.country, dto.zipCode].filter(Boolean);
  return {
    id: dto.id,
    name: dto.name,
    location: locationParts.length > 0 ? locationParts.join(', ') : null,
    description: dto.code ? `Code: ${dto.code}` : null,
    contact_person: dto.contactPerson ?? null,
    phone: dto.phone ?? null,
    is_active: dto.isActive ?? true,
    organization_id: dto.organizationId ?? EMPTY_GUID,
    created_at: dto.createdAt ?? new Date().toISOString(),
    updated_at: dto.updatedAt ?? new Date().toISOString(),
  };
}

export function mapInventoryDto(dto: InventoryStatusDto): InventoryStatus {
  return {
    product_id: dto.productId,
    warehouse_id: dto.warehouseId,
    quantity: dto.quantity,
    reserved_quantity: dto.reservedQuantity,
    available_quantity: dto.availableQuantity,
    last_stock_update: dto.lastStockUpdate,
  };
}

export function mapStockMovementDto(dto: StockMovementDto): StockMovement {
  return {
    id: dto.id,
    product_id: dto.productId,
    warehouse_id: dto.warehouseId,
    movement_type: dto.movementType as any,
    quantity: dto.quantity,
    reference_type: dto.referenceType,
    reference_id: dto.referenceId,
    notes: dto.notes,
    performed_by: dto.performedBy,
    created_at: dto.createdAt,
  };
}

export { EMPTY_GUID };
