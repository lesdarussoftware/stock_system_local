/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

import { useForm } from "./useForm";

import { db, Product } from "../utils/db";

export function useProducts() {

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
        const data = await db.products.toArray();
        setProducts(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = productFormData;
        if (validate()) {
            if (showForm === 'NEW') {
                await db.products.add({ ...formData, id: undefined });
            } else if (showForm === 'EDIT') {
                await db.products.update(formData.id, formData);
            }
            setShowForm(null);
            reset();
            getProducts();
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