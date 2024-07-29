import { Link, useNavigate } from "react-router-dom"
import getRequestStatusName from "../helpers/getRequestStatusName"

const RequestTr = ({request}) => {
    const navigate = useNavigate()

    return (
        <tr onDoubleClick={() => navigate(`${request.ID}`)}>
            <td>{request.ID}</td>
            <td>{request?.CustomerName ?? request?.SupplierName ?? 'Interno'}</td>
            <td className="text-nowrap">{request.UserFullName}</td>
            <td className="text-nowrap">{request.Email}</td>
            <td
                className={`
                    ${request.Status === 2 && 'text-danger'} 
                    ${request.Status === 3 && 'text-primary'} 
                    ${(request.Status === 4 || request.Status === 5) && 'text-success'} 
                    text-nowrap
                `}
            >
                {getRequestStatusName(request?.Status)}
            </td>
            <td>
                <div className="d-flex justify-content-start gap-2">
                    {request.Status === 1 ? (
                        <Link to={`${request.ID}`} className='btn btn-primary btn-sm text-nowrap'>
                            Ver informacion
                        </Link>
                    ) : (
                        <Link to={`${request.ID}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 iconTable text-dark">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                        </Link>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default RequestTr