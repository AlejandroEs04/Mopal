import { Link } from "react-router-dom";
import useApp from "../hooks/useApp";
import Offcanvas from "react-bootstrap/Offcanvas";
import useAuth from "../hooks/useAuth";

const NavOffCanva = () => {
    const { auth, logOut } = useAuth();
    const { showCanva, handleCloseCanva } = useApp();

    return (
        <>
            <Offcanvas show={showCanva} onHide={handleCloseCanva}>
                <Offcanvas.Header closeButton className="mt-4">
                    <h4 className="mt-0">Menu</h4>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <nav className="nav flex-column">
                        <ul className="p-0">
                            <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/">Inicio</Link></li>
                            <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/productos">Productos</Link></li>
                            <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/inventory">Inventario</Link></li>
                            <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/contacto">Contacto</Link></li>
                            <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/nosotros">Nosotros</Link></li>
                            <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/">Inicio</Link></li>

                            {auth.ID ? (
                                <>
                                {+auth.RolID === 1 && (
                                    <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/admin">Administracion</Link></li>
                                )}
                                {+auth.RolID === 2 && (
                                    <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/admin">Compras</Link></li>
                                )}
                                {+auth.RolID === 3 && (
                                    <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/admin">Ventas</Link></li>
                                )}
                                {+auth.RolID === 4 && (
                                    <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/admin">Entregas</Link></li>
                                )}
                                {+auth.RolID === 5 && (
                                    <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to="/admin">Gestion</Link></li>
                                )}
                                <button className='btn btn-sm btn-danger fs-5 w-100 mt-3' onClick={() => logOut()}>Cerrar Sesion</button>
                                </>
                            ) : (
                                <li className="nav-item"><Link onClick={() => handleCloseCanva()} className="nav-link text-dark fw-medium fs-5 px-0" to={'/login'}>Iniciar sesion</Link></li>
                            )}
                        </ul>
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NavOffCanva