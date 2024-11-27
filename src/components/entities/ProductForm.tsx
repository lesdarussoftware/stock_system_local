/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Category, Supplier } from '../../utils/db';

type ProductFormProps = {
    productFormData: any;
    showForm: 'NEW' | 'EDIT' | null;
    setShowForm: (value: 'NEW' | 'EDIT' | null) => void;
    handleSubmit: (e: any) => void;
    categories: Category[];
    suppliers: Supplier[];
}

export function ProductForm({
    productFormData,
    showForm,
    setShowForm,
    handleSubmit,
    categories,
    suppliers
}: ProductFormProps) {

    const { errors, handleChange, reset } = productFormData;

    return (
        <Form className='mt-4' onChange={handleChange} onSubmit={e => handleSubmit(e)}>
            <div className='d-flex align-items-end justify-content-between mb-3 gap-5'>
                <Form.Group controlId="name" className={showForm === 'EDIT' ? 'w-75' : 'w-100'}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control name='name' />
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
                {showForm === 'EDIT' &&
                    <Form.Group controlId="is_active" className='w-25'>
                        <Form.Check type="checkbox" label="Activar / desactivar" />
                    </Form.Group>
                }
            </div>
            <div className='d-flex justify-content-between mb-3 gap-5'>
                <Form.Group controlId="sku" className='w-50'>
                    <Form.Label>SKU</Form.Label>
                    <Form.Control name='sku' />
                    {errors.sku?.type === 'required' &&
                        <Form.Text className="text-danger d-block">
                            * El sku es requerido.
                        </Form.Text>
                    }
                    {errors.sku?.type === 'maxLength' &&
                        <Form.Text className="text-danger d-block">
                            * El sku es demasiado largo.
                        </Form.Text>
                    }
                </Form.Group>
                <Form.Group controlId="bar_code" className='w-50'>
                    <Form.Label>Cód. barras</Form.Label>
                    <Form.Control name='bar_code' />
                    {errors.bar_code?.type === 'maxLength' &&
                        <Form.Text className="text-danger d-block">
                            * El código de barras es demasiado largo.
                        </Form.Text>
                    }
                </Form.Group>
            </div>
            <Form.Group className="mb-3" controlId="description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control name='description' />
                {errors.description?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * La descripción es demasiado larga.
                    </Form.Text>
                }
            </Form.Group>
            <div className='d-flex justify-content-between mb-3 gap-5'>
                <Form.Group controlId="buy_price" className='w-25'>
                    <Form.Label>Precio compra</Form.Label>
                    <Form.Control type='number' min={0} step="0.01" name='buy_price' />
                </Form.Group>
                <Form.Group controlId="earn" className='w-25'>
                    <Form.Label>% Ganancia</Form.Label>
                    <Form.Control type='number' min={0} max={100} name='earn' />
                </Form.Group>
                <Form.Group controlId="sale_price" className='w-25'>
                    <Form.Label>Precio venta</Form.Label>
                    <Form.Control type='number' min={0} step="0.01" name='sale_price' />
                </Form.Group>
                <Form.Group controlId="min_stock" className='w-25'>
                    <Form.Label>Stock mínimo</Form.Label>
                    <Form.Control type='number' min={0} step="1" name='min_stock' />
                </Form.Group>
            </div>
            <div className='d-flex justify-content-between mb-3'>
                <Form.Group controlId="category_id" className='w-25'>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select name='category_id'>
                        <option value="">Seleccione</option>
                        {categories.map((cat: Category) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </Form.Select>
                    {errors.category_id?.type === 'required' &&
                        <Form.Text className="text-danger d-block">
                            * La categoría es requerida.
                        </Form.Text>
                    }
                </Form.Group>
                <Form.Group controlId="supplier_id" className='w-25'>
                    <Form.Label>Proveedor</Form.Label>
                    <Form.Select name='supplier_id'>
                        <option value="">Seleccione</option>
                        {suppliers.map((sup: Supplier) => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                    </Form.Select>
                    {errors.supplier_id?.type === 'required' &&
                        <Form.Text className="text-danger d-block">
                            * El proveedor es requerido.
                        </Form.Text>
                    }
                </Form.Group>
                <Form.Group controlId="store_id" className='w-25'>
                    <Form.Label>Depósito</Form.Label>
                    <Form.Select name='store_id'>
                        <option value="">Seleccione</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                </Form.Group>
            </div>
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