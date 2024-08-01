import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useAdmin from '../hooks/useAdmin'
import PaginationList from '../components/PaginationList';

const StorageRequests = () => {
    const [requestsFiltered, setRequestFiltered] = useState([])
    const { request, alerta } = useAdmin();

    const navigate = useNavigate();

    useEffect(() => {
        const requestsArray = request?.filter(request => request.Status > 2 && request.Status < 4);
        setRequestFiltered(requestsArray)
    }, [request])

    return (
        <div>
            <button onClick={() => navigate(-1)} className="backBtn my-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <h1>Solicitudes</h1>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <PaginationList 
                items={requestsFiltered}
                type={3}
            />
        </div>
    )
}

export default StorageRequests