import { db } from "../utils/db";

export async function clientHasNotSales(id: number): Promise<boolean> {
    const sales = await db.sale_orders.where('client_id').equals(id).count();
    return sales <= 0;
}