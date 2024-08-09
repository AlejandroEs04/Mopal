import React, { useMemo, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import LineGraphContainer from './LineGraphContainer'
import { getPeriod } from '../helpers/getCurrentPeriod'

const SaleStadistics = () => {
    const { reportInfo } = useAdmin()
    const [period, setPeriod] = useState(new Date())
    const { actions_total, amount_total } = reportInfo?.sales

    const labels = actions_total?.map(sale => {
        return sale.period
    })

    const salesInformation = actions_total?.map(sale => {
        return sale.actions_quantity
    })
    const amountInformation = amount_total?.map(sale => {
        return sale.total_amount
    })

    const salesGraphInformation = [
        {
            label: 'Ventas',
            data: salesInformation, 
            backgroundColor: 'rgba(32, 188, 238, 0.8)'
        }
    ]

    const amountGraphInformacion = [
        {
            label: 'Ganancias (*1000)', 
            data: amountInformation, 
            backgroundColor: 'rgba(231, 0, 0, 0.8)'
        }
    ]

    const periodSelected = useMemo(() => getPeriod(period), [period])

    return (
        <>
            <h3 className='mt-4 border-top pt-4'>Ventas realizadas</h3>
            <p>Podras ver la informacion de las ventas realizadas del periodo <span className='fw-bold'>{periodSelected}</span></p>
            <LineGraphContainer labels={labels} information={salesGraphInformation} />

            <h3 className='mt-4 border-top pt-4'>Ganancias obtenidas</h3>
            <p>Podras ver la informacion de las ganancias obtenidas del periodo <span className='fw-bold'>{periodSelected}</span></p>
            <LineGraphContainer labels={labels} information={amountGraphInformacion} />
        </>
    )
}

export default SaleStadistics