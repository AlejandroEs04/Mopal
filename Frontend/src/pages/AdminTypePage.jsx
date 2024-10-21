import { Link } from "react-router-dom"
import useApp from '../hooks/useApp';
import { JsonToExcel } from 'react-json-to-excel'
import Scroll from "../components/Scroll";

const AdminTypePage = () => {
  const { types } = useApp();

  return (
    <div className="my-2">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between">
        <div>
          <h1 className="m-0">Tipos</h1>
          <Link to={'form'} className='btnAgregar fs-5'>+ Agregar nuevo tipo</Link>
        </div>

        <div id="btnContainer">
          <JsonToExcel
            title="Lista de tipos"
            data={types}
            btnClassName={'btn-styles'}
            fileName="lista_tipos"
          />
        </div>
      </div>

      <Scroll>
        <table className="table table-hover mt-2">
          <thead className="table-light">
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
            
          <tbody>
            {types?.map(type => (
              <tr key={type.ID}>
                <td>{type.ID}</td>
                <td>{type.Name}</td>
                <td>
                  <div className="d-flex justify-content-end">
                    <Link to={`form/${type.ID}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 iconTable text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </Link>

                    {/* <button 
                      type='button' 
                      onClick={() => {
                        console.log('Eliminando...')
                      }}
                    >                                            
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroll>
    </div>
  )
}

export default AdminTypePage