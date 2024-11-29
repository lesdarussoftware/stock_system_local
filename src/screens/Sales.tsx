import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";

export function Sales() {

    const {
        sales,
        setSales,
        getSales,
        columns,
        showForm,
        setShowForm,
        saleFormData,
        // handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteSale
    } = useSales();
    const { formData, setFormData } = saleFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getSales(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>{showForm === 'NEW' ? 'Nueva venta' : `Editar venta #${formData.id}`}</h2>

                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Ventas</h2>
                        <button className="btn btn-primary" onClick={() => setShowForm('NEW')}>
                            Nueva
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