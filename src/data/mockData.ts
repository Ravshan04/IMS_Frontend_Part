import { Product, Category, Supplier, DashboardStats, ChartData } from '@/types/inventory';

export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and components', parentId: null, productCount: 45, totalValue: 125000 },
  { id: '2', name: 'Office Supplies', description: 'Office and stationery items', parentId: null, productCount: 120, totalValue: 15000 },
  { id: '3', name: 'Furniture', description: 'Office and home furniture', parentId: null, productCount: 30, totalValue: 85000 },
  { id: '4', name: 'Computers', description: 'Laptops and desktops', parentId: '1', productCount: 25, totalValue: 75000 },
  { id: '5', name: 'Accessories', description: 'Electronic accessories', parentId: '1', productCount: 20, totalValue: 12000 },
  { id: '6', name: 'Chairs', description: 'Office and gaming chairs', parentId: '3', productCount: 15, totalValue: 25000 },
];

export const mockSuppliers: Supplier[] = [
  { id: '1', name: 'TechCorp Industries', contactPerson: 'John Smith', email: 'john@techcorp.com', phone: '+1 555-0101', address: '123 Tech Blvd, Silicon Valley, CA', rating: 4.8, leadTime: 5, productCount: 45 },
  { id: '2', name: 'Global Supplies Co', contactPerson: 'Sarah Johnson', email: 'sarah@globalsupplies.com', phone: '+1 555-0102', address: '456 Commerce St, New York, NY', rating: 4.5, leadTime: 7, productCount: 80 },
  { id: '3', name: 'Premium Furnishings', contactPerson: 'Mike Brown', email: 'mike@premiumfurn.com', phone: '+1 555-0103', address: '789 Furniture Ave, Chicago, IL', rating: 4.2, leadTime: 14, productCount: 30 },
  { id: '4', name: 'Office Essentials Ltd', contactPerson: 'Emily Davis', email: 'emily@officeess.com', phone: '+1 555-0104', address: '321 Office Park, Boston, MA', rating: 4.6, leadTime: 3, productCount: 60 },
  { id: '5', name: 'Apex Electronics', contactPerson: 'David Wilson', email: 'david@apexelec.com', phone: '+1 555-0105', address: '654 Circuit Way, Austin, TX', rating: 4.9, leadTime: 4, productCount: 35 },
];

