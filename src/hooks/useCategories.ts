/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

import { useForm } from "./useForm";

import { Category, db } from "../utils/db";

export function useCategories() {

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
            if (showForm === 'NEW') {
                await db.categories.add({ ...formData, id: undefined });
            } else if (showForm === 'EDIT') {
                await db.categories.update(formData.id, formData);
            }
            setShowForm(null);
            reset();
            getCategories();
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