/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { db, Product } from "../utils/db";

export function useProducts() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const productFormData = useForm({
        defaultData: {
            id: '',
            name: '',
            sku: '',
            bar_code: '',
            description: '',
            buy_price: 0,
            earn: 0,
            sale_price: 0,
            min_stock: 0,
            is_active: true,
            category_id: '',
            supplier_id: '',
            store_id: ''
        },
        rules: {
            name: { required: true, maxLength: 55 },
            sku: { required: true, maxLength: 55 },
            bar_code: { maxLength: 55 },
            description: { maxLength: 55 },
            category_id: { required: true },
            supplier_id: { required: true }
        }
    })

    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState<'NEW' | 'EDIT' | null>(null);

    async function getProducts() {
        const [data, categories, suppliers] = await Promise.all([
            db.products.toArray(),
            db.categories.toArray(),
            db.suppliers.toArray()
        ]);
        setProducts(data.map(p => ({
            ...p,
            category: categories.find(c => c.id === +p.category_id)!.name,
            supplier: suppliers.find(s => s.id === +p.supplier_id)!.name
        })));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = productFormData;
        if (validate()) {
            try {
                if (showForm === 'NEW') {
                    await db.products.add({ ...formData, id: undefined });
                    setBodyMessage('Producto guardado correctamente.');
                } else if (showForm === 'EDIT') {
                    await db.products.update(formData.id, formData);
                    setBodyMessage('Producto editado correctamente.');
                }
                setSeverity('SUCCESS');
                setShowForm(null);
                reset();
                getProducts();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el producto.');
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
            id: 'sku',
            label: 'SKU',
            accessor: 'sku'
        },
        {
            id: 'bar_code',
            label: 'Cód. barra',
            accessor: 'bar_code'
        },
        {
            id: 'sale_price',
            label: 'P. venta',
            accessor: () => 0
        },
        {
            id: 'stock',
            label: 'Stock',
            accessor: () => 0
        },
        {
            id: 'min_stock',
            label: 'Stock mín.',
            accessor: 'min_stock'
        },
        {
            id: 'category',
            label: 'Categoría',
            accessor: 'category'
        },
        {
            id: 'supplier',
            label: 'Proveedor',
            accessor: 'supplier'
        },
        {
            id: 'store',
            label: 'Depósito',
            accessor: 'store'
        },
        {
            id: 'is_active',
            label: 'Activo',
            accessor: (row: Product) => row.is_active ? 'Sí' : 'No'
        },
    ], [])

    return {
        products,
        getProducts,
        columns,
        productFormData,
        showForm,
        setShowForm,
        handleSubmit
    }
}