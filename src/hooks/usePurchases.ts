/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { AuthContext } from "../contexts/AuthContext";
import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, BuyOrder } from "../utils/db";
import { Item, ShowFormType } from "../utils/types";
import { getBuyProductsTotal } from "../utils/helpers";

export function usePurchases() {

    const { auth } = useContext(AuthContext);
    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const purchaseFormData = useForm({
        defaultData: {
            id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            payments_amount: 1,
            user: ''
        },
        rules: {}
    })

    const [purchases, setPurchases] = useState<BuyOrder[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{
        page: number;
        offset: number;
        from: number | string | string[] | undefined;
        to: number | string | string[] | undefined;
    }>({
        page: 1,
        offset: 50,
        from: '',
        to: ''
    });
    const [totalRows, setTotalRows] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

    async function getPurchases(
        page: number = 1,
        offset: number = 50,
        from?: string,
        to?: string
    ) {
        const start = (page - 1) * offset;
        const collection = db.buy_orders.orderBy("id").reverse();
        const filteredCollection = collection.filter(bo => {
            const purchaseDate = new Date(bo.date);
            const fromDate = from ? new Date(from) : null;
            const toDate = to ? new Date(to) : null;
            return (!fromDate || purchaseDate >= fromDate) && (!toDate || purchaseDate <= toDate);
        });
        const [data, count, buyProducts] = await Promise.all([
            filteredCollection.offset(start).limit(offset).toArray(),
            db.buy_orders.count(),
            db.buy_products.toArray()
        ]);
        setTotalRows(count);
        setPurchases(data.map(p => {
            const buy_products = buyProducts.filter(bp => +bp.buy_order_id === +p.id);
            return {
                ...p,
                total: `$${getBuyProductsTotal(buyProducts)}`,
                buy_products
            }
        }));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = purchaseFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    const purchaseId = await db.buy_orders.add({
                        ...formData,
                        id: undefined, user: auth?.username,
                        created_at: new Date(Date.now()),
                        updated_at: new Date(Date.now())
                    });
                    await db.buy_products.bulkAdd(items.map((i: Item) => ({
                        buy_order_id: purchaseId,
                        product_id: i.product_id,
                        amount: i.amount,
                        product_buy_price: i.product_buy_price,
                        created_at: new Date(Date.now()),
                        updated_at: new Date(Date.now())
                    })));
                    setBodyMessage('Compra guardada correctamente.');
                    getPurchases();
                } else if (showForm === 'EDIT') {
                    await Promise.all([
                        db.buy_orders.update(formData.id, { ...formData, updated_at: new Date(Date.now()) }),
                        db.buy_products.bulkDelete(idsToDelete),
                        db.buy_products.bulkUpdate(items.filter(i => i.id).map(i => ({
                            key: i.id,
                            changes: { ...i, updated_at: new Date(Date.now()) }
                        }))),
                        db.buy_products.bulkAdd(items.filter(i => !i.id).map(i => ({
                            ...i,
                            created_at: new Date(Date.now()),
                            updated_at: new Date(Date.now())
                        })))
                    ]);
                    setBodyMessage('Compra editada correctamente.');
                    getPurchases(filter.page, filter.offset);
                }
                setHeaderMessage('Éxito');
                setSeverity('SUCCESS');
                setShowForm(null);
                setItems([]);
                setIdsToDelete([]);
                reset();
            } catch (e) {
                setHeaderMessage('Error');
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la compra.');
            }
            setOpenMessage(true);
        }
    }

    async function deletePurchase() {
        try {
            await Promise.all([
                db.buy_orders.delete(+purchaseFormData.formData.id),
                db.buy_products.bulkDelete(items.map(i => i.id)),
                db.buy_payments.where('buy_order_id').equals(+purchaseFormData.formData.id).delete()
            ]);
            setHeaderMessage('Éxito');
            setBodyMessage('Compra eliminada correctamente.');
            setSeverity('SUCCESS');
            getPurchases(filter.page, filter.offset);
        } catch (e) {
            setHeaderMessage('Error');
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar la compra.');
        }
        handleClose();
        setOpenMessage(true);
    }

    function handleClose() {
        purchaseFormData.reset();
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
        purchases,
        setPurchases,
        getPurchases,
        columns,
        purchaseFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deletePurchase,
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