/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, BuyPayment } from "../utils/db";
import { ShowFormType } from "../utils/types";

export function useBuyPayments() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const buyPaymentFormData = useForm({
        defaultData: {
            id: '',
            buy_order_id: '',
            method: 'EFECTIVO',
            amount: '',
            date: new Date(Date.now()),
            observations: ''
        },
        rules: { amount: { required: true }, observations: { maxLength: 55 } }
    });

    const [buyPayments, setBuyPayments] = useState<BuyPayment[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getBuyPayments(buy_order_id: number, page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.buy_payments
                .where('buy_order_id')
                .equals(+buy_order_id)
                .reverse()
                .offset(start)
                .limit(offset)
                .toArray(),
            db.buy_payments.where('buy_order_id').equals(+buy_order_id).count()
        ]);
        setTotalRows(count);
        setBuyPayments(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = buyPaymentFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.buy_payments.add({
                        ...formData,
                        id: undefined,
                        created_at: new Date(Date.now()),
                        updated_at: new Date(Date.now())
                    });
                    setBodyMessage('Pago guardado correctamente.');
                } else if (showForm === 'EDIT') {
                    await db.buy_payments.update(formData.id, { ...formData, updated_at: new Date(Date.now()) });
                    setBodyMessage('Pago editado correctamente.');
                }
                getBuyPayments(formData.buy_order_id, filter.page, filter.offset);
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

    async function deleteBuyPayment() {
        try {
            const { formData } = buyPaymentFormData;
            await db.buy_payments.delete(+formData.id);
            setBodyMessage('Pago eliminado correctamente.');
            setSeverity('SUCCESS');
            getBuyPayments(+formData.buy_order_id, filter.page, filter.offset);
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar el pago.');
        }
        handleClose();
        setHeaderMessage('Éxito');
        setOpenMessage(true);
    }

    function handleClose() {
        buyPaymentFormData.reset();
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
            accessor: (row: BuyPayment) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'amount',
            label: 'Monto',
            sortable: true,
            accessor: (row: BuyPayment) => `$${row.amount}`
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
        buyPayments,
        setBuyPayments,
        getBuyPayments,
        columns,
        buyPaymentFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteBuyPayment,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}