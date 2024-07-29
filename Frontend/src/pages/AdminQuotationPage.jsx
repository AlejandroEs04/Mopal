import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import Scroll from "../components/Scroll"
import useAdmin from "../hooks/useAdmin"
import DeletePop from "../components/DeletePop"
import SearchBar from "../components/SearchBar"
import QuotationTr from "../components/QuotationTr"
import PaginationList from "../components/PaginationList"

const AdminQuotationPage = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [showPop, setShowPop] = useState(false);
    const [folio, setFolio] = useState(null)
    const [quotationsFiltered, setQuotationsFiltered] = useState([])
    const { pathname } = useLocation();
    const { sales, handleDeleteSale, alerta, handleFilter } = useAdmin();

    const handleBtnDelete = () => {
        handleDeleteSale(folio)
        setFolio(null)
    };

    const handleGetStatusSales = () => {
        const filtered = sales?.filter(sale => sale.StatusID === 1 && sale.Active === 1)
        return filtered
    }

    const handleFilterArray = (e) => {
        if(+e.target.value === 0 && e.target.name === 'statusID') {
            setQuotationsFiltered(handleGetStatusSales)
        } else if (+e.target.value === 2 && e.target.name === 'active') {
            const filtered = sales?.filter(sale => sale.StatusID === 1)
            setQuotationsFiltered(filtered)
        } else {
            let filtered = handleFilter(sales, e.target.name, e.target.value) 
            setQuotationsFiltered(filtered?.filter(sale => sale.StatusID === 1))
        }
    }

    useEffect(() => {
        setQuotationsFiltered(handleGetStatusSales)
    }, [sales])

    return (
        <div className="mt-2">
            <h1 className={`m-0`}>Cotizaciones</h1>
            {pathname && (
                <Link to={`${pathname}/form`} className='btnAgregar fs-5'>+ Generar nueva cotizacion</Link>
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
                items={quotationsFiltered}
                type={1}
                limit={15}
                actionStorage={false}
            /> 

            <DeletePop 
                text={`¿Quieres eliminar la cotizacion con el folio ${folio}?`}
                header="Eliminar cotizacion"
                setFolio={setFolio}      
                show={showPop}
                setShow={setShowPop}
                handleFunction={handleBtnDelete}
            />
        </div>
    )
}

export default AdminQuotationPage