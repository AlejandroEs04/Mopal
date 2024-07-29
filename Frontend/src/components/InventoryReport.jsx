import React, { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import useApp from '../hooks/useApp';
import Scroll from './Scroll';

const InventoryReport = () => {
  const [currentInfo, setCurrentInfo] = useState([]);
  const [beforeInfo, setBeforeInfo] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);

  const { reportInfo } = useAdmin();
  const { products } = useApp()

  useEffect(() => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const infoProduct = reportInfo?.totalProducts

    const currentPeriodo = reportInfo?.salesPerPeriodo?.filter(periodo => periodo.Mes === (month+1) && periodo.Year === year);
    const beforePeriodo = reportInfo?.salesPerPeriodo?.filter(periodo => periodo.Mes === month && periodo.Year === year);

    if(currentPeriodo?.length > 0) {
      setTotalProducts(infoProduct);
      setCurrentInfo(currentPeriodo[0])
      setBeforeInfo(beforePeriodo[0])
    }
  }, [reportInfo])

  return (
    <div className='mt-5 pb-5'>
      <h1>Reporte de inventario</h1>
      <p>Se presenta la información de las ventas del mes pasado y las ventas actuales, comparandolas con el stock actual y el stock no disponible</p>
      <Scroll>
        <table className='table table-hover mt-2'>
          <thead className='table-light'>
            <tr>
              <th className='text-nowrap'>Folio</th>
              <th className='text-nowrap'>Ventas mes: {beforeInfo?.Mes}/{beforeInfo?.Year}</th>
              <th className='text-nowrap'>Ventas Promedio</th>
              <th className='text-nowrap'>Ventas este mes</th>
              <th className='text-nowrap'>Stock actual</th>
              <th className='text-nowrap'>Stock no disponible</th>
              <th className='text-nowrap'>Stock en camino</th>
            </tr>
          </thead>

          <tbody>
              {beforeInfo?.Products?.map(product => (
                <tr key={product?.ProductFolio}>
                  <td className='text-nowrap'>{product?.ProductFolio}</td>
                  <td>{product?.Quantity}</td>
                  {totalProducts?.map(productInfo => productInfo.ProductFolio === product.ProductFolio && (
                    <td>  {Math.ceil(productInfo.Average)}</td>
                  ))}

                  {currentInfo?.Products?.map(productCurrent => productCurrent.ProductFolio === product.ProductFolio && (
                    <td key={productCurrent.ProductFolio}> 
                      <div
                        className={`
                          ${productCurrent.Quantity > product.Quantity && 'text-success fw-bold'} 
                          ${productCurrent.Quantity < product.Quantity && 'text-danger fw-bold'}
                          d-flex gap-3
                          align-items-center
                        `}
                      >
                        <p className='m-0 p-0 w-50'>
                          {productCurrent?.Quantity}
                        </p>                                        
                        <div className='d-flex justify-content-end align-items-center w-50'>         
                          {productCurrent.Quantity > product.Quantity && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                          )}

                          {productCurrent.Quantity < product.Quantity && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                  ))}
                  
                  {products?.map(productInfo => productInfo.Folio === product.ProductFolio && (
                    <>
                      <td>{productInfo?.StockAvaible}</td>
                      <td>{productInfo?.StockOnHand}</td>
                      <td>{productInfo?.StockOnWay}</td>
                    </>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </Scroll>
    </div>
  )
}

export default InventoryReport