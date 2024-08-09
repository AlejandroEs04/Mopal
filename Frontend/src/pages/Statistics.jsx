import useAdmin from '../hooks/useAdmin'
import TableProductQuantity from '../components/TableProductQuantity';
import BarContainer from '../components/BarContainer';
import { getPeriod } from '../helpers/getCurrentPeriod';
import Loader from '../components/Loader';
import SaleStadistics from '../components/SaleStadistics';

const Statistics = () => {
    const { reportInfo } = useAdmin();
    const period = getPeriod()

    if(!reportInfo.products) {
        return <Loader />
    }

    const { items_movements, items_analyze_by_period } = reportInfo.products.summary

    const major_items = items_movements?.major_items?.filter(item => item.date === period)
    const minor_items = items_movements?.minor_items?.filter(item => item.date === period)

    const itemsFiltered = items_analyze_by_period?.filter(item => item.date === period)

    const information = itemsFiltered?.map(product => {
        return product.quantity
    })
    const labels = itemsFiltered?.map(product => {
        return product.item_id
    })

    return (
        <div className="mt-2 mb-5">
            <h1>Estadisticas</h1>
            <p>Analisis de todos los movimientos realizados</p>
            
            <BarContainer 
                title='Productos vendidos en el periodo actual'
                labels={labels}
                information={information}
            />

            <div className='row g-5 mt-2'>  
                <div className='col-md-6'>
                    <TableProductQuantity 
                        text='Productos Mas Vendidos'
                        items={major_items}
                        className='text-success'
                    />
                </div>

                <div className='col-md-6'>
                    <TableProductQuantity 
                        text='Productos Menos Vendidos'
                        items={minor_items}
                        className='text-danger'
                    />
                </div>
            </div>

            
            <SaleStadistics />

            <h4 className='mt-1'>Clientes con mayores compras</h4>
        </div>
    )
}

export default Statistics