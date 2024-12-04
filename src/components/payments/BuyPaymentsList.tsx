import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { TableComponent } from "../common/TableComponent";

import { useSalePayments } from "../../hooks/useSalePayments";

import { SaleOrder } from "../../utils/db";
import { ShowFormType } from "../../utils/types";

type SalePaymentsListProps = {
    saleOrder: SaleOrder;
    setSaleOrderShowForm: (value: ShowFormType) => void;
}

export function SalePaymentsList({ saleOrder, setSaleOrderShowForm }: SalePaymentsListProps) {

    const {
        salePayments,
        getSalePayments,
        salePaymentFormData,
        showForm,
        setShowForm,
        handleSubmit,
        columns,
        setSalePayments,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteSalePayment
    } = useSalePayments();
    const { formData, setFormData } = salePaymentFormData;

    useEffect(() => {
        getSalePayments(saleOrder.id);
    }, []);

    return (
        <>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>
                        {showForm === 'NEW' ? `Nuevo pago para la venta #${saleOrder.id}` :
                            `Editar pago #${formData.id} de la venta #${saleOrder.id}`}
                    </h2>
                    <SalePaymentForm
                        salePaymentFormData={salePaymentFormData}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className='d-flex justify-content-between align-items-start'>
                        <h2>{`Pagos de la venta #${saleOrder.id}`}</h2>
                        <Button variant="secondary" type="button" onClick={() => setSaleOrderShowForm(null)}>
                            Volver a lista de ventas
                        </Button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={salePayments}
                        setRows={setSalePayments}
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
                            <Modal.Title>{`Borrar pago #${formData.id} de la venta #${saleOrder.id}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deleteSalePayment}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </>
    )
}