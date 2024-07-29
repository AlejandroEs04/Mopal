import { Link } from "react-router-dom"
import useApp from '../hooks/useApp';
import { JsonToExcel } from 'react-json-to-excel'
import Scroll from "../components/Scroll";

const AdminTypePage = () => {
  const { types } = useApp();

  return (
    <div className="my-3">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between">
        <div>
          <h1 className="m-0">Tipos</h1>
          <Link to={'form'} className='btnAgregar fs-5'>+ Crear tipo</Link>
        </div>

        <JsonToExcel
          title="Lista de tipos"
          data={types}
          btnClassName={'btn p-1 px-2 mt-2 mt-sm-0'}
          fileName="lista_tipos"
        />
      </div>

      <Scroll>
        <table className="table table-hover mt-2">
          <thead className="table-light">
            <tr>
              <th>Id</th>
              <th>Nombre</th>
            </tr>
          </thead>
            
          <tbody>
            {types?.map(type => (
              <tr>
                <td>{type.ID}</td>
                <td>{type.Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroll>
    </div>
  )
}

export default AdminTypePage