import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import useApp from '../hooks/useApp';
import formatearFecha from '../helpers/formatearFecha';
import getRequestStatusName from '../helpers/getRequestStatusName';
import Scroll from '../components/Scroll';
import Spinner from '../components/Spinner';

const UserInfoRequest = () => {
    const [request, setRequest] = useState();
    const { requests, handleDeteleRequest, loading } = useApp();
    const { id } = useParams();
    const navigation = useNavigate();

    useEffect(() => {
        const requestCurrent = requests?.filter(request => +request.ID === +id)[0];
        setRequest(requestCurrent);
    }, [requests])

    if(loading) {
        return <Spinner />
    }

    return (
        <>
            <div>
                <button className='p-0 mb-2' onClick={() => navigation(-1)}>
                    {'< Volver'}
                </button>
            </div>
        
            <h2>Informacion de la solicitud</h2>

            <div className='row row-md-reverse'>
                <div className='col-md-8'>
                    <p className='fw-medium mb-1'>Fecha de creación: <span className='fw-bold'>{formatearFecha(request?.CreationDate)}</span></p>
                    <p className='fw-medium mb-1'>Estatus: <span className='fw-bold'>{getRequestStatusName(+request?.Status)}</span></p>

                    <h3 className='mt-3'>Informacion de contacto</h3>
                    <p className='fw-medium mb-1'>Nombre: <span className='fw-bold'>{request?.UserFullName}</span></p>
                    <p className='fw-medium mb-1'>Direccion: <span className='fw-bold'>{request?.Address}</span></p>
                    <p className='fw-medium mb-1'>Email: <span className='fw-bold'>{request?.Email}</span></p>
                    <p className='fw-medium mb-1'>Numero: <span className='fw-bold'>{+request?.Number}</span></p>
                    
                    {request?.SupplierID || request?.CustomerID && (
                        <>
                            <h3 className='mt-3'>Informacion de la empresa</h3>
                            {request?.SupplierID && (
                                <>
                                    <p className='fw-medium mb-1'>Nombre: <span className='fw-bold'>{request?.SupplierName}</span></p>
                                    <p className='fw-medium mb-1'>Direccion: <span className='fw-bold'>{request?.SupplierAddress}</span></p>
                                </>
                            )}
                            {request?.CustomerID && (
                                <>
                                    <p className='fw-medium mb-1'>Nombre: <span className='fw-bold'>{request?.CustomerName}</span></p>
                                    <p className='fw-medium mb-1'>Direccion: <span className='fw-bold'>{request?.CustomerAddress}</span></p>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className='col-md-4'>
                    <div className='d-flex justify-content-end'>
                        {request?.Status <= 2 && (
                            <button 
                                className='btn btn-danger w-100 max-w-btn'
                                onClick={() => handleDeteleRequest(id)}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>
            

            <h3 className='mt-4'>Productos solicitados</h3>
            <Scroll>
                <table className='table'>
                    <thead className='table-light'>
                        <tr>
                            <th>Folio</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Grupo de ensamble</th>
                        </tr>
                    </thead>

                    <tbody>
                        {request?.Products.sort((a, b) => b.AssemblyGroup-a.AssemblyGroup).map(product => (
                            <tr key={product.ProductFolio}>
                                <td>{product.ProductFolio}</td>
                                <td>{product.Name}</td>
                                <td>{product.Quantity}</td>
                                <td>{product.AssemblyGroup === 0 ? 'N/A' : product.AssemblyGroup ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Scroll>

        </>
    )
}

export default UserInfoRequest