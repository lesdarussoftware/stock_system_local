/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { clientHasNotSales } from "../middlewares/client";
import { db, Client } from "../utils/db";
import { ShowFormType } from "../utils/types";

export function useClients() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const clientFormData = useForm({
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
    })

    const [clients, setClients] = useState<Client[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{
        page: number;
        offset: number;
        name?: string;
    }>({ page: 1, offset: 50, name: undefined });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getClients(page: number = 1, offset: number = 50, name?: string) {
        const collection = db.clients.orderBy('id').reverse();
        if (name) collection.filter(p => p.name.toLowerCase().includes(name));
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            collection.offset(start).limit(offset).toArray(),
            db.clients.count()
        ]);
        setTotalRows(count);
        setClients(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = clientFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.clients.add({
                        ...formData,
                        id: undefined,
                        created_at: new Date(Date.now()),
                        updated_at: new Date(Date.now())
                    });
                    setBodyMessage('Cliente guardado correctamente.');
                    getClients(undefined, undefined, filter.name);
                } else if (showForm === 'EDIT') {
                    await db.clients.update(formData.id, { ...formData, updated_at: new Date(Date.now()) });
                    setBodyMessage('Cliente editado correctamente.');
                    getClients(filter.page, filter.offset, filter.name);
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el cliente.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deleteClient() {
        try {
            const isValid = await clientHasNotSales(clientFormData.formData.id);
            if (isValid) {
                await db.clients.delete(+clientFormData.formData.id);
                setBodyMessage('Cliente eliminado correctamente.');
                setSeverity('SUCCESS');
                getClients(filter.page, filter.offset, filter.name);
            } else {
                setSeverity('ERROR');
                setBodyMessage('Este cliente tiene ventas asociadas.');
            }
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar el cliente.');
        }
        handleClose();
        setHeaderMessage(clientFormData.formData.name);
        setOpenMessage(true);
    }

    function handleClose() {
        clientFormData.reset();
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
        clients,
        setClients,
        getClients,
        columns,
        clientFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteClient,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}