import { db } from "../utils/db";

export async function nameDoesNotExist(name: string): Promise<boolean> {
    const categories = await db.categories.toArray();
    return !categories.some(c => c.name.toLowerCase() === name.toLowerCase());
}

export async function categoryHasNotChildren(id: number): Promise<boolean> {
    const products = await db.products.where('category_id').equals(id.toString()).count();
    return products <= 0;
}