/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { AuthContext } from "../contexts/AuthContext";
import { useForm } from "./useForm";

import { db, SaleOrder } from "../utils/db";
import { Item, ShowFormType } from "../utils/types";
import { theresStock } from "../middlewares/product";
import { useProducts } from "./useProducts";
import { getSaleProductsTotal } from "../utils/helpers";

export function useSales() {

    const { auth } = useContext(AuthContext);
    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const saleFormData = useForm({
        defaultData: {
            id: '',
            client_id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            payments_amount: 1,
            user: ''
        },
        rules: {
            client_id: { required: true }
        }
    })
    const { products, getProducts } = useProducts();

    const [sales, setSales] = useState<SaleOrder[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

    async function getSales(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count, clients, saleProducts] = await Promise.all([
            db.sale_orders.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.sale_orders.count(),
            db.clients.toArray(),
            db.sale_products.toArray()
        ]);
        setTotalRows(count);
        setSales(data.map(s => {
            const sale_products = saleProducts.filter(sp => +sp.sale_order_id === +s.id);
            return {
                ...s,
                client: clients.find(c => c.id === +s.client_id)!.name,
                total: `$${getSaleProductsTotal(sale_products)}`,
                sale_products
            }
        }));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        await getProducts();
        const { formData, validate, reset } = saleFormData;
        if (validate()) {
            try {
                if (theresStock(products, items)) {
                    if (showForm === 'NEW') {
                        const saleId = await db.sale_orders.add({ ...formData, id: undefined, user: auth?.username });
                        await db.sale_products.bulkAdd(items.map((i: Item) => ({
                            sale_order_id: saleId,
                            product_id: i.product_id,
                            amount: i.amount,
                            product_buy_price: i.product_buy_price,
                            product_earn: i.product_earn,
                            product_sale_price: i.product_sale_price
                        })));
                        setBodyMessage('Venta guardada correctamente.');
                        getSales();
                    } else if (showForm === 'EDIT') {
                        await Promise.all([
                            db.sale_orders.update(formData.id, formData),
                            db.sale_products.bulkDelete(idsToDelete),
                            db.sale_products.bulkUpdate(items.filter(i => i.id).map(i => ({ key: i.id, changes: i }))),
                            db.sale_products.bulkAdd(items.filter(i => !i.id))
                        ]);
                        setBodyMessage('Venta editada correctamente.');
                        getSales(filter.page, filter.offset);
                    }
                    setHeaderMessage('Éxito');
                    setSeverity('SUCCESS');
                    setShowForm(null);
                    setItems([]);
                    setIdsToDelete([]);
                    reset();
                } else {
                    setHeaderMessage('Error');
                    setSeverity('ERROR');
                    setBodyMessage('Hay productos sin stock disponible.');
                }
            } catch (e) {
                setHeaderMessage('Error');
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la venta.');
            }
            setOpenMessage(true);
        }
    }

    async function deleteSale() {
        try {
            await Promise.all([
                db.sale_orders.delete(+saleFormData.formData.id),
                db.sale_products.bulkDelete(items.map(i => i.id))
            ]);
            setBodyMessage('Venta eliminada correctamente.');
            setSeverity('SUCCESS');
            getSales(filter.page, filter.offset);
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar la venta.');
        }
        handleClose();
        setHeaderMessage('Éxito');
        setOpenMessage(true);
    }

    function handleClose() {
        saleFormData.reset();
        setShowForm(null);
        setItems([]);
        setIdsToDelete([]);
    }

    const columns = useMemo(() => [
        {
            id: 'id',
            label: '#',
            sortable: true,
            accessor: 'id'
        },
        {
            id: 'client',
            label: 'Cliente',
            sortable: true,
            accessor: 'client'
        },
        {
            id: 'date',
            label: 'Fecha',
            accessor: 'date'
        },
        {
            id: 'status',
            label: 'Estado',
            accessor: 'status'
        },
        {
            id: 'user',
            label: 'Creada por',
            accessor: 'user'
        },
        {
            id: 'total',
            label: 'Total',
            accessor: 'total'
        }
    ], [])

    return {
        sales,
        setSales,
        getSales,
        columns,
        saleFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteSale,
        filter,
        setFilter,
        totalRows,
        handleClose,
        items,
        setItems,
        idsToDelete,
        setIdsToDelete
    }
}