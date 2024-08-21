import useAdmin from '../hooks/useAdmin'
import Loader from '../components/Loader';
import SaleStadistics from '../components/SaleStadistics';
import ProductStadistics from '../components/ProductStadistics';

const Statistics = () => {
    const { loading } = useAdmin();

    return loading ? 
        <Loader 
            text={'Estamos cargando la informacion...'}
        /> 
    :(
        <div className="mt-2 mb-5">
            <div className='pb-3 border-bottom'>
                <h1>Estadisticas</h1>
                <p>Analisis de todos los movimientos realizados</p>

                <div className='d-flex gap-2'>
                    <p className='m-0'>Reportes: </p>
                    <a href="#productsSeccion" className='fw-bold text-decoration-none text-dark'>Productos</a>
                    <a href="#salesSeccion" className='fw-bold text-decoration-none text-dark'>Ventas</a>
                    <a href="#purchaseSeccion" className='fw-bold text-decoration-none text-dark'>Compras</a>
                </div>
            </div>
            
            <ProductStadistics />

            <SaleStadistics />
        </div>
    )
}

export default Statistics