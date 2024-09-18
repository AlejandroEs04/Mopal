import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import PaginationList from "../components/PaginationList";
import SearchBar from "../components/SearchBar";
import useApp from "../hooks/useApp";

const AdminSalePage = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [saleFiltered, setSaleFiltered] = useState([])
    const { pathname } = useLocation();
    const { sales, alerta, handleFilter } = useAdmin()
    const { setModalShow, setModalInfo, modalInfo } = useApp();

    const handleGetStatusSales = () => {
        const filtered = sales?.filter(sale => sale.StatusID > 1 && sale.Active === 1)
        return filtered
    }

    const handleFilterArray = (e) => {
        if(+e.target.value === 0 && e.target.name === 'statusID') {
            setSaleFiltered(handleGetStatusSales)
        } else if (+e.target.value === 2 && e.target.name === 'active') {
            const filtered = sales?.filter(sale => sale.StatusID > 1)
            setSaleFiltered(filtered)
        } else {
            let filtered = handleFilter(sales, e.target.name, e.target.value) 
            setSaleFiltered(filtered?.filter(sale => sale.StatusID > 1))
        }
    }

    const handleModalState = () => {
        setModalShow(true)

        setModalInfo({
            ...modalInfo, 
            title: 'Obtener Reporte de ventas', 
            type: 1, 
            text: 'Llena el siguiente formulario para poder obtener el reporte de ventas segun sus filtros'
        })
    }

    useEffect(() => {
        setSaleFiltered(handleGetStatusSales)
    }, [sales])

    return (
        <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h1 className='m-0'>Ventas</h1>
                    {pathname && (
                        <Link to={`${pathname}/form`} className='btnAgregar fs-5'>+ Generar nueva venta</Link>
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
                            <select 
                                name="statusID" 
                                onChange={handleFilterArray} 
                                defaultValue="0"
                                className="form-select form-select-sm" id="status"
                            >
                                <option value="0">Todos</option>
                                <option value="2">Realizada</option>
                                <option value="3">En camino</option>
                                <option value="4">Entregada</option>
                            </select>
                        </div>

                        <div className="col-md-3 col-sm-3 col-xl-2">
                            <label htmlFor="estado">Activo</label>
                            <select 
                                onChange={handleFilterArray} 
                                className="form-select form-select-sm" 
                                id="estado"
                                name="active"
                                defaultValue="1"
                            >
                                <option value="2">Todos</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {alerta && (
                <p className={`alert mt-3 ${alerta.error ? 'alert-warning' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <PaginationList 
                items={saleFiltered.sort((a, b) => b.Folio-a.Folio)}
                type={1}
                limit={15}
                actionStorage={false}
            />
        </div>
    )
}

export default AdminSalePage