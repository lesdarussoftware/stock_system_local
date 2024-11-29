/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, SaleOrder } from "../utils/db";
import { ShowFormType } from "../utils/types";

export function useSales() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const saleFormData = useForm({
        defaultData: {
            id: '',
            client_id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            user_id: ''
        },
        rules: {}
    })

    const [sales, setSales] = useState<SaleOrder[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getSales(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.sale_orders.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.sale_orders.count()
        ]);
        setTotalRows(count);
        setSales(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = saleFormData;
        if (validate()) {
            try {
                // controlar stock
                if (showForm === 'NEW') {
                    await db.sale_orders.add({ ...formData, id: undefined });
                    setBodyMessage('Venta guardada correctamente.');
                    getSales();
                } else if (showForm === 'EDIT') {
                    await db.sale_orders.update(formData.id, formData);
                    setBodyMessage('Venta editada correctamente.');
                    getSales(filter.page, filter.offset);
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la venta.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deleteSale() {
        try {
            await db.sale_orders.delete(+saleFormData.formData.id);
            setBodyMessage('Venta eliminada correctamente.');
            setSeverity('SUCCESS');
            getSales(filter.page, filter.offset);
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar la venta.');
        }
        handleClose();
        setHeaderMessage(saleFormData.formData.name);
        setOpenMessage(true);
    }

    function handleClose() {
        saleFormData.reset();
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
        handleClose
    }
}