import React, { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import PaginationList from '../components/PaginationList'
import Sale from '../models/Sale'
import { Link } from 'react-router-dom'

const AdminStoragePage = () => {
    const [showSales, setShowSales] = useState(false)
    const [showRequest, setShowRequest] = useState(false)
    const [salesFiltered, setSalesFiltered] = useState([])
    const [showPurchase, setShowPurchase] = useState(false)
    const [purchaseFiltered, setPurchaseFiltered] = useState([])
    const [requestFiltered, setRequestFiltered] = useState([])
    const { purchases, sales, request } = useAdmin()

    let saleKeys = []

    for(var key in new Sale()) {
        saleKeys.push(key)
    }

    useEffect(() => {
        const salesNew = sales?.filter(sale => sale.StatusID >= 2 && sale.StatusID !== 4 && sale.Active === 1);
        setSalesFiltered(salesNew)
        
        const purchasesNew = purchases?.filter(purchase => purchase.Status === "Generada" && purchase.Active === 1);
        setPurchaseFiltered(purchasesNew)
        
        const requestNew = request?.filter(request => request.Status === 2);
        setRequestFiltered(requestNew)
    }, [sales, purchases])

    return (
        <div className='my-3'>
            <h1>Pedidos pendientes</h1>
            <div className='row gx-4 gy-3 mb-4'>
                <Link to={'sales'} className='boxLink col-xl-3 col-md-4'>
                    <div id='bgRed' className='btnBgStorage rounded shadow'>
                        <h3 className='m-0'>Ver Ventas</h3>
                        <p className='m-0'>Ver las entregas pendientes de ventas</p>
                    </div>
                </Link>
                <Link to={'purchases'} className='boxLink col-xl-3 col-md-4'>
                    <div id='bgBlue' className='btnBgStorage rounded shadow'>
                        <h3 className='m-0'>Ver Compras</h3>
                        <p className='m-0'>Ver los pedidos pendientes por recibir</p>
                    </div>
                </Link>
                <Link to={'sales'} className='boxLink col-xl-3 col-md-4'>
                    <div id='bgGreen' className='btnBgStorage rounded shadow'>
                        <h3 className='m-0'>Ver ventas</h3>
                        <p className='m-0'>Ver las entregas pendientes de ventas</p>
                    </div>
                </Link>
            </div>

            <div className='d-flex flex-column gap-3'>
                <div>
                    <h3 className='mt-2'>Ventas Pendientes</h3>
                    <PaginationList 
                        items={salesFiltered}
                        type={1}
                    />
                </div>

                <div>
                    <h3 className='mt-2'>Compras Pendientes</h3>
                    <PaginationList 
                        items={purchaseFiltered}
                        type={2}
                    />
                </div>

                <div>
                    <h3 className='mt-2'>Solicitudes Pendientes</h3>
                    <PaginationList 
                        items={requestFiltered}
                        type={3}
                    />
                </div>
            </div>

        </div>
    )
}

export default AdminStoragePage