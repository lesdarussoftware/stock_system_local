/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';

import { ShowFormType } from '../../utils/types';
import { Supplier } from '../../utils/db';

type PurchaseFormProps = {
    purchaseFormData: any;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void
    suppliers: Supplier[];
}

export function PurchaseForm({ purchaseFormData, setShowForm, handleSubmit, suppliers }: PurchaseFormProps) {

    const { errors, handleChange, reset, formData } = purchaseFormData;

    return (
        <Form className='mt-4' onSubmit={e => handleSubmit(e)}>
            <Form.Group controlId="supplier_id">
                <Form.Label>Proveedor</Form.Label>
                <Form.Select
                    name='supplier_id'
                    value={formData.supplier_id}
                    onChange={e => handleChange({ target: { name: 'supplier_id', value: e.target.value } })}
                >
                    <option value="">Seleccione</option>
                    {suppliers.map((s: Supplier) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                {errors.supplier_id?.type === 'required' &&
                    <Form.Text className="text-danger d-block">
                        * El proveedor es requerido.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group controlId="date" className='my-3'>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={e => {
                        const formatted = format(e.target.value.replace('-', '/'), 'yyyy-MM-dd');
                        const value = format(new Date(formatted + 'T00:00:00'), 'yyyy-MM-dd');
                        handleChange({ target: { name: 'date', value } });
                    }}
                />
            </Form.Group>
            <Form.Group controlId="status">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                    name='status'
                    value={formData.status}
                    onChange={e => handleChange({ target: { name: 'status', value: e.target.value } })}
                >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="FINALIZADA">FINALIZADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                </Form.Select>
            </Form.Group>
            <div className='mt-5 d-flex justify-content-center gap-3'>
                <Button variant="secondary" type="button" className='w-25' onClick={() => {
                    setShowForm(null);
                    setShowForm(null);
                    reset();
                }}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" className='w-25'>
                    Guardar
                </Button>
            </div>
        </Form>
    );
}