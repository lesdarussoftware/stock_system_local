/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, BuyOrder } from "../utils/db";

export function usePurchases() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const purchaseFormData = useForm({
        defaultData: {
            id: '',
            supplier_id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            user_id: ''
        },
        rules: {}
    })

    const [purchases, setPurchases] = useState<BuyOrder[]>([]);
    const [showForm, setShowForm] = useState<'NEW' | 'VIEW' | 'EDIT' | 'DELETE' | 'ADJUST' | null>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getPurchases(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.buy_orders.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.buy_orders.count()
        ]);
        setTotalRows(count);
        setPurchases(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = purchaseFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.buy_orders.add({ ...formData, id: undefined });
                    setBodyMessage('Compra guardada correctamente.');
                    getPurchases();
                } else if (showForm === 'EDIT') {
                    await db.buy_orders.update(formData.id, formData);
                    setBodyMessage('Compra editada correctamente.');
                    getPurchases(filter.page, filter.offset);
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la compra.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deletePurchase() {
        try {
            await db.buy_orders.delete(+purchaseFormData.formData.id);
            setBodyMessage('Compra eliminada correctamente.');
            setSeverity('SUCCESS');
            getPurchases(filter.page, filter.offset);
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar la compra.');
        }
        handleClose();
        setHeaderMessage(purchaseFormData.formData.name);
        setOpenMessage(true);
    }

    function handleClose() {
        purchaseFormData.reset();
        setShowForm(null);
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
        handleClose
    }
}