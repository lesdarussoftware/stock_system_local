/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';

type TableComponentProps = {
    columns: Array<{ id: string, label: string, accessor: any, sortable?: boolean }>;
    rows: Array<{ [key: string]: any }>;
    actions?: boolean;
}

export function TableComponent({ columns, rows, actions = false }: TableComponentProps) {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50); // Por defecto, 50 registros por página
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    // Calcula las filas ordenadas
    const sortedRows = sortConfig ? [...rows].sort((a, b) => {
        const { key, direction } = sortConfig;
        const compare = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
        return direction === 'asc' ? compare : -compare;
    }) : rows;

    // Paginación
    const offset = (currentPage - 1) * rowsPerPage;
    const paginatedRows = sortedRows.slice(offset, offset + rowsPerPage);

    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const handleSort = (columnId: string) => {
        setSortConfig((prev) => {
            if (prev?.key === columnId) {
                // Cambia la dirección de orden si es la misma columna
                return { key: columnId, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key: columnId, direction: 'asc' };
        });
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reiniciar a la primera página al cambiar la cantidad
    };

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {actions && <th />}
                        {columns.map(col => (
                            <th key={col.id} onClick={() => col.sortable && handleSort(col.id)}>
                                {col.label}
                                {col.sortable && (
                                    <>
                                        {sortConfig?.key === col.id ? (
                                            sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'
                                        ) : ' ↕'}
                                    </>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedRows.length === 0 ?
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className='text-center'>
                                No hay registros para mostrar.
                            </td>
                        </tr> :
                        paginatedRows.map(row => (
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
                        ))
                    }
                </tbody>
            </Table>
            <div className='d-flex align-items-center justify-content-end gap-4'>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Group controlId="rowsPerPageSelect" className='d-flex gap-2 align-items-center'>
                        <Form.Select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Form.Select>
                    </Form.Group>
                </div>
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Item
                            key={idx + 1}
                            active={currentPage === idx + 1}
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </>
    );
}
