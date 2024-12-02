import { Product } from "./db";
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