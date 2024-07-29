import { Outlet, useLocation, Link } from 'react-router-dom'
import useApp from '../hooks/useApp'
import styles from '../styles/Inventory.module.css'
import MainHeader from '../components/MainHeader'
import MainFooter from '../components/MainFooter'
import useAuth from '../hooks/useAuth'
import NavOffCanva from '../components/NavOffCanva'
import Spinner from '../components/Spinner'

const InventoryLayout = () => {
    const { pathname } = useLocation();
    const { language, setLanguage, show, handleClose, handleShow } = useApp()
    const { auth, loading } = useAuth()

    if(loading) return (
        <div className="container-fluid">
          <Spinner />
        </div>
    )

    return (
        <div className={styles.mainContainer}>
            <MainHeader />
            <main className={`container-fluid`}>
                <div className="row">
                    <div className={`${styles.topNav} bg-white text-dark py-3 justify-content-between`}>
                        <p className='m-0 fw-bold'>Bienvenido <span className='fw-light'>{auth.LastName}</span></p>

                        <div className='d-flex align-items-center gap-1'>
                            <button onClick={() => setLanguage(!language)} className={`${styles.navItem} d-flex align-items-center gap-2 text-decoration-none`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavHeader}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                                </svg>
                            </button>


                            {pathname === '/inventory/requests' ? (
                                <Link to={'/inventory'} className='text-black'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavHeader}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>
                                </Link>
                            ) : (
                                <Link to={'/inventory/requests'} className='text-black'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavHeader}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </Link>
                            )}
                            
                        </div>
                        
                    </div> 
                    
                    <aside className={`${styles.inventoryAside} bg-white col-lg-2 col-md-4 p-0`}>
                        <div className={`${styles.divAside} flex-column align-items-center p-4 w-100`}>
                            <h4>{language ? 'Welcome' : 'Bienvenido'}</h4>
                            {auth.ID && (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"w-6 h-6 svgUser text-dark"}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <p className='text-center mt-2'>{auth.Name + " " + auth.LastName}</p>
                                </>
                            )}
                            
                        </div>
                        
                        <nav className={styles.navInventory}>
                            <ul className={`${styles.lstNav} ${styles.divAside}`}>
                                <li className={`${pathname === "/inventory" && styles.active }`}>
                                    <Link to={'/inventory'} className={`${styles.navItem} align-items-center gap-2 px-4 text-decoration-none`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                        </svg>
                                        <p className='m-0 fs-6'>{language ? 'Inventory' : 'Inventario'}</p> 
                                    </Link>
                                    
                                </li>

                                {auth.ID && (
                                    <>
                                        <li className={`${pathname.includes('requests') && styles.active } d-flex align-items-center gap-2`}>
                                            <Link to={'/inventory/requests'} className={`${styles.navItem} d-flex align-items-center gap-2 px-4 text-decoration-none`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                <p className='m-0 fs-6'>{language ? 'History' : 'Historial'}</p> 
                                            </Link>
                                        </li>
                                        
                                        <li className={`${pathname.includes('user') && styles.active } d-flex align-items-center gap-2`}>
                                            <Link to={'/inventory/user'} className={`${styles.navItem} d-flex align-items-center gap-2 px-4 text-decoration-none`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                </svg>

                                                <p className='m-0 fs-6'>{language ? 'Account' : 'Cuenta'}</p> 
                                            </Link>
                                        </li>
                                    </>
                                )}

                                <li className={`d-flex align-items-center gap-2 mt-3 border-top pt-3`}>
                                    <button onClick={() => setLanguage(!language)} className={`${styles.navItem} d-flex align-items-center gap-2 px-4 text-decoration-none`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                                        </svg>
                                        <p className='m-0 fs-6'>{language ? 'Español' : 'English'}</p> 
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    <div className={`${styles.minHFull} px-lg-5 col-lg-10 col-md-8 col-xxl-10 py-4`}>
                        <Outlet />
                    </div>
                </div>

                <NavOffCanva />
            </main>
            <MainFooter />
        </div>
  )
}

export default InventoryLayout