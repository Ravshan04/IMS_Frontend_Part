import type {
  Category,
  Supplier,
  Customer,
  CustomerStatus,
  Product,
  PurchaseOrder,
  PurchaseOrderItem,
  Notification,
  OrderStatus,
  NotificationType,
  AssetItem,
  AssetStatus,
  AssetCondition,
  Warehouse,
} from '@/types/database';
import type {
  CategoryDto,
  SupplierDto,
  CustomerDto,
  ProductDto,
  PurchaseOrderDto,
  PurchaseOrderItemDto,
  NotificationDto,
  AssetDto,
  WarehouseDto,
} from '@/types/api';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export function normalizeOrderStatus(status: string | undefined): OrderStatus {
  if (!status) return 'pending';
  return status.toLowerCase() as OrderStatus;
}

export function normalizeNotificationType(type: string | undefined): NotificationType {
  if (!type) return 'system';
  const value = type.toLowerCase();
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase() as NotificationType;
}

export function normalizeCustomerStatus(status: string | undefined): CustomerStatus {
  const value = (status ?? '').toLowerCase();
  return value === 'inactive' ? 'inactive' : 'active';
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

export function mapSupplierDto(dto: SupplierDto): Supplier {
  return {
    id: dto.id,
    name: dto.name,
    contact_person: dto.contactPerson ?? null,
    email: dto.email ?? null,
    phone: dto.phone ?? null,
    address: dto.address ?? null,
    rating: dto.rating ?? 0,
    lead_time: dto.leadTime ?? 0,
    product_count: 0,
    created_at: dto.createdAt ?? new Date().toISOString(),
    updated_at: dto.updatedAt ?? new Date().toISOString(),
  };
}

export function mapCustomerDto(dto: CustomerDto): Customer {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email ?? null,
    phone: dto.phone ?? null,
    address: dto.address ?? null,
    status: normalizeCustomerStatus(dto.status),
    total_orders: 0,
    total_spent: 0,
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

export function mapPurchaseOrderDto(dto: PurchaseOrderDto): PurchaseOrder {
  const now = new Date().toISOString();
  const items: PurchaseOrderItem[] = (dto.items || []).map((item: PurchaseOrderItemDto, index: number) => ({
    id: `${dto.id}-${item.productId ?? 'unknown'}-${index}`,
    order_id: dto.id,
    product_id: item.productId ?? null,
    quantity: item.quantity ?? 0,
    unit_cost: item.unitPrice ?? 0,
    received_quantity: 0,
    created_at: now,
  }));

  return {
    id: dto.id,
    order_number: dto.poNumber ?? '',
    supplier_id: dto.supplierId ?? null,
    warehouse_id: dto.warehouseId ?? null,
    status: normalizeOrderStatus(dto.status),
    total_amount: dto.totalAmount ?? 0,
    order_date: now,
    expected_date: null,
    received_date: null,
    notes: null,
    created_by: null,
    created_at: now,
    updated_at: now,
    items,
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
    organization_id: dto.organizationId ?? EMPTY_GUID,
    created_at: dto.createdAt ?? new Date().toISOString(),
    updated_at: dto.updatedAt ?? new Date().toISOString(),
  };
}

export { EMPTY_GUID };
