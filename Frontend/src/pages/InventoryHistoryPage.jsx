import formatearFecha from '../helpers/formatearFecha'
import Scroll from '../components/Scroll'
import useApp from '../hooks/useApp'
import { Link } from 'react-router-dom'
import getRequestStatusName from '../helpers/getRequestStatusName'

const InventoryHistoryPage = () => {
  const { language, requests } = useApp()

  const getProductsQuantity = (array) => {
    return array.reduce((total, product) => total + product.Quantity, 0);
  }

  return (
    <div>
      <h2>{language ? 'Requests History' : 'Historial de solicitudes'}</h2>

      <Scroll>
        
        <table className='table table-hover mt-3'>
          <thead className='table-light'>
            <tr>
              <th>ID</th>
              <th>{language ? 'Creation date' : 'Fecha de creación'}</th>
              <th>{language ? 'Status' : 'Estatus'}</th>
              <th>{language ? 'Products' : 'Productos'}</th>
              <th>{language ? 'Products Quantity' : 'Cantidad de productos'}</th>
              <th>{language ? 'Actions' : 'Acciones'}</th>
            </tr>
          </thead>

          <tbody>
            {requests?.map(request => (
              <tr key={request.ID}>
                <td>{request.ID}</td>
                <td>{formatearFecha(request.CreationDate)}</td>
                <td>
                  <div className='d-flex gap-2 align-items-center justify-content-between'>
                    <p 
                      className={`
                        m-0
                        ${request.Status === 1 && 'text-danger'}
                        ${request.Status === 2 && 'text-primary'}
                        ${request.Status === 3 && 'text-warning'}
                        ${request.Status === 4 && 'text-success'}
                      `}
                    >
                      {getRequestStatusName(request.Status)}
                    </p>

                    <div 
                      className={`
                        circle
                        ${request.Status === 1 && 'bg-danger'}
                        ${request.Status === 2 && 'bg-primary'}
                        ${request.Status === 3 && 'bg-warning'}
                        ${request.Status === 4 && 'bg-success'}
                      `}
                    ></div>
                  </div>
                </td>
                <td>{request.Products.length}</td>
                <td>{getProductsQuantity(request.Products)}</td>
                <td>
                  <div>
                    <Link to={`${request.ID}`} className='btn btn-sm bgPrimary'>Ver información</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroll>
    </div>
  )
}

export default InventoryHistoryPage