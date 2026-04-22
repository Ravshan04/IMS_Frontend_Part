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
  UserSummary,
  AssetLabel,
} from '@/types/database';
import type {
  CategoryDto,
  ProductDto,
  NotificationDto,
  AssetDto,
  WarehouseDto,
  InventoryStatusDto,
  StockMovementDto,
  UserSummaryDto,
  AssetLabelDto,
} from '@/types/api';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export function normalizeNotificationType(type: string | undefined): NotificationType {
  if (!type) return 'system';
  const mapped = type
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
    product_count: dto.productCount ?? 0,
    total_value: dto.totalValue ?? 0,
    created_at: dto.createdAt ?? new Date().toISOString(),
    updated_at: dto.updatedAt ?? new Date().toISOString(),
  };
}

export function mapProductDto(dto: ProductDto): Product {
  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    description: dto.description ?? '',
    category_id: dto.categoryId,
    cost: dto.cost,
    price: dto.sellingPrice,
    reorder_point: dto.reorderPoint,
    reorder_quantity: dto.reorderQuantity,
    tags: dto.tags ?? [],
    images: dto.images ?? [],
    created_at: dto.createdAt,
    updated_at: dto.updatedAt ?? dto.createdAt,
    barcode: dto.barcode,
    unit: dto.unit,
    weight: dto.weight,
    length: dto.length,
    width: dto.width,
    height: dto.height,
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
    created_at: dto.createdAt,
  };
}

export function mapAssetDto(dto: AssetDto): AssetItem {
  return {
    id: dto.id,
    asset_code: dto.assetCode,
    product_id: dto.productId,
    warehouse_id: dto.warehouseId,
    serial_number: dto.serialNumber,
    status: normalizeAssetStatus(dto.status),
    condition: normalizeAssetCondition(dto.condition),
    assigned_to_user_id: dto.assignedUserId ?? null,
    notes: dto.notes,
    organization_id: dto.organizationId,
    is_active: dto.isActive,
    created_at: dto.createdAt,
    updated_at: dto.lastMovedAt ?? dto.createdAt,
  };
}

export function mapWarehouseDto(dto: WarehouseDto): Warehouse {
  const locationParts = [dto.street, dto.city, dto.state, dto.country, dto.zipCode].filter(Boolean);
  return {
    id: dto.id,
    name: dto.name,
    location: locationParts.length > 0 ? locationParts.join(', ') : null,
    description: dto.code ? `Code: ${dto.code}` : null,
    contact_person: dto.contactPerson,
    phone: dto.phone,
    is_active: dto.isActive,
    organization_id: dto.organizationId,
    created_at: dto.createdAt,
    updated_at: dto.updatedAt ?? dto.createdAt,
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

export function mapUserSummaryDto(dto: UserSummaryDto): UserSummary {
  return {
    id: dto.id,
    email: dto.email,
    first_name: dto.firstName,
    last_name: dto.lastName,
    roles: dto.roles ?? [],
    warehouse_ids: dto.warehouseIds ?? [],
    is_active: dto.isActive,
    last_login_at: dto.lastLoginAt ?? null,
    created_at: dto.createdAt,
  };
}

export function mapAssetLabelDto(dto: AssetLabelDto): AssetLabel {
  return {
    asset_code: dto.assetCode,
    qr_payload: dto.qrPayload,
    barcode_payload: dto.barcodePayload,
    qr_image_url: dto.qrImageUrl,
    barcode_image_url: dto.barcodeImageUrl,
  };
}

export { EMPTY_GUID };
