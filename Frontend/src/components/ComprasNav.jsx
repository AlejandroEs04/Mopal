import { useLocation, Link } from 'react-router-dom'
import Scroll from './Scroll';
import styles from "../styles/AdminNav.module.css"

const ComprasNav = () => {
  const { pathname } = useLocation();
  return (
    <div>
        <Scroll
            xscroll={true}
            yscroll={false}
        >
            <ul className={`${styles.AdminNavContainer} d-flex gap-2 mt-4 pb-2`}>
                <li className={`${pathname === '/purchase' && styles.linkActive}`}><Link className={styles.link} to="/purchase">Compras</Link></li>
                <li className={`${pathname === '/purchase/products' && styles.linkActive}`}><Link className={styles.link} to="/purchase/products">Productos</Link></li>
                <li className={`${pathname === '/purchase/suppliers' && styles.linkActive}`}><Link className={styles.link} to="/purchase/suppliers">Proveedores</Link></li>
            </ul>
        </Scroll>
    </div>
  )
}

export default ComprasNav