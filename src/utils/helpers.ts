/* eslint-disable @typescript-eslint/no-explicit-any */
import { BuyProduct, db, Movement, Product, SaleProduct } from "./db";
import { Item } from "./types";

export function getProductSalePrice(product: Product): number {
    if (product.sale_price && +product.sale_price > 0) return +product.sale_price;
    return parseFloat((+product.buy_price + ((+product.buy_price / 100) * +product.earn)).toFixed(2));
}

export function getItemSalePrice(item: Item): number {
    const { product_sale_price, product_buy_price, product_earn } = item;
    if (product_sale_price && +product_sale_price > 0) return +product_sale_price;
    return parseFloat((+product_buy_price + ((+product_buy_price / 100) * +product_earn)).toFixed(2));
}

export function getStock(saleProducts: SaleProduct[], buyProducts: BuyProduct[], movements: Movement[]): number {
    const salesAmount = saleProducts.reduce((acc, p) => acc + +p.amount, 0);
    const purchasesAmount = buyProducts.reduce((acc, p) => acc + +p.amount, 0);
    const movementsAmount = movements.reduce((acc, m) => {
        if (m.type === 'INGRESO') return acc + +m.amount;
        if (m.type === 'EGRESO') return acc - +m.amount;
        return acc;
    }, 0);
    return parseFloat((purchasesAmount + movementsAmount - salesAmount).toFixed(2))
}

export function getSaleTotal(items: Item[]): number {
    return parseFloat(items.reduce((acc, i) => acc + getItemSalePrice(i) * i.amount, 0).toFixed(2));
}

export function getPurchaseTotal(items: Item[]): number {
    return parseFloat(items.reduce((acc, i) => acc + i.product_buy_price * i.amount, 0).toFixed(2));
}

export function getSaleProductsTotal(saleProducts: SaleProduct[]): number {
    return parseFloat(saleProducts.reduce((acc, sp) => {
        let price: number;
        const { product_sale_price, product_buy_price, product_earn } = sp;
        if (product_sale_price && +product_sale_price > 0) {
            price = +product_sale_price;
        } else {
            price = parseFloat((+product_buy_price + ((+product_buy_price / 100) * +product_earn)).toFixed(2));
        }
        return acc + (price * sp.amount)
    }, 0).toFixed(2));
}

export function getBuyProductsTotal(buyProducts: BuyProduct[]): number {
    return parseFloat(buyProducts.reduce((acc, bp) => acc + (bp.product_buy_price * bp.amount), 0).toFixed(2));
}

export async function exportDatabaseToJSONFile(): Promise<{
    severity: 'SUCCESS' | 'ERROR';
    headerMessage: string;
    bodyMessage: string;
}> {
    try {
        const exportData: Record<string, any[]> = {};
        for (const table of db.tables) {
            if (table.name === 'tdssdifui') {
                continue; // Ignora esta tabla
            }
            const data = await table.toArray();
            exportData[table.name] = data;
        }
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'database_export.json';
        link.click();
        URL.revokeObjectURL(url);
        return {
            severity: 'SUCCESS',
            headerMessage: 'Datos guardados',
            bodyMessage: 'Descargue el archivo en su equipo.'
        }
    } catch (e) {
        return {
            severity: 'ERROR',
            headerMessage: 'Error al exportar la base de datos',
            bodyMessage: 'Hubo un error al intentar exportar la base de datos.'
        }
    }
}