import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useClients } from "../hooks/useClients";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { ClientForm } from "../components/entities/ClientForm";
import { AddIcon } from "../components/svg/AddIcon";

export function Clients() {

    const {
        clients,
        setClients,
        getClients,
        columns,
        showForm,
        setShowForm,
        clientFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteClient
    } = useClients();
    const { formData, setFormData } = clientFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getClients(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>{showForm === 'NEW' ? 'Nuevo cliente' : `Editar cliente #${formData.id}`}</h2>
                    <ClientForm
                        clientFormData={clientFormData}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Clientes</h2>
                        <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                            <AddIcon />
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={clients}
                        setRows={setClients}
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
                            <Modal.Title>{`Borrar cliente ${formData.name}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deleteClient}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </Layout>
    )
}