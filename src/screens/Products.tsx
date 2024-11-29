import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSuppliers } from "../hooks/useSuppliers";
import { useStores } from "../hooks/useStores";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { ProductForm } from "../components/entities/ProductForm";
import { MovementsList } from "../components/movements/MovementsList";

export function Products() {

    const { categories, getCategories } = useCategories();
    const { suppliers, getSuppliers } = useSuppliers();
    const { stores, getStores } = useStores();
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
        totalRows,
        handleClose,
        deleteProduct
    } = useProducts();
    const { formData, setFormData } = productFormData;

    useEffect(() => {
        getCategories();
        getSuppliers();
        getStores();
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
                                `Editar producto #${formData.sku}`}
                    </h2>
                    <ProductForm
                        productFormData={productFormData}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                        categories={categories}
                        suppliers={suppliers}
                        stores={stores}
                    />
                </> :
                showForm === 'ADJUST' ?
                    <MovementsList
                        product={formData}
                        setProductShowForm={setShowForm}
                    /> :
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
                            showAdjustAction
                        />
                        <Modal show={showForm === 'DELETE'} onHide={handleClose} backdrop="static" keyboard={false}        >
                            <Modal.Header closeButton>
                                <Modal.Title>{`Borrar producto ${formData.sku}`}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Los datos no podrán ser recuperados.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={deleteProduct}>Confirmar</Button>
                            </Modal.Footer>
                        </Modal>
                    </>
            }
        </Layout>
    )
}