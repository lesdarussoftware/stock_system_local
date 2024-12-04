import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useUsers } from "../../hooks/useUsers";

type LayoutProps = {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {

    const navigate = useNavigate();

    const { logout } = useUsers();

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