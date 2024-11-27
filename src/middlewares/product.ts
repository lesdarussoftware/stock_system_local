import { db } from "../utils/db";

export async function skuDoesNotExist(sku: string): Promise<boolean> {
    const products = await db.products.toArray();
    return !products.some(p => p.sku.toLowerCase() === sku.toLowerCase());
}