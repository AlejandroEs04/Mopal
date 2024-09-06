import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import PaginationList from "../components/PaginationList";
import SearchBar from "../components/SearchBar";
import useApp from "../hooks/useApp";

const AdminPurchasePage = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [active, setActive] = useState(1)
    const [status, setStatus] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [purchaseFiltered, setPurchaseFiltered] = useState([])

    const { pathname } = useLocation();
    const { purchases, alerta, handleFilter } = useAdmin()
    const { setModalShow, setModalInfo, modalInfo } = useApp()

    const handleFilterArray = (e) => {
        const filtered = handleFilter(purchases, e.target.name, e.target.value)
        setPurchaseFiltered(filtered)
    }

    const handleModalState = () => {
        setModalShow(true)

        setModalInfo({
            ...modalInfo, 
            title: 'Obtener Reporte de compras', 
            type: 2, 
            text: 'Llena el siguiente formulario para poder obtener el reporte de compras segun sus filtros'
        })
    }
    
    useEffect(() => {
        if(searchText !== "") {
            const filtered = purchases?.filter(purchase => {
                const folioMatch = purchase?.Folio?. toString().toLowerCase().includes(searchText?.toLowerCase());
                const supplierMatch = purchase?.BusinessName?.toLowerCase().includes(searchText?.toLowerCase());
                const userMatch = purchase?.User?.toLowerCase().includes(searchText?.toLowerCase());

                return supplierMatch || userMatch || folioMatch
            });

            setPurchaseFiltered(filtered)
        } else {
            setPurchaseFiltered(purchases)
        }
    }, [searchText])

    useEffect(() => {
        if(+active === 2) {
            setPurchaseFiltered(purchases)
        } else {
            const filtered = purchases?.filter(purchase => purchase.Active === +active)
            setPurchaseFiltered(filtered)
        }
    }, [active])
    
    useEffect(() => {
        if(+status === 0) {
            setPurchaseFiltered(purchases)
        } else {
            const filtered = purchases?.filter(purchase => purchase.StatusID === +status)
            setPurchaseFiltered(filtered)
        }
    }, [status])
    
    useEffect(() => {
        const filtered = purchases?.filter(purchase => purchase.Active === 1)
        setPurchaseFiltered(filtered)
    }, [purchases])

    return (
        <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h1 className='m-0'>Compras</h1>
                    {pathname && (
                        <Link to={`form`} className='btnAgregar fs-5'>+ Generar nueva compra</Link>
                    )}
                </div>
                
                <div>
                    <button
                        onClick={() => handleModalState()}
                        className="btn btn-primary btn-sm"
                    >
                        Obtener Reporte
                    </button>
                </div>
            </div>

            <SearchBar 
                handleFunction={handleFilterArray}
                setShowFilters={setShowFilters}
                showFilters={showFilters}
            />
            
            <div className="mb-3 mt-2">
                {showFilters && (
                    <div className="row mt-2">
                        <div className="col-md-3 col-sm-3 col-xl-2">
                            <label htmlFor="status">Estatus</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="form-select form-select-sm" id="status">
                                <option value="0">Todos</option>
                                <option value="1">Generada</option>
                                <option value="2">Recibida</option>
                            </select>
                        </div>

                        <div className="col-md-3 col-sm-3 col-xl-2">
                            <label htmlFor="estado">Activo</label>
                            <select value={active} onChange={e => setActive(e.target.value)} className="form-select form-select-sm" id="estado">
                                <option value="2">Todos</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {alerta && (
                <p className={`alert mt-3 ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <PaginationList 
                items={purchaseFiltered.sort((a,b) => b.Folio-a.Folio)}
                type={2}
                limit={15}
                actionStorage={false}
            />
        </div>
    )
}

export default AdminPurchasePage