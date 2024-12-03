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
            supplier_id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            user: ''
        },
        rules: {
            supplier_id: { required: true }
        }
    })

    const [purchases, setPurchases] = useState<BuyOrder[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

    async function getPurchases(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count, suppliers, buyProducts] = await Promise.all([
            db.buy_orders.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.buy_orders.count(),
            db.suppliers.toArray(),
            db.buy_products.toArray()
        ]);
        setTotalRows(count);
        setPurchases(data.map(p => ({
            ...p,
            supplier: suppliers.find(s => s.id === +p.supplier_id)!.name,
            total: `$${getBuyProductsTotal(buyProducts.filter(bp => +bp.buy_order_id === +p.id))}`
        })));
    }

    async function getBuyProducts(buy_order_id: number) {
        const data = await db.buy_products.where('buy_order_id').equals(+buy_order_id).toArray();
        setItems(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = purchaseFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    const purchaseId = await db.buy_orders.add({ ...formData, id: undefined, user: auth?.username });
                    await db.buy_products.bulkAdd(items.map((i: Item) => ({
                        buy_order_id: purchaseId,
                        product_id: i.product_id,
                        amount: i.amount,
                        product_buy_price: i.product_buy_price
                    })));
                    setBodyMessage('Compra guardada correctamente.');
                    getPurchases();
                } else if (showForm === 'EDIT') {
                    await Promise.all([
                        db.buy_orders.update(formData.id, formData),
                        db.buy_products.bulkDelete(idsToDelete),
                        db.buy_products.bulkUpdate(items.filter(i => i.id).map(i => ({ key: i.id, changes: i }))),
                        db.buy_products.bulkAdd(items.filter(i => !i.id))
                    ]);
                    setBodyMessage('Compra editada correctamente.');
                    getPurchases(filter.page, filter.offset);
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                setItems([]);
                setIdsToDelete([]);
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la compra.');
            }
            setHeaderMessage('Éxito');
            setOpenMessage(true);
        }
    }

    async function deletePurchase() {
        try {
            await Promise.all([
                db.buy_orders.delete(+purchaseFormData.formData.id),
                db.buy_orders.bulkDelete(items.map(i => i.id))
            ]);
            setBodyMessage('Compra eliminada correctamente.');
            setSeverity('SUCCESS');
            getPurchases(filter.page, filter.offset);
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar la compra.');
        }
        handleClose();
        setHeaderMessage('Éxito');
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
            id: 'supplier',
            label: 'Proveedor',
            sortable: true,
            accessor: 'supplier'
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
        getBuyProducts,
        idsToDelete,
        setIdsToDelete
    }
}