import { useNavigate } from "react-router-dom";

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
                <nav>
                    <ul className="d-flex p-3 justify-content-end list-unstyled gap-4">
                        <li>
                            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                                Productos
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-secondary" onClick={() => navigate('/clients')}>
                                Clientes
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-secondary">Ventas</button>
                        </li>
                        <li>
                            <button className="btn btn-secondary">Compras</button>
                        </li>
                        <li>
                            <button className="btn btn-secondary" onClick={() => navigate('/categories')}>
                                Categorías
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-secondary" onClick={() => navigate('/suppliers')}>
                                Proveedores
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-secondary" onClick={() => navigate('/stores')}>
                                Depósitos
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-secondary" onClick={() => navigate('/users')}>
                                Usuarios
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-secondary" onClick={logout}>
                                Salir
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="mx-5">
                {children}
            </main>
        </div>
    )
}