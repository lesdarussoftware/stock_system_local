import { db } from "../utils/db";

export async function nameDoesNotExist(name: string): Promise<boolean> {
    const suppliers = await db.suppliers.toArray();
    return !suppliers.some(s => s.name.toLowerCase() === name.toLowerCase());
}

export async function supplierHasNotProducts(id: number): Promise<boolean> {
    const products = await db.products.where('supplier_id').equals(id.toString()).count();
    return products <= 0;
}