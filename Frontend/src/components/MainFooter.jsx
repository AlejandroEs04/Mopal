import styles from '../styles/Footer.module.css'
import { Link } from 'react-router-dom'

const MainFooter = () => {
  return (
    <footer>
        <div className='row g-5'>
            <div className='col-md-6'>
                <img src="/img/LogoEditableBlanco.png" alt="Logo Mopal Grupo S.A. De C.V." className={styles.logo} />
                <p className='mt-3'>Mopal Grupo es una empresa mexicana que brinda soluciones de automatización industrial de la más alta calidad en el mercado.</p>
            </div>

            <div className={`col-md-3 ${styles.nav}`}>
                <h3 className='fw-light'>Navegacion</h3>
                <Link to={'/'}>Inicio</Link>
                <Link to={'/productos'}>Productos</Link>
                <Link to={'/inventory'}>Inventario</Link>
                <Link to={'/contacto'}>Contacto</Link>
            </div>

            <div className={`col-md-3 ${styles.nav}`}>
                <h3 className='fw-light'>FAQ</h3>
                <Link to={'/'}>Terminos y condiciones</Link>
                <Link to={'/productos'}>Aviso de privacidad</Link>
                <Link to={'/inventory'}>Contacto</Link>
            </div>
        </div>
    </footer>
  )
}

export default MainFooter