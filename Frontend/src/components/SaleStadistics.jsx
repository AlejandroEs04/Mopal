import React, { useEffect, useMemo, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import LineGraphContainer from './LineGraphContainer'
import Loader from './Loader'
import { getPeriod, getYear } from '../helpers/getDate'
import formatearDinero from '../helpers/formatearDinero'
import useApp from '../hooks/useApp'

const SaleStadistics = () => {
    const { setModalShow, setModalInfo, modalInfo } = useApp()
    const { reportInfo, loading, customers } = useAdmin()
    const [period, setPeriod] = useState(new Date())
    const [labels, setLabels] = useState([])
    const [salesInformation, setSalesInformation] = useState([])
    const [amountInformation, setAmountInformation] = useState([])
    const [salesGraphInformation, setSalesGraphInformation] = useState([])
    const [amountGraphInformation, setAmountGraphInformation] = useState([])
    const [clientsFiltered, setClientsFiltered] = useState([])

    loading && <Loader />

    const handleModalState = () => {
        setModalShow(true)

        setModalInfo({
            ...modalInfo, 
            title: 'Obtener reporte de ventas', 
            type: 1, 
            text: 'Llena el siguiente formulario para poder obtener el reporte de ventas segun tus filtros'
        })
    }
 
    useEffect(() => {
        if(reportInfo.sales) {
            setLabels(reportInfo?.sales?.actions_total?.map(sale => { return sale.period }))
            setSalesInformation(reportInfo?.sales?.actions_total?.map(sale => { return sale.actions_quantity }))
            setAmountInformation(reportInfo?.sales?.amount_total?.map(sale => { return sale.total_amount }))
            setClientsFiltered(reportInfo?.sales?.clients?.actions_by_period)
            
            setSalesGraphInformation([
                {
                    label: 'Ventas',
                    data: salesInformation, 
                    backgroundColor: 'rgba(32, 188, 238, 0.8)'
                }
            ])
            setAmountGraphInformation([
                {
                    label: 'Ganancias (*1000)', 
                    data: amountInformation, 
                    backgroundColor: 'rgba(231, 0, 0, 0.8)'
                }
            ])
        }
    }, [reportInfo])

    const periodSelected = useMemo(() => getYear(period), [period])

    return (
        <>
            <div className='d-flex justify-content-between mt-4 pt-4 border-top align-items-center'>
                <div>
                    <h2 id='salesSeccion'>Ventas realizadas</h2>
                </div>
                
                <div>
                    <button
                        onClick={() => handleModalState()}
                        className='btn btn-primary btn-sm'
                    >Obtener reporte</button>
                </div>
            </div>
            <p>Podras ver la informacion de las ventas realizadas del periodo <span className='fw-bold'>{periodSelected}</span></p>
            <LineGraphContainer labels={labels} information={salesGraphInformation} />

            <h3 className='mt-4 border-top pt-4'>Ganancias obtenidas</h3>
            <p>Podras ver la informacion de las ganancias obtenidas del periodo <span className='fw-bold'>{periodSelected}</span></p>
            <LineGraphContainer labels={labels} information={amountGraphInformation} />

            <h3 className='mt-4 border-top pt-4'>Ganancias por cliente</h3>
            <p>Podras ver la informacion de las ganancias obtenidas del periodo <span className='fw-bold'>{periodSelected}</span> por cliente</p>
            <table className='table table-hover table-sm'>
                <thead className='table-light'>
                    <tr>
                        <th>Cliente ID</th>
                        <th>Razon social</th>
                        <th>Ganancias</th>
                        <th>Ventas</th>
                        <th>Periodo</th>
                    </tr>
                </thead>

                <tbody>
                    {clientsFiltered?.map(client => (
                        <tr key={client.user_id + client.date} onDoubleClick={() => console.log(client.user_id + '/' + client.date)}>
                            <td>{client.user_id}</td>
                            <td>{customers.filter(customer => +customer.ID === +client.user_id)[0]?.BusinessName}</td>
                            <td>{formatearDinero(+client.amount)}</td>
                            <td>{client.actions_acount}</td>
                            <td>{client.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default SaleStadistics