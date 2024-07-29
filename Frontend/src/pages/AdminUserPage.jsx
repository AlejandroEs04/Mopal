import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import useAdmin from "../hooks/useAdmin"
import useApp from "../hooks/useApp"
import Scroll from "../components/Scroll"
import DeletePop from "../components/DeletePop"
import Spinner from "../components/Spinner"

export const UserTr = ({user, setId, setShow, show}) => {
  const { pathname } = useLocation();
  const { setLoading, setAlerta } = useApp();

  const handleRecoveryUser = async(id) => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      setLoading(true)
      const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/users/recovery/${id}`, config);
      console.log(data)
      setAlerta({
        error: false, 
        msg : data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)
    } catch (error) {
      console.log(error)
      setAlerta({
        error: true, 
        msg : error.response.data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr>
      <td>{user.ID}</td>
      <td className="text-nowrap">{user.FullName}</td>
      <td>{user.UserName}</td>
      <td>{user.Email}</td>
      <td>{user.Number ?? 'N/A'}</td>
      <td>{user.RolName}</td> 
      <td className={`${user.Active === 1 ? 'text-success' : 'text-danger'}`}>{user.Active === 1 ? 'Activo' : 'Inactivo'}</td>
      <td>
        <div className="d-flex justify-content-start gap-2">
          <Link to={`${pathname}/form/${user.ID}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable editar">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </Link>

          {user.Active === 1 ? (
            <button
              onClick={() => {
                setId(user.ID)
                setShow(!show)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                handleRecoveryUser(user.ID);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable text-success">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          )}

        </div>
      </td>
    </tr>
  )
}

const AdminUserPage = () => {
  const [show, setShow] = useState(false);
  const [showInactive, setShowInactive] = useState(false)
  const [id, setId] = useState(null);
  const { users } = useAdmin();
  const { loading, setLoading, alerta, setAlerta } = useApp();
  

  const handleDeleteUser = async() => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      setLoading(true)
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, config);
      setAlerta({
        error: false, 
        msg : data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)
    } catch (error) {
      setAlerta({
        error: true, 
        msg : error.response.data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mt-2'>
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <h1 className='m-0'>Usuarios</h1>
          <Link to={`/admin/users/form`} className='btnAgregar fs-5'>+ Agregar nuevo usuario</Link>
        </div>

        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowInactive(!showInactive)}>{showInactive ? 'Ocultar' : 'Mostrar'} Inactivos</button>
        </div>
      </div>

      {alerta && (
        <p className={`alert mt-3 ${alerta.error ? 'alert-warning' : 'alert-success'}`}>{alerta.msg}</p>
      )}
      
    
      {loading ? (
        <Spinner />
      ) : (
        <Scroll>
          {users?.length > 0 ? (
            <table className="table table-hover mt-3 mb-2">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Numero</th>
                  <th>Rol</th>
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users?.map(user => user.Active === 1 && (
                  <UserTr 
                    key={user.ID}
                    setId={setId}
                    setShow={setShow}
                    show={show}
                    user={user}
                  />
                ))}

                {showInactive && users?.map(user => user.Active === 0 && (
                  <UserTr 
                    user={user}
                    key={user.ID}
                    setId={setId}
                    setShow={setShow}
                    show={show}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <h3 className='fw-bold text-center mt-3'>Aun no hay proveedores dados de alta</h3>
            </div>
          )}
        </Scroll>
      )}

      <DeletePop 
        header="Deshabilitar Usuario"
        text="¿Seguro quieres deshabilitar al usuario?"
        handleFunction={handleDeleteUser}
        setFolio={setId}
        show={show}
        setShow={setShow}
      />
    </div>
  )
}

export default AdminUserPage