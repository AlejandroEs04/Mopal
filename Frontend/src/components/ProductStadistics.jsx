import { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin"
import BarContainer from "./BarContainer"
import TableProductQuantity from "./TableProductQuantity";
import { getPeriod, groupByPeriod } from "../helpers/getDate";

const ProductStadistics = () => {
    const { reportInfo } = useAdmin();
    const [period, setPeriod] = useState(getPeriod())
    const [majorItems, setMajorItems] = useState([])
    const [minorItems, setMinorItems] = useState([])
    const [information, setInformation] = useState({})
    const [labels, setLabels] = useState([])
    const [groupedData, setGroupedData] = useState([])

    useEffect(() => {
        setMajorItems(reportInfo?.products?.summary?.items_movements?.major_items?.filter(item => item.date === period))
        setMinorItems(reportInfo?.products?.summary?.items_movements?.minor_items?.filter(item => item.date === period))
    
        setGroupedData(groupByPeriod(reportInfo?.products?.summary?.items_analyze_by_period))

        const groupedData = groupByPeriod(reportInfo?.products?.summary?.items_analyze_by_period)
        const currentData = groupedData?.filter(group => group.date === period)[0]
        setInformation(currentData?.data?.map(product => {return product.quantity}))

        setLabels(currentData?.data?.map(product => {return product.item_id}))
    }, [reportInfo])

    useEffect(() => {
        const currentData = groupedData?.filter(group => group.date === period)[0]
        setInformation(currentData?.data?.map(product => {return product.quantity}))

        setLabels(currentData?.data?.map(product => {return product.item_id}))

        setMajorItems(reportInfo?.products?.summary?.items_movements?.major_items?.filter(item => item.date === period))
        setMinorItems(reportInfo?.products?.summary?.items_movements?.minor_items?.filter(item => item.date === period))
    }, [period])

    const handleChangePeriod = (e) => {
        setPeriod(e.target.value)
    }

    return (
        <>
            <div className="row align-items-end my-3" id="productsSeccion">
                <div className="col-md-8">
                    <h2>Movimiento de productos</h2>
                    <p className="m-0">Analizar el movimiento de los productos en el periodo <span className='fw-bold'>{period}</span></p>
                </div>

                <div className="col-md-4">
                    <label htmlFor="period" className="fs-6 fw-light">Seleccione un periodo</label>

                    <select 
                        name="period" 
                        id="period"
                        className="form-select form-select-sm"
                        value={period}
                        onChange={handleChangePeriod}
                    >
                        {groupedData?.map(groupDate => (
                            <option value={groupDate.date} key={groupDate.date}>{groupDate.date}</option>
                        ))}
                    </select>
                </div>
            </div>

            <BarContainer 
                title='Productos vendidos en el periodo actual'
                labels={labels}
                information={information}
            />

            <div className='row g-5 mt-2'>  
                <div className='col-md-6'>
                    <TableProductQuantity 
                        text='Productos Mas Vendidos'
                        items={majorItems}
                        className='text-success'
                    />
                </div>

                <div className='col-md-6'>
                    <TableProductQuantity 
                        text='Productos Menos Vendidos'
                        items={minorItems}
                        className='text-danger'
                    />
                </div>
            </div>
        </>
    )
}

export default ProductStadistics