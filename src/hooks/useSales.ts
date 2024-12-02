/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { AuthContext } from "../contexts/AuthContext";
import { useForm } from "./useForm";

import { db, SaleOrder } from "../utils/db";
import { Item, ShowFormType } from "../utils/types";

export function useSales() {

    const { auth } = useContext(AuthContext);
    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const saleFormData = useForm({
        defaultData: {
            id: '',
            client_id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            user: ''
        },
        rules: {
            client_id: { required: true }
        }
    })

    const [sales, setSales] = useState<SaleOrder[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

    async function getSales(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count, clients] = await Promise.all([
            db.sale_orders.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.sale_orders.count(),
            db.clients.toArray()
        ]);
        setTotalRows(count);
        setSales(data.map(s => ({ ...s, client: clients.find(c => c.id === +s.client_id)!.name })));
    }

    async function getSaleProducts(sale_order_id: number) {
        const data = await db.sale_products.where('sale_order_id').equals(+sale_order_id).toArray();
        setItems(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = saleFormData;
        if (validate()) {
            try {
                // controlar stock
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
                setSeverity('SUCCESS');
                setShowForm(null);
                setItems([]);
                setIdsToDelete([]);
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la venta.');
            }
            setHeaderMessage('Éxito');
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
        getSaleProducts,
        idsToDelete,
        setIdsToDelete
    }
}