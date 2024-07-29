import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'
import useAdmin from '../hooks/useAdmin';
import styles from "../styles/AdminNav.module.css"
import Scroll from './Scroll';
import useAuth from '../hooks/useAuth';

const AdminNav = () => {
  const [pendingRequest, setPendingRequest] = useState([])
  const { pathname } = useLocation();
  const { request } = useAdmin()
  const { auth } = useAuth();

  const handleCountRequest = () => {
    const requestPen = request.filter(requestNew => requestNew.Status === 1);
    return requestPen.length
  }

  useEffect(() => {
    const requestArray = request?.filter(requestNew => requestNew.Status === 1);
    setPendingRequest(requestArray);
  }, [request])

  return (
    <div>
        <Scroll
          xscroll={true}
          yscroll={false}
        >
            <ul className={`${styles.AdminNavContainer} d-flex gap-3 mt-3 pb-2`}>
                <li className={`${pathname === '/admin' && styles.linkActive}`}><Link className={styles.link} to="/admin">Almacén</Link></li>
                {/*<li className={`${pathname === '/admin/products' && styles.linkActive}`}><Link className={styles.link} to="/admin/products">Productos</Link></li>*/}
                {/*<li className={`${pathname === '/admin/productsList' && styles.linkActive}`}><Link className={`${styles.link} text-nowrap`} to="/admin/productsList">Lista Productos</Link></li>*/}
                {auth.RolID === 1 | auth.RolID === 2 | auth.RolID === 5 ? (
                  <li className={`${pathname === '/admin/purchase' && styles.linkActive}`}><Link className={styles.link} to="/admin/purchase">Compras</Link></li>
                ) : null}

                {auth.RolID === 1 | auth.RolID === 3 ? (
                  <>
                    <li className={`${pathname === '/admin/quotation' && styles.linkActive}`}><Link className={`${styles.link}`} to="/admin/quotation">Cotizaciones</Link></li>
                    <li className={`${pathname === '/admin/sales' && styles.linkActive}`}><Link className={styles.link} to="/admin/sales">Ventas</Link></li>
                    <li className={`${pathname === '/admin/request' && styles.linkActive} position-relative`}>
                      <Link className={styles.link} to="/admin/request">
                        Solicitudes

                        {pendingRequest.length > 0 && (
                          <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                            {handleCountRequest()}
                            <span className="visually-hidden">Products on list</span>
                          </span>
                        )}
                      </Link>
                    </li>
                  </>
                ) : null}

                {auth.RolID === 1 | auth.RolID === 4 | auth.RolID === 5 ? (
                  <li className={`${pathname === '/admin/storage' && styles.linkActive}`}><Link className={styles.link} to="/admin/storage">Pedidos</Link></li>
                ) : null}
                
                {auth.RolID === 1 | auth.RolID === 5 ? (
                  <>
                    <li className={`${pathname === '/admin/users' && styles.linkActive}`}><Link className={styles.link} to="/admin/users">Usuarios</Link></li>
                    <li className={`${pathname === '/admin/suppliers' && styles.linkActive}`}><Link className={styles.link} to="/admin/suppliers">Proveedores</Link></li>
                    <li className={`${pathname === '/admin/customers' && styles.linkActive}`}><Link className={styles.link} to="/admin/customers">Clientes</Link></li>
                  </>
                ) : (
                  <></>
                )}
                <li className={`${pathname === '/admin/type' && styles.linkActive}`}><Link className={styles.link} to="type">Tipos</Link></li>
                <li className={`${pathname === '/admin/statistics' && styles.linkActive}`}><Link className={styles.link} to="statistics">Estadisticas</Link></li>
                
            </ul>
        </Scroll>
    </div>
  )
}

export default AdminNav