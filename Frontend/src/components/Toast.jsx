import { Link } from 'react-router-dom'
import useAdmin from '../hooks/useAdmin'
import styles from '../styles/Toast.module.css'

const Toast = () => {
    const { message, header, id, showToast, setShowToast } = useAdmin()

    if(showToast)
        return (
            <div className={`${styles.toastContainer} show`}>
                <div className={styles.toastHeader}>
                    <p className='text-light'>{header}</p>

                    <p className={styles.iconsContainer}>
                        <div className={styles.circle}></div>
                        <button 
                            className={styles.closeIcon}
                            onClick={() => setShowToast(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.svgClose}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </p>
                </div>

                <div className={styles.toastBody}>
                    <Link to={`/info/requests/${id}`}>
                        <p>{message}</p>
                    </Link>
                </div>
            </div>
        )
}

export default Toast