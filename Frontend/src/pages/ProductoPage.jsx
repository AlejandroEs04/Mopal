import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import useApp from '../hooks/useApp'
import QuotationContact from '../components/QuotationContact'

const ProductPage = () => {
  const [product, setProduct] = useState({})

  const { folio } = useParams()
  const { pathname } = useLocation();
  const { productsList } = useApp()

  const handleGetProduct = () => {
    const product = productsList?.filter(product => product?.ID === +folio);
    return product[0]
  }

  useEffect(() => {
    const product = handleGetProduct()
    setProduct(product)
  }, [pathname, productsList])

  console.log(product)

  return (
    <div className="">
      {product?.ImageHeaderURL && (
          <div className="containerCompleteImageBackgound hMainProduct" 
            style={{
              backgroundImage: `url('${product?.ImageHeaderURL}')`
            }}
          >
            <div className='container'>
              <p>{product?.Name}</p>
            </div>
            
          </div>
        )}
      <div className='container my-4'>
        <p className='fw-bold fs-5'>Stock actual: <span className='fw-normal'>{product?.Stock} Piezas</span></p>
        <div className='mb-4'>
          <h1 className='fw-bold'>Especificaciones</h1>
          <p className='text textPrimary fs-5 fw-medium'>{product?.Name}</p>

          <table className='table'>
            <thead>
              <tr>
                <th>Especificación</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {product?.specifications?.map(specification => (
                <tr key={specification.SpecificationID}>
                  <td className='text textPrimary fw-medium'>
                    {specification?.Specification}
                  </td>
                  <td>
                    {specification?.Value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='mb-5'>
          <h1 className='fw-bold'>Caracteristicas y beneficios</h1>
          <p>{product?.Description}</p>
        </div>

        <div>
          <QuotationContact />
        </div>
      </div>
    </div>
  )
}

export default ProductPage