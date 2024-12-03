import { BuyProduct, db, Movement, Product, SaleProduct } from "./db";
import { Item } from "./types";

export function getProductSalePrice(product: Product): number {
    if (product.sale_price && +product.sale_price > 0) return +product.sale_price;
    return parseFloat((product.buy_price + ((product.buy_price / 100) * product.earn)).toFixed(2));
}

export function getItemSalePrice(item: Item): number {
    const { product_sale_price, product_buy_price, product_earn } = item;
    if (product_sale_price && +product_sale_price > 0) return +product_sale_price;
    return parseFloat((product_buy_price + ((product_buy_price / 100) * product_earn)).toFixed(2));
}

export function getStock(saleProducts: SaleProduct[], buyProducts: BuyProduct[], movements: Movement[]): number {
    const salesAmount = saleProducts.reduce((acc, p) => acc + +p.amount, 0);
    const purchasesAmount = buyProducts.reduce((acc, p) => acc + +p.amount, 0);
    const movementsAmount = movements.reduce((acc, m) => {
        if (m.type === 'INGRESO') return acc + +m.amount;
        if (m.type === 'EGRESO') return acc - +m.amount;
        return acc;
    }, 0);
    return parseFloat((salesAmount + purchasesAmount + movementsAmount).toFixed(2))
}