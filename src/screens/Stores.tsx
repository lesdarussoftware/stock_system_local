import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useStores } from "../hooks/useStores";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { StoreForm } from "../components/entities/StoreForm";

export function Stores() {

    const {
        stores,
        setStores,
        getStores,
        columns,
        showForm,
        setShowForm,
        storeFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteStore
    } = useStores();
    const { formData, setFormData } = storeFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getStores(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>{showForm === 'NEW' ? 'Nuevo depósito' : `Editar depósito #${formData.id}`}</h2>
                    <StoreForm
                        storeFormData={storeFormData}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Depósitos</h2>
                        <button className="btn btn-primary" onClick={() => setShowForm('NEW')}>
                            Nuevo
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={stores}
                        setRows={setStores}
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
                            <Modal.Title>{`Borrar depósito ${formData.name}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deleteStore}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </Layout>
    )
}