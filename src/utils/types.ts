export type ShowFormType = 'NEW' | 'VIEW' | 'EDIT' | 'DELETE' | 'ADJUST' | null;
export type Item = {
    product_id: number;
    product_sale_price: number | undefined;
    product_buy_price: number;
    product_earn: number;
    amount: number;
}