/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../utils/db";
import { Item } from "../utils/types";

export async function skuDoesNotExist(sku: string): Promise<boolean> {
    const products = await db.products.toArray();
    return !products.some(p => p.sku.toLowerCase() === sku.toLowerCase());
}

export function theresStock(products: any[], items: Item[]): boolean {
    return items.every(i => {
        return products.find(p => +p.id === +i.product_id)?.stock > 0
    });
}