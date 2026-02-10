import { Category, Product, Supplier } from '@/types/database';

// Initial Mock Data (Copied/Adapted from src/data/mockData.ts but structured for "DB" use)
const initialCategories: Category[] = [
    { id: '1', name: 'Electronics', description: 'Electronic devices and components', parent_id: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), product_count: 45, total_value: 125000 },
    { id: '2', name: 'Office Supplies', description: 'Office and stationery items', parent_id: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), product_count: 120, total_value: 15000 },
    { id: '3', name: 'Furniture', description: 'Office and home furniture', parent_id: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), product_count: 30, total_value: 85000 },
];

const initialProducts: Product[] = [
    { id: '1', sku: 'ELEC-001', name: 'MacBook Pro 14"', description: 'Apple MacBook Pro with M3 chip', category_id: '1', supplier_id: '1', quantity: 25, reorder_level: 10, price: 1999, cost: 1600, location: 'Warehouse A', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', sku: 'OFF-001', name: 'Premium Notebook Set', description: 'Set of 5 premium notebooks', category_id: '2', supplier_id: '2', quantity: 200, reorder_level: 100, price: 29, cost: 12, location: 'Warehouse C', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const initialSuppliers: Supplier[] = [
    { id: '1', name: 'TechCorp Industries', contact_person: 'John Smith', email: 'john@techcorp.com', phone: '+1 555-0101', address: '123 Tech Blvd', rating: 4.8, lead_time: 5, product_count: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', name: 'Global Supplies Co', contact_person: 'Sarah Johnson', email: 'sarah@globalsupplies.com', phone: '+1 555-0102', address: '456 Commerce St', rating: 4.5, lead_time: 3, product_count: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockService = {
    get: <T>(table: string): T[] => {
        const stored = localStorage.getItem(`mock_${table}`);
        if (stored) return JSON.parse(stored);

        // Initialize if empty
        let initial: any[] = [];
        if (table === 'categories') initial = initialCategories;
        if (table === 'products') initial = initialProducts;
        if (table === 'suppliers') initial = initialSuppliers;

        localStorage.setItem(`mock_${table}`, JSON.stringify(initial));
        return initial;
    },

    getById: <T>(table: string, id: string): T | null => {
        const items = mockService.get<T & { id: string }>(table);
        return items.find(i => i.id === id) || null;
    },

    insert: <T>(table: string, item: Omit<T, 'id' | 'created_at' | 'updated_at'>): T => {
        const items = mockService.get<T & { id: string }>(table);
        const newItem = {
            ...item,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as unknown as T;

        items.push(newItem);
        localStorage.setItem(`mock_${table}`, JSON.stringify(items));
        return newItem;
    },

    update: <T>(table: string, id: string, updates: Partial<T>): T => {
        const items = mockService.get<T & { id: string }>(table);
        const index = items.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Item not found');

        const updatedItem = { ...items[index], ...updates, updated_at: new Date().toISOString() };
        items[index] = updatedItem;
        localStorage.setItem(`mock_${table}`, JSON.stringify(items));
        return updatedItem;
    },

    delete: (table: string, id: string): void => {
        const items = mockService.get<{ id: string }>(table);
        const filtered = items.filter(i => i.id !== id);
        localStorage.setItem(`mock_${table}`, JSON.stringify(filtered));
    }
};
