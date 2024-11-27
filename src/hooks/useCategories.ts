/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { Category, db } from "../utils/db";

export function useCategories() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const categoryFormData = useForm({
        defaultData: { id: '', name: '', description: '' },
        rules: { name: { required: true, maxLength: 55 }, description: { maxLength: 55 } }
    })

    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState<'NEW' | 'EDIT' | null>(null);

    async function getCategories() {
        const data = await db.categories.toArray();
        setCategories(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = categoryFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.categories.add({ ...formData, id: undefined });
                    setBodyMessage('Categoría guardada correctamente.');
                } else if (showForm === 'EDIT') {
                    await db.categories.update(formData.id, formData);
                    setBodyMessage('Categoría editada correctamente.');
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
                getCategories();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la categoría.');
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
            id: 'description',
            label: 'Descripción',
            accessor: 'description'
        }
    ], [])

    return {
        categories,
        getCategories,
        columns,
        categoryFormData,
        showForm,
        setShowForm,
        handleSubmit
    }
}