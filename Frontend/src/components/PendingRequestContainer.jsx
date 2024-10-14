import formatearFecha from '../helpers/formatearFecha'
import { toast } from 'react-toastify'
import axios from 'axios'
import useApp from '../hooks/useApp'
import { useState } from 'react'

const actionDictionary = {
    create: 'Registrar',
    update: 'Actualizar', 
    delete: 'Eliminar'
}

const statusDictionary = {
    pending: 'Pendiente', 
    approved: 'Aprobada', 
    rejected: 'Rechazada'
}

export default function PendingRequestContainer({pendingRequest}) {
    const [showInfo, setShowInfo] = useState(false)
    const { products } = useApp()

    const token = localStorage.getItem('token');
  
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const handleApproveRequest = async() => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/pending-requests/${pendingRequest.id}/approve-request`, config)
            toast.success(data)
        } catch (error) {
            console.log(error)
            toast.error('Hubo un error')
        }
    }

    const handleRejectRequest = async() => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/pending-requests/${pendingRequest.id}/reject-request`, config)
            toast.success(data)
        } catch (error) {
            console.log(error)
            toast.error('Hubo un error')
        }
    }

    const handleCheckChanges = (productFolio, key, value) => {
        const product = products.filter(product => product.Folio === productFolio)[0]

        if(typeof product[key] === 'object') return false

        return product[key] !== value
    }

    return (
        <div className='border p-3 rounded bg-light'>
            <div key={pendingRequest.id} className='d-flex justify-content-between'>
                <div>
                    <p className='text-xs-gray mb-1'>Creado el: {formatearFecha(pendingRequest.createAt)}</p>
                    <p className='fw-semibold fs-5'>Solicitante: {pendingRequest.user.FullName}</p>

                    <p className='fw-semibold m-0'>Acción solicitada: {actionDictionary[pendingRequest.action]}</p>
                    <p className='fw-semibold m-0'>Status: {statusDictionary[pendingRequest.status]}</p>
                </div>

                <div className='d-flex flex-column gap-2 w-25'>
                    <button className='btn btn-sm btn-primary' onClick={() => setShowInfo(!showInfo)}>{showInfo ? 'Ocultar' : 'Ver'} información</button>
                    <button className='btn btn-sm btn-success' onClick={() => handleApproveRequest(pendingRequest.id)}>Aprobar</button>
                    <button className='btn btn-sm btn-danger' onClick={() => handleRejectRequest(pendingRequest.id)}>Rechazar</button>
                </div>
            </div>

            {showInfo && (
                <div className='mt-3 pt-2 border-top'>
                    <p className='fw-bold fs-5 mb-0'>Cambios:</p>
                    <p className='fw-bold mb-1'>Producto: {pendingRequest.productData.Folio}</p>
                    {Object.entries(pendingRequest.productData).map(([key, value]) => handleCheckChanges(pendingRequest.productData.Folio, key, value) && (
                        <p key={key} className='mb-1 fw-semibold'>{key}: <span className='fw-normal'>{value}</span></p>
                    ))}
                </div>
            )}
        </div>
    )
}
