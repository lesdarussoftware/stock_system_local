/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';

import { CommercialTable } from '../products/CommercialTable';
import { Autocomplete } from '../common/Autocomplete';

import { ShowFormType } from '../../utils/types';
import { Client, Product } from '../../utils/db';
import { getSaleOrPurchaseTotal } from '../../utils/helpers';

type SaleFormProps = {
    showForm: ShowFormType;
    saleFormData: any;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void
    clients: Client[];
    products: Product[];
    items: any;
    setItems: (value: any) => void;
    idsToDelete: number[];
    setIdsToDelete: any;
}

export function SaleForm({
    showForm,
    saleFormData,
    setShowForm,
    handleSubmit,
    clients,
    products,
    items,
    setItems,
    idsToDelete,
    setIdsToDelete
}: SaleFormProps) {

    const { errors, handleChange, reset, formData } = saleFormData;

    return (
        <Form className='mt-4' onSubmit={e => handleSubmit(e)}>
            <h4 className='mb-2'>Cliente: {clients.find(c => c.id === +formData.client_id)?.name}</h4>
            {(showForm === 'NEW' || showForm === 'EDIT') &&
                <Autocomplete
                    options={clients.map(c => ({ id: c.id, label: c.name }))}
                    placeholder='Ingrese el nombre del cliente...'
                    onChange={value => handleChange({ target: { name: 'client_id', value } })}
                />
            }
            {errors.client_id?.type === 'required' &&
                <Form.Text className="text-danger d-block">
                    * El cliente es requerido.
                </Form.Text>
            }
            <Form.Group controlId="date" className='my-3'>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                    type='date'
                    name='date'
                    value={formData.date}
                    disabled={showForm === 'VIEW'}
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
                    disabled={showForm === 'VIEW'}
                    onChange={e => handleChange({ target: { name: 'status', value: e.target.value } })}
                >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="FINALIZADA">FINALIZADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                </Form.Select>
            </Form.Group>
            <CommercialTable
                items={items}
                setItems={setItems}
                products={products}
                idsToDelete={idsToDelete}
                setIdsToDelete={setIdsToDelete}
                showForm={showForm}
                type='SALE'
            />
            <h4>Total: {`$${getSaleOrPurchaseTotal(items)}`}</h4>
            <div className='mt-5 d-flex justify-content-center gap-3'>
                <Button variant="secondary" type="button" className='w-25' onClick={() => {
                    setShowForm(null);
                    setItems([]);
                    setIdsToDelete([]);
                    reset();
                }}>
                    {showForm === 'VIEW' ? 'Volver' : 'Cancelar'}
                </Button>
                {(showForm === 'NEW' || showForm === 'EDIT') &&
                    <Button variant="primary" type="submit" className='w-25' disabled={formData.disabled || items.length === 0}>
                        Guardar
                    </Button>
                }
            </div>
        </Form>
    );
}