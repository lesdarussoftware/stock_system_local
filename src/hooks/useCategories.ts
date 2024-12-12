/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { categoryHasNotChildren, nameDoesNotExist } from "../middlewares/category";
import { Category, db } from "../utils/db";
import { ShowFormType } from "../utils/types";

export function useCategories() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const categoryFormData = useForm({
        defaultData: { id: '', name: '', description: '' },
        rules: { name: { required: true, maxLength: 55 }, description: { maxLength: 55 } }
    })

    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getCategories(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.categories.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.categories.count()
        ]);
        setTotalRows(count);
        setCategories(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = categoryFormData;
        if (validate()) {
            try {
                const isValid = await nameDoesNotExist(formData.name);
                if (isValid) {
                    if (showForm === 'NEW') {
                        await db.categories.add({
                            ...formData,
                            id: undefined,
                            created_at: new Date(Date.now()),
                            updated_at: new Date(Date.now())
                        });
                        setBodyMessage('Categoría guardada correctamente.');
                        getCategories();
                    } else if (showForm === 'EDIT') {
                        await db.categories.update(formData.id, { ...formData, updated_at: new Date(Date.now()) });
                        setBodyMessage('Categoría editada correctamente.');
                        getCategories(filter.page, filter.offset);
                    }
                    setSeverity('SUCCESS');
                    setShowForm(null);
                    reset();
                } else {
                    setSeverity('ERROR');
                    setBodyMessage('Esa categoría ya existe.');
                }
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar la categoría.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deleteCategory() {
        try {
            const isValid = await categoryHasNotChildren(categoryFormData.formData.id);
            if (isValid) {
                await db.categories.delete(+categoryFormData.formData.id);
                setBodyMessage('Categoría eliminada correctamente.');
                setSeverity('SUCCESS');
                getCategories(filter.page, filter.offset);
            } else {
                setSeverity('ERROR');
                setBodyMessage('Esta categoría tiene artículos asociados.');
            }
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar la categoría.');
        }
        handleClose();
        setHeaderMessage(categoryFormData.formData.name);
        setOpenMessage(true);
    }

    function handleClose() {
        categoryFormData.reset();
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
            id: 'description',
            label: 'Descripción',
            accessor: 'description'
        }
    ], [])

    return {
        categories,
        setCategories,
        getCategories,
        columns,
        categoryFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteCategory,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}