export type AppRole = 'Owner' | 'Admin' | 'Manager' | 'WarehouseOperator' | 'Viewer';
export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'received'
  | 'delivered'
  | 'cancelled';
export type NotificationType =
  | 'low_stock'
  | 'order_created'
  | 'order_approved'
  | 'order_shipped'
  | 'order_received'
  | 'order_cancelled'
  | 'expired_stock'
  | 'system';
export type CustomerStatus = 'active' | 'inactive';

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

export interface Supplier {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  rating: number;
  lead_time: number;
  product_count: number;
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
  created_at: string;
  updated_at: string;
  // Backend fields (optional)
  barcode?: string;
  unit?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  // Joined data
  category?: Category;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: CustomerStatus;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_id: string | null;
  warehouse_id?: string | null;
  status: OrderStatus;
  total_amount: number;
  order_date: string;
  expected_date: string | null;
  received_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  unit_cost: number;
  received_quantity: number;
  created_at: string;
  // Joined data
  product?: Product;
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
  // Joined data
  profile?: Profile;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
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
  // Joined data
  product?: Product;
  warehouse?: Warehouse;
  profile?: Profile;
}
