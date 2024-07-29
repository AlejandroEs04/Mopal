import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import useAdmin from '../hooks/useAdmin';
import useApp from '../hooks/useApp';

const AdminProductsListPage = () => {
  const [searchBar, setSearchBar] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const { alerta } = useAdmin();
  const { productsList } = useApp();

  return (
    <div className='mt-2'>
      <h1 className='m-0'>Listado de Productos</h1>

      <Link to={`/admin/productsList/form`} className='btnAgregar fs-5'>+ Agregar nuevo listado producto</Link>
      
      <div className='row g-1 mt-2'>
        <div className='col-lg-10 col-md-8'>
          <input value={searchBar} onChange={e => setSearchBar(e.target.value)} type="search" name="" id="seachProduct" className='form-control form-control-sm' placeholder='Buscar un producto' />
        </div>

        <div className="col-lg-2 col-md-4">
          <button
            className='btn btn-secondary w-100 btn-sm'
            onClick={() => setShowDeleted(!showDeleted)}
          >{showDeleted ? 'Ocultar' : 'Mostrar'} inactivos</button>
        </div>
      </div>

      {alerta && (
        <p className={`alert mt-3 ${alerta.error ? 'alert-warning' : 'alert-success'}`}>{alerta.msg}</p>
      )}

      <table className='table table-hover mt-2'>
        <thead className='table-light'>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Clasificacion</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productsList?.map(productList => (
            <tr key={productList.ID}>
              <td>{productList.ID}</td>
              <td>{productList.Name}</td>
              <td>{productList.TypeName}</td>
              <td>{productList.ClassificationName}</td>
              <td>
                <div>
                  <Link to={`/admin/productsList/form/${productList?.ID}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable editar">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </Link>

                  <button 
                    type='button' 
                  >                                            
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProductsListPage