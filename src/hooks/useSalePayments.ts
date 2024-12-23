/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, SalePayment } from "../utils/db";
import { ShowFormType } from "../utils/types";

export function useSalePayments() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const salePaymentFormData = useForm({
        defaultData: {
            id: '',
            sale_order_id: '',
            method: 'EFECTIVO',
            amount: '',
            date: new Date(Date.now()),
            observations: ''
        },
        rules: { amount: { required: true }, observations: { maxLength: 55 } }
    });

    const [salePayments, setSalePayments] = useState<SalePayment[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getSalePayments(sale_order_id: number, page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.sale_payments
                .where('sale_order_id')
                .equals(+sale_order_id)
                .reverse()
                .offset(start)
                .limit(offset)
                .toArray(),
            db.sale_payments.where('sale_order_id').equals(+sale_order_id).count()
        ]);
        setTotalRows(count);
        setSalePayments(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = salePaymentFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.sale_payments.add({
                        ...formData,
                        id: undefined,
                        created_at: new Date(Date.now()),
                        updated_at: new Date(Date.now())
                    });
                    setBodyMessage('Pago guardado correctamente.');
                } else if (showForm === 'EDIT') {
                    await db.sale_payments.update(formData.id, { ...formData, updated_at: new Date(Date.now()) });
                    setBodyMessage('Pago editado correctamente.');
                }
                getSalePayments(formData.sale_order_id, filter.page, filter.offset);
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el pago.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deleteSalePayment() {
        try {
            const { formData } = salePaymentFormData;
            await db.sale_payments.delete(+formData.id);
            setHeaderMessage('Éxito');
            setBodyMessage('Pago eliminado correctamente.');
            setSeverity('SUCCESS');
            getSalePayments(+formData.sale_order_id, filter.page, filter.offset);
        } catch (e) {
            setHeaderMessage('Error');
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar el pago.');
        }
        handleClose();
        setOpenMessage(true);
    }

    function handleClose() {
        salePaymentFormData.reset();
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
            id: 'date',
            label: 'Fecha',
            sortable: true,
            accessor: (row: SalePayment) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'amount',
            label: 'Monto',
            sortable: true,
            accessor: (row: SalePayment) => `$${row.amount}`
        },
        {
            id: 'method',
            label: 'Método de pago',
            sortable: true,
            accessor: 'method'
        },
        {
            id: 'observations',
            label: 'Observaciones',
            accessor: 'observations'
        }
    ], [])

    return {
        salePayments,
        setSalePayments,
        getSalePayments,
        columns,
        salePaymentFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteSalePayment,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}