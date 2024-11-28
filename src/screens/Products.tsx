import { useEffect } from "react";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { ProductForm } from "../components/entities/ProductForm";

export function Products() {

    const { categories, getCategories } = useCategories();
    const { suppliers, getSuppliers } = useSuppliers();
    const {
        products,
        setProducts,
        getProducts,
        columns,
        showForm,
        setShowForm,
        productFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows
    } = useProducts();
    const { formData, setFormData } = productFormData;

    useEffect(() => {
        getCategories();
        getSuppliers();
    }, []);

    useEffect(() => {
        const { page, offset } = filter;
        getProducts(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'VIEW' || showForm === 'EDIT' ?
                <>
                    <h2>
                        {showForm === 'NEW' ? 'Nuevo producto' :
                            showForm === 'VIEW' ? formData.sku :
                                `Editar producto #${formData.id}`}
                    </h2>
                    <ProductForm
                        productFormData={productFormData}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                        categories={categories}
                        suppliers={suppliers}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Productos</h2>
                        <button className="btn btn-primary" onClick={() => setShowForm('NEW')}>
                            Nuevo
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={products}
                        setRows={setProducts}
                        filter={filter}
                        setFilter={setFilter}
                        totalRows={totalRows}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        actions
                        showViewAction
                        showEditAction
                        showDeleteAction
                    />
                </>
            }
        </Layout>
    )
}