/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";

import { productHasNotSalesOrPurchases, skuDoesNotExist } from "../middlewares/product";
import { db, Product } from "../utils/db";
import { ShowFormType } from "../utils/types";
import { getProductSalePrice, getStock } from "../utils/helpers";

export function useProducts() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const productFormData = useForm({
        defaultData: {
            id: '',
            name: '',
            sku: '',
            bar_code: '',
            description: '',
            buy_price: 0.01,
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
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{
        page: number;
        offset: number;
        name?: string;
        sku?: string;
    }>({ page: 1, offset: 50, name: undefined, sku: undefined });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getProducts(page: number = 1, offset: number = 50, name?: string, sku?: string) {
        const collection = db.products.orderBy('id').reverse();
        if (name) collection.filter(p => p.name.toLowerCase().includes(name));
        if (sku) collection.filter(p => p.sku.toLowerCase().includes(sku));
        const start = (page - 1) * offset;
        const [data, count, categories, suppliers, saleProducts, buyProducts, movements] = await Promise.all([
            collection.offset(start).limit(offset).toArray(),
            db.products.count(),
            db.categories.toArray(),
            db.suppliers.toArray(),
            db.sale_products.toArray(),
            db.buy_products.toArray(),
            db.movements.toArray()
        ]);
        setTotalRows(count);
        setProducts(data.filter(p => p.is_active).map(p => ({
            ...p,
            category: categories.find(c => c.id === +p.category_id)?.name || 'Sin categoría',
            supplier: suppliers.find(s => s.id === +p.supplier_id)?.name || 'Sin proveedor',
            stock: getStock(
                saleProducts.filter(sp => +sp.product_id === +p.id),
                buyProducts.filter(sp => +sp.product_id === +p.id),
                movements.filter(sp => +sp.product_id === +p.id)
            )
        })));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = productFormData;
        if (validate()) {
            try {
                const isValid = await skuDoesNotExist(formData.sku);
                if (isValid) {
                    if (showForm === 'NEW') {
                        await db.products.add({
                            ...formData,
                            id: undefined,
                            created_at: new Date(Date.now()),
                            updated_at: new Date(Date.now())
                        });
                        setBodyMessage('Artículo guardado correctamente.');
                        getProducts(undefined, undefined, filter.name, filter.sku);
                    } else if (showForm === 'EDIT') {
                        await db.products.update(formData.id, { ...formData, updated_at: new Date(Date.now()) });
                        setBodyMessage('Artículo editado correctamente.');
                        getProducts(filter.page, filter.offset, filter.name, filter.sku);
                    }
                    setSeverity('SUCCESS');
                    setShowForm(null);
                    reset();
                } else {
                    setSeverity('ERROR');
                    setBodyMessage(`El sku ${formData.sku} ya existe.`);
                }
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el artículo.');
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true);
        }
    }

    async function deleteProduct() {
        try {
            const isValid = await productHasNotSalesOrPurchases(productFormData.formData.id);
            if (isValid) {
                await db.products.delete(+productFormData.formData.id);
                setBodyMessage('Artículo eliminado correctamente.');
                setSeverity('SUCCESS');
                getProducts(filter.page, filter.offset, filter.name, filter.sku);
            } else {
                setSeverity('ERROR');
                setBodyMessage('Este artículo tiene ventas o compras asociadas.');
            }
        } catch (e) {
            setSeverity('ERROR');
            setBodyMessage('Hubo un error al intentar eliminar el artículo.');
        }
        handleClose();
        setHeaderMessage(productFormData.formData.name);
        setOpenMessage(true);
    }

    function handleClose() {
        productFormData.reset();
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
            id: 'sku',
            label: 'SKU',
            sortable: true,
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
            accessor: (row: Product) => `$${getProductSalePrice(row)}`
        },
        {
            id: 'stock',
            label: 'Stock',
            accessor: 'stock'
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
        setProducts,
        getProducts,
        columns,
        productFormData,
        showForm,
        setShowForm,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteProduct
    }
}