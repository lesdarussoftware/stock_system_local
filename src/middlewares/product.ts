/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../utils/db";
import { Item, ShowFormType } from "../utils/types";

export async function skuDoesNotExist(id: number, sku: string, showForm: ShowFormType): Promise<boolean> {
    const products = await db.products.toArray();
    return !products.some(p => {
        return (showForm === 'NEW' || (showForm === 'EDIT' && +p.id !== +id)) &&
            p.sku.toLowerCase() === sku.toLowerCase()
    });
}

export function theresStock(products: any[], items: Item[]): boolean {
    return items.every(i => {
        return products.find(p => +p.id === +i.product_id)?.stock > 0
    });
}

export async function productHasNotSalesOrPurchases(id: number): Promise<boolean> {
    const [sales, purchases] = await Promise.all([
        db.sale_products.where('product_id').equals(id).count(),
        db.buy_products.where('product_id').equals(id).count()
    ]);
    return sales <= 0 && purchases <= 0;
}