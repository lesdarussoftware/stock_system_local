/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useUsers } from "../../hooks/useUsers";
import { useTdssdifui } from "../../hooks/useTdssdifui";
import { Button, Form } from "react-bootstrap";

type LayoutProps = {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {

    const navigate = useNavigate();

    const { yoiuyiyyuiy, xcxvxcv, setXcxvxcv, handleIuudsfysdu } = useTdssdifui();
    const { logout } = useUsers();

    if (!yoiuyiyyuiy) return (
        <div className="vh-100 w-50 mx-auto d-flex align-items-center justify-content-center">
            <Form onChange={(e: any) => setXcxvxcv(e.target.value)} onSubmit={handleIuudsfysdu} className="w-100 d-flex gap-2">
                <Form.Control name='name' value={xcxvxcv} placeholder="Código..." />
                <Button variant="primary" type="submit">
                    Activar
                </Button>
            </Form>
        </div>
    )

    return (
        <div>
            <header>
                <Navbar bg="primary">
                    <Nav className="d-flex justify-content-end gap-3 w-100 px-3">
                        <Nav.Link className="text-white" onClick={() => navigate('/products')}>Artículos</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/clients')}>Clientes</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/sales')}>Ventas</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/purchases')}>Compras</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/categories')}>Categorías</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/suppliers')}>Proveedores</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/stores')}>Depósitos</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/users')}>Usuarios</Nav.Link>
                        <Nav.Link className="text-white" onClick={logout}>Salir</Nav.Link>
                    </Nav>
                </Navbar>
            </header>
            <main className="mx-5 my-3">
                {children}
            </main>
        </div>
    )
}