import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import useAdmin from "../hooks/useAdmin"
import Scroll from "./Scroll"
import Spinner from "./Spinner"
import DeletePop from "./DeletePop"
import formatearFechaInput from "../helpers/formatearFechaInput"
import { toast } from "react-toastify"

const TablePurchases = ({ purchase, startIndex, endIndex, actionStorage = false }) => {
  const [showPop, setShowPop] = useState(false);
  const [folio, setFolio] = useState(null)
  
  const { handleChangeStatus, loading } = useAdmin()
  const { pathname } = useLocation();

  const navigate = useNavigate()

  const handleDeletePurchase = async() => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/purchases/${folio}`, config)
      toast.success(data.msg)
      setFolio(null)
    } catch (error) {
      toast.error(error.response.data.msg)
    }
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Scroll>
          <table className="table table-hover mb-2">
            <thead className="table-light">
              <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>Usuario</th>
                <th>Status</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {purchase.length === 0 && (
                <tr>
                  <td colSpan="6">No hay compras pendientes por recibir</td>
                </tr>
              )}
              {purchase?.slice(startIndex, endIndex).sort((a,b) => b.Folio-a.Folio).map(Purchase => (
                <tr onDoubleClick={() => navigate(`/info/purchases/${Purchase.Folio}`)} key={Purchase.Folio}>
                  <td>{Purchase.Folio}</td>
                  <td>{formatearFechaInput(Purchase.PurchaseDate)}</td>
                  <td className="text-nowrap">{Purchase.BusinessName}</td>
                  <td className="text-nowrap">{Purchase.User}</td>
                  <td className={`${Purchase.Status === 'Realizada' ? 'text-warning' : 'text-success'}`}>{Purchase.Status}</td>
                  <td className={`${Purchase.Active === 1 ? 'text-success' : 'text-danger'}`}>{Purchase.Active === 1 ? 'Activo' : 'Inactivo'}</td>
                  {!actionStorage && (
                    <td>
                      <div className="d-flex justify-content-start gap-2">
                        <Link to={`/info/purchases/${Purchase.Folio}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 iconTable text-dark">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                          </svg>
                        </Link>

                        <Link to={`${pathname}/form/${Purchase.Folio}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable editar">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>

                        <button
                          onClick={() => {
                            setShowPop(true)
                            setFolio(Purchase.Folio)
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}

                  {actionStorage && (
                      <td>
                          <div className="d-flex gap-2">
                              <Link to={`/info/purchases/${Purchase.Folio}`} className="btn btn-sm btn-primary text-nowrap">Ver informacion</Link>
                              <button onClick={() => handleChangeStatus('purchases', Purchase?.Folio, (Purchase?.StatusID + 1))} className="btn btn-sm btn-success text-nowrap">Recibida</button>
                          </div>
                      </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Scroll>
      )}

      <DeletePop 
        text={`¿Quieres eliminar la compra con el folio ${folio}?`}
        header="Eliminar compra"
        setFolio={setFolio}      
        show={showPop}
        setShow={setShowPop}
        handleFunction={handleDeletePurchase}
      />
    </>
  )
}

export default TablePurchases