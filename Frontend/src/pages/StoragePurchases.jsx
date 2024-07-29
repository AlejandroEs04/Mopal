import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaginationList from '../components/PaginationList'
import useAdmin from '../hooks/useAdmin'

const StoragePurchases = () => {
    const [purchasesFiltered, setPurchasesFiltered] = useState([])
    const { purchases } = useAdmin()

    const navigate = useNavigate();

    useEffect(() => {
        const purchasesNew = purchases?.filter(sale => sale.StatusID === 1);
        setPurchasesFiltered(purchasesNew)
    }, [purchases])

    return (
        <div>
            <button onClick={() => navigate(-1)} className="backBtn my-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>
            <h1>Compras</h1>
            <PaginationList 
                items={purchasesFiltered}
                type={2}
            />
        </div>
    )
}

export default StoragePurchases