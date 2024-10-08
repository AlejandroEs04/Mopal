import { Link, useNavigate } from 'react-router-dom'
import Scroll from './Scroll'
import getRequestStatusName from '../helpers/getRequestStatusName'

const TableRequest = ({ items, startIndex, endIndex, actionStorage = false }) => {
  const navigate = useNavigate()

  return (
    <Scroll>
      <table className='table table-hover mb-2'>
        <thead className='table-light'>
          <tr>
            <th>ID</th>
            <th>Empresa</th>
            <th>Usuario</th>
            <th>Contacto</th>
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="6">No hay solicitudes pendientes por entregar</td>
              </tr>
            )}
            {items?.slice(startIndex, endIndex).map(requestInfo => (
              <tr onDoubleClick={() => navigate(`/admin/request/${requestInfo.ID}`)} key={requestInfo.ID}>
                <td>{requestInfo.ID}</td>
                <td>{requestInfo?.CustomerName ?? requestInfo?.SupplierName ?? 'Interno'}</td>
                <td className="text-nowrap">{requestInfo.UserFullName}</td>
                <td className="text-nowrap">{requestInfo.Email}</td>
                <td className={`
                  ${requestInfo.Status === 1 && 'text-danger'}
                  ${requestInfo.Status === 2 && 'text-danger'}
                  ${requestInfo.Status === 3 && 'text-warning'}
                  ${(requestInfo.Status === 4 || requestInfo.Status === 5) && 'text-success'}
                  text-nowrap
                `}>
                  {getRequestStatusName(requestInfo.Status)}
                </td>
                <td>
                    <div className="d-flex justify-content-start gap-2">
                        <Link to={`/admin/request/${requestInfo.ID}`} className='btn btn-primary btn-sm text-nowrap'>
                          Ver informacion
                        </Link>
                    </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Scroll>
  )
}

export default TableRequest