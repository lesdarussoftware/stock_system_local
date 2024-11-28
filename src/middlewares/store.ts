import { db } from "../utils/db";

export async function nameDoesNotExist(name: string): Promise<boolean> {
    const stores = await db.stores.toArray();
    return !stores.some(s => s.name.toLowerCase() === name.toLowerCase());
}

export async function storeHasNotProducts(id: number): Promise<boolean> {
    const products = await db.products.where('store_id').equals(id.toString()).count();
    return products <= 0;
}