import Dexie, { type EntityTable } from 'dexie';

interface User {
    id: number;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

interface Category {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

interface Supplier {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    created_at: Date;
    updated_at: Date;
}

interface Store {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    created_at: Date;
    updated_at: Date;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    bar_code?: string;
    description?: string;
    buy_price: number;
    earn: number;
    sale_price?: number;
    min_stock?: number;
    is_active: boolean;
    category_id: number;
    supplier_id: number;
    store_id?: number;
    created_at: Date;
    updated_at: Date;
}

interface Movement {
    id: number;
    product_id: number;
    amount: number;
    date: Date;
    type: 'INGRESO' | 'EGRESO';
    observations?: string;
    user: string;
    created_at: Date;
    updated_at: Date;
}

interface Client {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    created_at: Date;
    updated_at: Date;
}

interface BuyOrder {
    id: number;
    supplier_id: number;
    date: Date;
    status: 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA';
    user: number;
    created_at: Date;
    updated_at: Date;
}

interface BuyProduct {
    id: number;
    buy_order_id: number;
    product_id: number;
    amount: number;
    product_buy_price: number;
    created_at: Date;
    updated_at: Date;
}

interface SaleOrder {
    id: number;
    client_id: number;
    date: Date;
    status: 'PENDIENTE' | 'FINALIZADA' | 'CANCELADA';
    user: number;
    created_at: Date;
    updated_at: Date;
}

interface SaleProduct {
    id: number;
    sale_order_id: number;
    product_id: number;
    amount: number;
    product_buy_price: number;
    product_earn: number;
    product_sale_price?: number;
    created_at: Date;
    updated_at: Date;
}

const db = new Dexie('StockDatabase') as Dexie & {
    users: EntityTable<User, 'id'>;
    categories: EntityTable<Category, 'id'>;
    suppliers: EntityTable<Supplier, 'id'>;
    stores: EntityTable<Store, 'id'>;
    products: EntityTable<Product, 'id'>;
    movements: EntityTable<Movement, 'id'>;
    clients: EntityTable<Client, 'id'>;
    buy_orders: EntityTable<BuyOrder, 'id'>;
    buy_products: EntityTable<BuyProduct, 'id'>;
    sale_orders: EntityTable<SaleOrder, 'id'>;
    sale_products: EntityTable<SaleProduct, 'id'>;
};

db.version(1).stores({
    users: '++id, username, password, created_at, updated_at',
    categories: '++id, name, description, created_at, updated_at',
    suppliers: '++id, name, phone, email, address, city, created_at, updated_at',
    stores: '++id, name, phone, email, address, city, created_at, updated_at',
    products: '++id, name, sku, bar_code, buy_price, earn, sale_price, min_stock, is_active, category_id, supplier_id, store_id, created_at, updated_at',
    movements: '++id, product_id, amount, date, type, user, created_at, updated_at',
    clients: '++id, name, phone, email, address, city, created_at, updated_at',
    buy_orders: '++id, supplier_id, date, status, user, created_at, updated_at',
    buy_products: '++id, buy_order_id, product_id, amount, product_buy_price, created_at, updated_at',
    sale_orders: '++id, client_id, date, status, user, created_at, updated_at',
    sale_products: '++id, sale_order_id, product_id, amount, product_buy_price, product_earn, product_sale_price, created_at, updated_at'
});

export type { User, Category, Supplier, Store, Product, Movement, Client, BuyOrder, BuyProduct, SaleOrder, SaleProduct };
export { db };
