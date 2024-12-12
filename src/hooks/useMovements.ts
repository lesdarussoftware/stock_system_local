/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from 'date-fns';

import { AuthContext } from "../contexts/AuthContext";
import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, Movement } from "../utils/db";
import { ShowFormType } from "../utils/types";

export function useMovements() {

    const { auth } = useContext(AuthContext);
    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const movementFormData = useForm({
        defaultData: {
            id: '',
            product_id: '',
            amount: 1,
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            type: 'INGRESO',
            observations: '',
            user: ''
        },
        rules: {
            observations: { maxLength: 125 }
        }
    })

    const [movements, setMovements] = useState<Movement[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getMovements(product_id: number, page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.movements
                .where('product_id')
                .equals(+product_id)
                .reverse()
                .offset(start)
                .limit(offset)
                .toArray(),
            db.movements.where('product_id').equals(+product_id).count()
        ]);
        setTotalRows(count);
        setMovements(data);
    }


    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = movementFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.movements.add({
                        ...formData,
                        id: undefined,
                        user: auth?.username,
                        created_at: new Date(Date.now()),
                        updated_at: new Date(Date.now())
                    });
                    setBodyMessage('Movimiento guardado correctamente.');
                } else if (showForm === 'EDIT') {
                    await db.movements.update(formData.id, { ...formData, updated_at: new Date(Date.now()) });
                    setBodyMessage('Movimiento editado correctamente.');
                    getMovements(formData.product_id, filter.page, filter.offset);
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el movimiento.');
            }
            setHeaderMessage(formData.type);
            setOpenMessage(true);
        }
    }

    async function deleteMovement() {
        try {
            await db.movements.delete(+movementFormData.formData.id);
            setBodyMessage('Movimiento eliminado correctamente.');
            setSeverity('SUCCESS');
            getMovements(movementFormData.formData.product_id, filter.page, filter.offset);
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar el movimiento.');
        }
        handleClose();
        setHeaderMessage(movementFormData.formData.type);
        setOpenMessage(true);
    }

    function handleClose() {
        movementFormData.reset();
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
            accessor: 'date'
        },
        {
            id: 'type',
            label: 'Tipo',
            accessor: 'type'
        },
        {
            id: 'amount',
            label: 'Cantidad',
            sortable: true,
            accessor: 'amount'
        },
        {
            id: 'observations',
            label: 'Observaciones',
            accessor: 'observations'
        },
        {
            id: 'user',
            label: 'Creado por',
            accessor: 'user'
        }
    ], []);

    return {
        movements,
        setMovements,
        getMovements,
        columns,
        movementFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteMovement,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}