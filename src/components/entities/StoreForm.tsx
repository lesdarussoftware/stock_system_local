/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

type StoreFormProps = {
    storeFormData: any;
    showForm: 'NEW' | 'VIEW' | 'EDIT' | 'DELETE' | null;
    setShowForm: (value: 'NEW' | 'VIEW' | 'EDIT' | 'DELETE' | null) => void;
    handleSubmit: (e: any) => void;
}

export function StoreForm({ storeFormData, showForm, setShowForm, handleSubmit }: StoreFormProps) {

    const { errors, handleChange, reset, formData } = storeFormData;

    return (
        <Form className='mt-4' onChange={handleChange} onSubmit={e => handleSubmit(e)}>
            <Form.Group controlId="name" className={showForm === 'EDIT' ? 'w-75' : 'w-100'}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control name='name' value={formData.name} />
                {errors.name?.type === 'required' &&
                    <Form.Text className="text-danger d-block">
                        * El nombre es requerido.
                    </Form.Text>
                }
                {errors.name?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * El nombre es demasiado largo.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="my-3" controlId="phone">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control name='phone' value={formData.phone} />
                {errors.phone?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * El teléfono es demasiado largo.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control name='email' type='email' value={formData.email} />
                {errors.email?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * El email es demasiado largo.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
                <Form.Label>Dirección</Form.Label>
                <Form.Control name='address' value={formData.address} />
                {errors.address?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * La dirección es demasiado larga.
                    </Form.Text>
                }
            </Form.Group>
            <div className='mt-5 d-flex justify-content-center gap-3'>
                <Button variant="secondary" type="button" className='w-25' onClick={() => {
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