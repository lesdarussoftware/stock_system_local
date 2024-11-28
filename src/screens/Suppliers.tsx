import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { SupplierForm } from "../components/entities/SupplierForm";

export function Suppliers() {

    const {
        suppliers,
        setSuppliers,
        getSuppliers,
        columns,
        showForm,
        setShowForm,
        supplierFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteSupplier
    } = useSuppliers();
    const { formData, setFormData } = supplierFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getSuppliers(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>{showForm === 'NEW' ? 'Nuevo proveedor' : `Editar proveedor #${formData.id}`}</h2>
                    <SupplierForm
                        supplierFormData={supplierFormData}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Proveedores</h2>
                        <button className="btn btn-primary" onClick={() => setShowForm('NEW')}>
                            Nuevo
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={suppliers}
                        setRows={setSuppliers}
                        filter={filter}
                        setFilter={setFilter}
                        totalRows={totalRows}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        actions
                        showEditAction
                        showDeleteAction
                    />
                    <Modal show={showForm === 'DELETE'} onHide={handleClose} backdrop="static" keyboard={false}        >
                        <Modal.Header closeButton>
                            <Modal.Title>{`Borrar proveedor ${formData.name}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deleteSupplier}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </Layout>
    )
}