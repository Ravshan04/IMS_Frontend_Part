export type AppRole = 'Owner' | 'Admin' | 'Manager' | 'WarehouseOperator' | 'Viewer';

export type NotificationType =
  | 'low_stock'
  | 'asset_assigned'
  | 'asset_repair_started'
  | 'asset_repair_completed'
  | 'asset_retired'
  | 'asset_warranty_expired'
  | 'asset_maintenance_due'
  | 'system';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  product_count: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category_id: string | null;
  cost: number;
  price: number;
  reorder_point?: number;
  reorder_quantity?: number;
  tags?: string[];
  images?: string[];
  created_at: string;
  updated_at: string;
  barcode?: string;
  unit?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  category?: Category;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  reference_id: string | null;
  reference_type: string | null;
  read: boolean;
  created_at: string;
}

export interface ProductHistory {
  id: string;
  product_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: string | null;
  created_at: string;
  profile?: Profile;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  contact_person?: string | null;
  phone?: string | null;
  is_active?: boolean;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export type AssetStatus = 'InWarehouse' | 'Assigned' | 'InRepair' | 'Lost' | 'Retired';
export type AssetCondition = 'New' | 'Good' | 'Damaged' | 'Broken';

export interface AssetItem {
  id: string;
  asset_code: string;
  product_id: string;
  warehouse_id: string;
  serial_number: string | null;
  status: AssetStatus;
  condition: AssetCondition;
  assigned_to_user_id: string | null;
  notes: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  warehouse?: Warehouse;
  profile?: Profile;
}

export interface InventoryStatus {
  product_id: string;
  warehouse_id: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  last_stock_update: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  warehouse_id: string;
  movement_type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN' | 'ASSIGNMENT' | 'REPAIR';
  quantity: number;
  reference_type: string;
  reference_id: string;
  notes: string;
  performed_by: string;
  created_at: string;
}
