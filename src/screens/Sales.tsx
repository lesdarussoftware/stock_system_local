import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useSales } from "../hooks/useSales";
import { useClients } from "../hooks/useClients";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { SaleForm } from "../components/entities/SaleForm";
import { AddIcon } from "../components/svg/AddIcon";
import { SalePaymentsList } from "../components/payments/SalePaymentsList";

export function Sales() {

    const {
        sales,
        setSales,
        getSales,
        columns,
        showForm,
        setShowForm,
        saleFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteSale,
        items,
        setItems,
        idsToDelete,
        setIdsToDelete
    } = useSales();
    const { formData, setFormData } = saleFormData;
    const { clients, getClients } = useClients();
    const { products, getProducts } = useProducts();

    useEffect(() => {
        getClients();
        getProducts();
    }, []);

    useEffect(() => {
        const { page, offset } = filter;
        getSales(page, offset);
    }, [filter]);

    useEffect(() => {
        if (showForm === 'EDIT' || showForm === 'VIEW' || showForm === 'DELETE') setItems(formData.sale_products);
    }, [formData, showForm]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'EDIT' || showForm === 'VIEW' ?
                <>
                    <h2>
                        {showForm === 'NEW' ? 'Nueva venta' :
                            showForm === 'EDIT' ? `Editar venta #${formData.id}` :
                                `Venta #${formData.id}`
                        }
                    </h2>
                    <SaleForm
                        showForm={showForm}
                        saleFormData={saleFormData}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                        clients={clients}
                        items={items}
                        setItems={setItems}
                        products={products}
                        idsToDelete={idsToDelete}
                        setIdsToDelete={setIdsToDelete}
                    />
                </> :
                showForm === 'ADJUST' ?
                    <SalePaymentsList
                        saleOrder={formData}
                        setSaleOrderShowForm={setShowForm}
                    /> :
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2>Ventas</h2>
                            <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                <AddIcon />
                            </button>
                        </div>
                        <TableComponent
                            columns={columns}
                            rows={sales}
                            setRows={setSales}
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
                                <Modal.Title>{`Borrar venta #${formData.id}`}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Los datos no podrán ser recuperados.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={deleteSale}>Confirmar</Button>
                            </Modal.Footer>
                        </Modal>
                    </>
            }
        </Layout>
    )
}