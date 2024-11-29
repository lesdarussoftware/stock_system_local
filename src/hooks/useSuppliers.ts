/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { nameDoesNotExist, supplierHasNotProducts } from "../middlewares/supplier";
import { db, Supplier } from "../utils/db";
import { ShowFormType } from "../utils/types";

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
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getSuppliers(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.suppliers.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.suppliers.count()
        ]);
        setTotalRows(count);
        setSuppliers(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = supplierFormData;
        if (validate()) {
            try {
                const isValid = await nameDoesNotExist(formData.name);
                if (isValid) {
                    if (showForm === 'NEW') {
                        await db.suppliers.add({ ...formData, id: undefined });
                        setBodyMessage('Proveedor guardado correctamente.');
                        getSuppliers();
                    } else if (showForm === 'EDIT') {
                        await db.suppliers.update(formData.id, formData);
                        setBodyMessage('Proveedor editado correctamente.');
                        getSuppliers(filter.page, filter.offset);
                    }
                    setSeverity('SUCCESS');
                    setShowForm(null);
                    reset();
                } else {
                    setSeverity('ERROR');
                    setBodyMessage('Ese proveedor ya existe.');
                }
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el proveedor.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deleteSupplier() {
        try {
            const isValid = await supplierHasNotProducts(supplierFormData.formData.id);
            if (isValid) {
                await db.suppliers.delete(+supplierFormData.formData.id);
                setBodyMessage('Proveedor eliminado correctamente.');
                setSeverity('SUCCESS');
                getSuppliers(filter.page, filter.offset);
            } else {
                setSeverity('ERROR');
                setBodyMessage('Este proveedor tiene productos asociados.');
            }
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar el proveedor.');
        }
        handleClose();
        setHeaderMessage(supplierFormData.formData.name);
        setOpenMessage(true);
    }

    function handleClose() {
        supplierFormData.reset();
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
        suppliers,
        setSuppliers,
        getSuppliers,
        columns,
        supplierFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteSupplier,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}