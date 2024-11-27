/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, Supplier } from "../utils/db";

export function useSuppliers() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const supplierFormData = useForm({
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

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [showForm, setShowForm] = useState<'NEW' | 'EDIT' | null>(null);

    async function getSuppliers() {
        const data = await db.suppliers.toArray();
        setSuppliers(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = supplierFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.suppliers.add({ ...formData, id: undefined });
                    setBodyMessage('Proveedor guardado correctamente.');
                } else if (showForm === 'EDIT') {
                    await db.suppliers.update(formData.id, formData);
                    setBodyMessage('Proveedor editado correctamente.');
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
                getSuppliers();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el proveedor.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    const columns = useMemo(() => [
        {
            id: 'id',
            label: '#',
            accessor: 'id'
        },
        {
            id: 'name',
            label: 'Nombre',
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
        suppliers,
        getSuppliers,
        columns,
        supplierFormData,
        showForm,
        setShowForm,
        handleSubmit
    }
}