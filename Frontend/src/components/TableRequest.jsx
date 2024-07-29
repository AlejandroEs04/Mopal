import { Link, useNavigate } from 'react-router-dom'
import Scroll from './Scroll'

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
            {items?.slice(startIndex, endIndex).map(requestInfo => requestInfo.Status === 2 && (
              <tr onDoubleClick={() => navigate(`/admin/request/${requestInfo.ID}`)} key={requestInfo.ID}>
                <td>{requestInfo.ID}</td>
                <td>{requestInfo?.CustomerName ?? requestInfo?.SupplierName ?? 'Interno'}</td>
                <td className="text-nowrap">{requestInfo.UserFullName}</td>
                <td className="text-nowrap">{requestInfo.Email}</td>
                <td className={`text-danger text-nowrap`}>En espera</td>
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