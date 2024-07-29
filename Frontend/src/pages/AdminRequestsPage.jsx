import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Scroll from '../components/Scroll'
import useAdmin from '../hooks/useAdmin'
import RequestTr from '../components/RequestTr';
import SearchBar from '../components/SearchBar';
import PaginationList from '../components/PaginationList';

const AdminRequestsPage = () => {
    const [requestFiltered, setRequestFiltered] = useState([])
    const [showPendingRequest, setShowPendingRequest] = useState(true)
    const [pendingRequest, setPendingRequest] = useState([])
    const [showFilters, setShowFilters] = useState(false)
    const { request, alerta, handleFilter } = useAdmin();

    const handleFilterArray = (e) => {
        if(+e.target.value === 0 && e.target.name === 'statusID') {
            setRequestFiltered(request.filter(item => item.Status > 1))
        } else {
            const filtered = handleFilter(request, e.target.name, e.target.value, 'request')
            setRequestFiltered(filtered.filter(item => item.Status > 1))
        }
    }

    useEffect(() => {
        const requestFilter = request?.filter(request => request.Status !== 1);
        const pendingRequest = request?.filter(request => request.Status === 1);
        setPendingRequest(pendingRequest)
        setRequestFiltered(requestFilter);
    }, [request, ])

    return (
        <div className='mt-2'>
            {pendingRequest.length > 0 && (
                <>
                    <div className='d-flex align-items-center justify-content-between mt-4 mb-2'>
                        <h2 className='m-0'>Pendientes</h2>
                        <div>
                            <button className='btn btn-secondary' onClick={() => setShowPendingRequest(!showPendingRequest)} >{showPendingRequest ? 'Ocultar' : 'Mostrar'}</button>
                        </div>
                    </div>
            
                    {showPendingRequest && (
                        <Scroll>
                            <table className='table table-hover'>
                                <thead className="table-light">
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
                                    {request?.sort((a, b) => a.ID-b.ID).map(requestInfo => requestInfo.Status === 1 && (
                                        <RequestTr 
                                            key={requestInfo.ID}
                                            request={requestInfo}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </Scroll>
                    )}
                    
                </>
            )}
            <h1 className='m-0 mt-2 pt-2'>Solicitudes</h1>
            {/* <Link to={'form'}>Agregar solicitud</Link> */}
            
            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} fw-bold`}>{alerta.msg}</p>
            )}

            <div className="mt-2 mb-3">
                <SearchBar 
                    handleFunction={handleFilterArray}
                    setShowFilters={setShowFilters}
                    showFilters={showFilters}
                />

                {showFilters && (
                    <div className="row mt-2">
                        <div className="col-md-3 col-sm-3 col-xl-2">
                            <label htmlFor="status">Estatus</label>
                            <select onChange={handleFilterArray} name='statusID' className="form-select form-select-sm" id="status">
                                <option value="0">Todos</option>
                                <option value="2">Aceptada</option>
                                <option value="3">En camino</option>
                                <option value="4">Entregada</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>


            <PaginationList 
                items={requestFiltered}
                type={3}
                limit={15}
                actionStorage={false}
            />
        </div>
    )
}

export default AdminRequestsPage