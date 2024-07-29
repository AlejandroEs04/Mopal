import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaginationList from '../components/PaginationList'
import useAdmin from '../hooks/useAdmin'

const StorageSales = () => {
    const [salesFiltered, setSalesFiltered] = useState([])
    const { sales, alerta } = useAdmin()

    const navigate = useNavigate();

    useEffect(() => {
        const salesNew = sales?.filter(sale => sale.StatusID > 1 && sale.StatusID < 4);
        setSalesFiltered(salesNew)
    }, [sales])

    return (
        <div>
            <button onClick={() => navigate(-1)} className="backBtn my-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <h1>Ventas</h1>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <PaginationList 
                items={salesFiltered}
                type={1}
            />
        </div>
    )
}

export default StorageSales