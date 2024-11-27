import Dexie, { type EntityTable } from 'dexie';

interface User {
    id: number;
    username: string;
    password: string;
    movements: Movement[];
    buy_orders: BuyOrder[];
    sale_orders: SaleOrder[];
    created_at: Date;
    updated_at: Date;
}

interface Category {
    id: number;
    name: string;
    description?: string;
    products: Product[];
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
    products: Product[];
    buy_orders: BuyOrder[];
    created_at: Date;
    updated_at: Date;
}

interface Store {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    lat?: string;
    lng?: string;
    products: Product[];
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
    movements: Movement[];
    buy_products: BuyProduct[];
    sale_products: SaleProduct[];
    created_at: Date;
    updated_at: Date;
}

interface Movement {
    id: number;
    product_id: number;
    amount: number;
    date: Date;
    type: 'INGRESO' | 'EGRESO' | 'AJUSTE';
    observations?: string;
    user_id: number;
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
    sale_orders: SaleOrder[];
    created_at: Date;
    updated_at: Date;
}

interface BuyOrder {
    id: number;
    supplier_id: number;
    date: Date;
    status: 'PENDIENTE' | 'RECIBIDO' | 'CANCELADO';
    user_id: number;
    products: BuyProduct[];
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
    status: 'PENDIENTE' | 'RECIBIDO' | 'CANCELADO';
    user_id: number;
    products: SaleProduct[];
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
    users: '++id, username, password, movements, buy_orders, sale_orders, created_at, updated_at',
    categories: '++id, name, description, products, created_at, updated_at',
    suppliers: '++id, name, phone, email, address, city, products, buy_orders, created_at, updated_at',
    stores: '++id, name, phone, email, address, lat, lng, products, created_at, updated_at',
    products: '++id, name, sku, bar_code, description, buy_price, earn, sale_price, min_stock, is_active, category_id, supplier_id, store_id, movements, buy_products, sale_products, created_at, updated_at',
    movements: '++id, product_id, amount, date, type, observations, user_id, created_at, updated_at',
    clients: '++id, name, phone, email, address, city, sale_orders, created_at, updated_at',
    buy_orders: '++id, supplier_id, date, status, user_id, products, created_at, updated_at',
    buy_products: '++id, buy_order_id, product_id, amount, product_buy_price, created_at, updated_at',
    sale_orders: '++id, client_id, date, status, user_id, products, created_at, updated_at',
    sale_products: '++id, sale_order_id, product_id, amount, product_buy_price, product_earn, product_sale_price, created_at, updated_at'
});

export type { User, Category, Supplier, Store, Product, Movement, Client, BuyOrder, BuyProduct, SaleOrder, SaleProduct };
export { db };