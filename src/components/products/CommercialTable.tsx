/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import { DeleteIcon } from '../svg/DeleteIcon';
import { Autocomplete } from '../common/Autocomplete';

import { Product } from '../../utils/db';
import { getItemSalePrice } from '../../utils/helpers';
import { Item } from '../../utils/types';

type CommercialTableProps = {
    products: Product[];
    items: any;
    setItems: (value: any) => void;
}

export function CommercialTable({ products, items, setItems }: CommercialTableProps) {

    const handleAdd = (pId: number) => {
        setItems([
            ...items.filter((i: any) => i.product_id !== pId),
            {
                product_id: pId,
                product_buy_price: products.find(p => p.id === pId)?.buy_price,
                product_earn: products.find(p => p.id === pId)?.earn,
                product_sale_price: products.find(p => p.id === pId)?.sale_price,
                amount: 1
            }
        ].sort((a: any, b: any) => a.product_id - b.product_id));
    }

    const handleChangeAmount = (amount: number, pId: number) => {
        setItems([
            ...items.filter((i: any) => i.product_id !== pId),
            {
                ...items.find((i: any) => i.product_id === pId),
                amount
            }
        ].sort((a: any, b: any) => a.product_id - b.product_id));
    }

    const handleDelete = (pId: number) => {
        setItems(items.filter((i: any) => i.product_id !== pId));
    }

    return (
        <>
            <h3 className='mt-4'>Artículos</h3>
            <div className='mb-2'>
                <Autocomplete
                    options={products
                        .filter(p => !items.map((i: Item) => i.product_id).includes(p.id))
                        .map(p => ({ id: p.id, label: p.name }))}
                    placeholder='Ingrese nombre o sku del producto...'
                    onChange={value => handleAdd(+value)}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Total det.</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ?
                        <tr>
                            <td colSpan={5} className='text-center'>
                                No hay registros para mostrar.
                            </td>
                        </tr> :
                        items.map((item: any, idx: number) => {
                            const product = products.find(p => +p.id === +item.product_id)!;
                            return (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <Form.Control
                                            type='number'
                                            min={1}
                                            step={1}
                                            name='amount'
                                            value={+item.amount}
                                            onChange={(e: any) => handleChangeAmount(e.target.value, product.id)}
                                        />
                                    </td>
                                    <td>{(getItemSalePrice(item) * +item.amount).toFixed(2)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm d-flex align-items-center"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </>
    );
}