export const mockProducts: Product[] = [
  { id: '1', sku: 'ELEC-001', name: 'MacBook Pro 14"', description: 'Apple MacBook Pro with M3 chip', categoryId: '4', supplierId: '1', quantity: 25, reorderLevel: 10, price: 1999, cost: 1600, location: 'Warehouse A', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15') },
  { id: '2', sku: 'ELEC-002', name: 'Dell XPS 15', description: 'Dell XPS 15 laptop with Intel i9', categoryId: '4', supplierId: '5', quantity: 18, reorderLevel: 8, price: 1799, cost: 1400, location: 'Warehouse A', createdAt: new Date('2024-01-16'), updatedAt: new Date('2024-01-16') },
  { id: '3', sku: 'ELEC-003', name: 'USB-C Hub', description: '7-in-1 USB-C Hub with HDMI', categoryId: '5', supplierId: '1', quantity: 150, reorderLevel: 50, price: 49, cost: 25, location: 'Warehouse B', createdAt: new Date('2024-01-17'), updatedAt: new Date('2024-01-17') },
  { id: '4', sku: 'OFF-001', name: 'Premium Notebook Set', description: 'Set of 5 premium notebooks', categoryId: '2', supplierId: '4', quantity: 200, reorderLevel: 100, price: 29, cost: 12, location: 'Warehouse C', createdAt: new Date('2024-01-18'), updatedAt: new Date('2024-01-18') },
  { id: '5', sku: 'OFF-002', name: 'Gel Pen Pack', description: 'Pack of 12 gel pens', categoryId: '2', supplierId: '4', quantity: 500, reorderLevel: 200, price: 15, cost: 6, location: 'Warehouse C', createdAt: new Date('2024-01-19'), updatedAt: new Date('2024-01-19') },
  { id: '6', sku: 'FURN-001', name: 'Ergonomic Office Chair', description: 'Premium ergonomic chair with lumbar support', categoryId: '6', supplierId: '3', quantity: 8, reorderLevel: 10, price: 599, cost: 350, location: 'Warehouse D', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-20') },
  { id: '7', sku: 'FURN-002', name: 'Standing Desk Pro', description: 'Electric standing desk 60"', categoryId: '3', supplierId: '3', quantity: 12, reorderLevel: 5, price: 799, cost: 480, location: 'Warehouse D', createdAt: new Date('2024-01-21'), updatedAt: new Date('2024-01-21') },
  { id: '8', sku: 'ELEC-004', name: 'Wireless Mouse', description: 'Logitech MX Master 3S', categoryId: '5', supplierId: '5', quantity: 75, reorderLevel: 30, price: 99, cost: 55, location: 'Warehouse B', createdAt: new Date('2024-01-22'), updatedAt: new Date('2024-01-22') },
  { id: '9', sku: 'ELEC-005', name: 'Mechanical Keyboard', description: 'RGB Mechanical Gaming Keyboard', categoryId: '5', supplierId: '5', quantity: 45, reorderLevel: 20, price: 149, cost: 80, location: 'Warehouse B', createdAt: new Date('2024-01-23'), updatedAt: new Date('2024-01-23') },
  { id: '10', sku: 'ELEC-006', name: '4K Monitor 27"', description: 'LG UltraFine 4K Display', categoryId: '1', supplierId: '1', quantity: 5, reorderLevel: 8, price: 699, cost: 480, location: 'Warehouse A', createdAt: new Date('2024-01-24'), updatedAt: new Date('2024-01-24') },
];

export const dashboardStats: DashboardStats = {
  totalProducts: 250,
  lowStockItems: 12,
  totalCategories: 6,
  totalSuppliers: 5,
  totalValue: 425000,
  monthlyGrowth: 12.5,
};

export const stockLevelData: ChartData[] = [
  { name: 'Electronics', value: 45, inStock: 35, lowStock: 10 },
  { name: 'Office', value: 120, inStock: 115, lowStock: 5 },
  { name: 'Furniture', value: 30, inStock: 25, lowStock: 5 },
  { name: 'Computers', value: 25, inStock: 20, lowStock: 5 },
  { name: 'Accessories', value: 20, inStock: 18, lowStock: 2 },
];

export const categoryDistribution: ChartData[] = [
  { name: 'Electronics', value: 35 },
  { name: 'Office Supplies', value: 25 },
  { name: 'Furniture', value: 15 },
  { name: 'Computers', value: 15 },
  { name: 'Accessories', value: 10 },
];

export const monthlySalesData: ChartData[] = [
  { name: 'Jan', sales: 45000, orders: 120 },
  { name: 'Feb', sales: 52000, orders: 145 },
  { name: 'Mar', sales: 48000, orders: 130 },
  { name: 'Apr', sales: 61000, orders: 165 },
  { name: 'May', sales: 55000, orders: 150 },
  { name: 'Jun', sales: 67000, orders: 180 },
  { name: 'Jul', sales: 72000, orders: 195 },
  { name: 'Aug', sales: 69000, orders: 185 },
  { name: 'Sep', sales: 78000, orders: 210 },
  { name: 'Oct', sales: 82000, orders: 225 },
  { name: 'Nov', sales: 91000, orders: 250 },
  { name: 'Dec', sales: 98000, orders: 275 },
];

export const supplierPerformance: ChartData[] = [
  { name: 'TechCorp', rating: 4.8, deliveries: 95, onTime: 92 },
  { name: 'Global Supplies', rating: 4.5, deliveries: 120, onTime: 108 },
  { name: 'Premium Furn', rating: 4.2, deliveries: 45, onTime: 38 },
  { name: 'Office Essentials', rating: 4.6, deliveries: 80, onTime: 75 },
  { name: 'Apex Electronics', rating: 4.9, deliveries: 65, onTime: 64 },
];
