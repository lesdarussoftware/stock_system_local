import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { usePurchases } from "../hooks/usePurchases";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { PurchaseForm } from "../components/entities/PurchaseForm";

export function Purchases() {

    const {
        purchases,
        setPurchases,
        getPurchases,
        columns,
        showForm,
        setShowForm,
        purchaseFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deletePurchase
    } = usePurchases();
    const { formData, setFormData } = purchaseFormData;
    const { suppliers, getSuppliers } = useSuppliers();

    useEffect(() => {
        getSuppliers();
    }, [])

    useEffect(() => {
        const { page, offset } = filter;
        getPurchases(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>{showForm === 'NEW' ? 'Nueva compra' : `Editar compra #${formData.id}`}</h2>
                    <PurchaseForm
                        purchaseFormData={purchaseFormData}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                        suppliers={suppliers}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Compras</h2>
                        <button className="btn btn-primary" onClick={() => setShowForm('NEW')}>
                            Nueva
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={purchases}
                        setRows={setPurchases}
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
                    <Modal show={showForm === 'DELETE'} onHide={handleClose} backdrop="static" keyboard={false}        >
                        <Modal.Header closeButton>
                            <Modal.Title>{`Borrar compra #${formData.id}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deletePurchase}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </Layout>
    )
}