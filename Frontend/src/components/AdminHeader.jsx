import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const AdminHeader = () => {
    const { logOut } = useAuth();

    return (
        <header className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <div className='container d-flex justify-content-between align-items-center'>
                <Link to={'/'}>
                    <img src={'/img/TIM_logo.svg'} alt="Logo Mopal Grupo" className={`logoAdmin`} />
                </Link>
                
                <div>
                    <button onClick={() => logOut()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon text-danger">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader