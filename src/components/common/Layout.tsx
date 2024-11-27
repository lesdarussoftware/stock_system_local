import { Link } from "react-router-dom";

type LayoutProps = {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div>
            <header>
                <nav>
                    <ul className="d-flex p-3 justify-content-end list-unstyled gap-4">
                        <li>
                            <Link to="/">Productos</Link>
                        </li>
                        <li>
                            <Link to="/clients">Clientes</Link>
                        </li>
                        <li>
                            <Link to="/sales">Ventas</Link>
                        </li>
                        <li>
                            <Link to="/buys">Compras</Link>
                        </li>
                        <li>
                            <Link to="/categories">Categorías</Link>
                        </li>
                        <li>
                            <Link to="/suppliers">Proveedores</Link>
                        </li>
                        <li>
                            <Link to="/stores">Depósitos</Link>
                        </li>
                        <li>
                            <Link to="/logout">Salir</Link>
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