/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { nameDoesNotExist, storeHasNotProducts } from "../middlewares/store";
import { db, Store } from "../utils/db";
import { ShowFormType } from "../utils/types";

export function useStores() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const storeFormData = useForm({
        defaultData: {
            id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            city: ''
        },
        rules: {
            name: { required: true, maxLength: 55 },
            phone: { maxLength: 55 },
            email: { maxLength: 55 },
            address: { maxLength: 55 },
            city: { maxLength: 55 }
        }
    });

    const [stores, setStores] = useState<Store[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getStores(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.stores.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.stores.count()
        ]);
        setTotalRows(count);
        setStores(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = storeFormData;
        if (validate()) {
            try {
                const isValid = await nameDoesNotExist(formData.name);
                if (isValid) {
                    if (showForm === 'NEW') {
                        await db.stores.add({
                            ...formData,
                            id: undefined,
                            created_at: new Date(Date.now()),
                            updated_at: new Date(Date.now())
                        });
                        setBodyMessage('Depósito guardado correctamente.');
                        getStores();
                    } else if (showForm === 'EDIT') {
                        await db.stores.update(formData.id, { ...formData, updated_at: new Date(Date.now()) });
                        setBodyMessage('Depósito editado correctamente.');
                        getStores(filter.page, filter.offset);
                    }
                    setSeverity('SUCCESS');
                    setShowForm(null);
                    reset();
                } else {
                    setSeverity('ERROR');
                    setBodyMessage('Ese depósito ya existe.');
                }
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el depósito.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deleteStore() {
        try {
            const isValid = await storeHasNotProducts(storeFormData.formData.id);
            if (isValid) {
                await db.suppliers.delete(+storeFormData.formData.id);
                setBodyMessage('Depósito eliminado correctamente.');
                setSeverity('SUCCESS');
                getStores(filter.page, filter.offset);
            } else {
                setSeverity('ERROR');
                setBodyMessage('Este depósito tiene artículos asociados.');
            }
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar el depósito.');
        }
        handleClose();
        setHeaderMessage(storeFormData.formData.name);
        setOpenMessage(true);
    }

    function handleClose() {
        storeFormData.reset();
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
            id: 'name',
            label: 'Nombre',
            sortable: true,
            accessor: 'name'
        },
        {
            id: 'phone',
            label: 'Teléfono',
            accessor: 'phone'
        },
        {
            id: 'email',
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'address',
            label: 'Dirección',
            accessor: 'address'
        },
        {
            id: 'city',
            label: 'Ciudad',
            accessor: 'city'
        }
    ], [])

    return {
        stores,
        setStores,
        getStores,
        columns,
        storeFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteStore,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}