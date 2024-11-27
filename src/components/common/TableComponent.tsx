/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from 'react-bootstrap/Table';

type TableComponentProps = {
    columns: Array<{ id: string, label: string, accessor: any }>;
    rows: Array<{ [key: string]: any }>;
    actions?: boolean;
}

export function TableComponent({ columns, rows, actions = false }: TableComponentProps) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {actions && <th />}
                    {columns.map(col => <th key={col.id}>{col.label}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ?
                    <tr>
                        <td colSpan={columns.length + (actions ? 1 : 0)} className='text-center'>
                            No hay registros para mostrar.
                        </td>
                    </tr> :
                    rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {actions &&
                                    <td>
                                        <button type="button" className="btn btn-info btn-sm me-2">Ver</button>
                                        <button type="button" className="btn btn-warning btn-sm mx-2">Editar</button>
                                        <button type="button" className="btn btn-danger btn-sm">Eliminar</button>
                                    </td>
                                }
                                {columns.map(col => col.accessor).map((acc, idx) => (
                                    <td key={idx}>
                                        {typeof acc === 'function' ? acc(row) : row[acc]}
                                    </td>
                                ))}
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    );
}
