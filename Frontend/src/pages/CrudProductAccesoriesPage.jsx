import { useParams, useNavigate } from "react-router-dom"
import useApp from "../hooks/useApp"
import Select from 'react-select'
import { useEffect, useState } from "react"
import useAdmin from "../hooks/useAdmin"
import axios from "axios"

const CrudProductAccesoriesPage = () => {
  const [product, setProduct] = useState({})
  const [accesories, setAccesories] = useState([]);
  const [accesoriesNew, setAccesoriesNew] = useState([]);
  const [accesoriesOptions, setAccesoriesOptions] = useState({}); 
  const [accesorySelected, setAccesorySelected] = useState(null)
  const { products } = useApp();
  const { alerta, setAlerta } = useAdmin();
  const { id } = useParams()

  const navigate = useNavigate()

  const handleChangeAccesorySelected = (selected) => {
    setAccesorySelected(selected)
  }

  const handleAddProductArray = (accesoryFolio) => {
    const newAccesory = products?.filter(accesory => accesory.Folio === accesoryFolio)[0];

    const existAccesoriy = product?.accessories?.filter(accesory => accesory.Folio === newAccesory.Folio)

    if(existAccesoriy.length > 0) {
      setAlerta({
        error: true, 
        msg: "El accesorio ya existe"
      })
    } else {
      setAccesoriesNew([
        ...accesoriesNew, 
        {
          ProductFolio : id,
          AccessoryFolio : newAccesory.Folio,
          Name : newAccesory.Name,
          Quantity : null,
          Piece : null
        }
      ]);
    }
  }

  const removeAccessory = (folio) => {
    setAccesoriesNew(accesoriesNew.filter(accessory => accessory.AccessoryFolio !== folio))
  }

  const addNewAccesory = async() => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${id}/accesories`, { accesories : accesoriesNew }, config);
      
      setAlerta({
        error : false, 
        msg : data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)

      setAccesoriesNew([])
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAccesory = async(accesoryFolio) => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}/accesories/${accesoryFolio}`, config);
      
      setAlerta({
        error : false, 
        msg : data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const accesoriesArray = products?.filter(product => product.ClassificationID === 2);
    const productCurrent = products?.filter(product => product.Folio === id);
    setAccesories(accesoriesArray)
    setProduct(productCurrent[0])
  }, [products, ])

  useEffect(() => {
    const options = accesories?.map(accesory => {
      const accesorieItem = {
        value : accesory.Folio, 
        label : `${accesory.Folio} - ${accesory.Name}`
      }

      return accesorieItem
    })

    setAccesoriesOptions(options)
  }, [accesories])

  return (
    <div className='my-4'>
      <button onClick={() => navigate(-1)} className="backBtn mt-1 p-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        
        <p>Back</p>
      </button>

      <h1 className="fw-light mt-3">Configura la pieza <span className="fw-medium">{id}</span></h1>
      <p>Selecciona los accesorios que puede tener un producto</p>

      {alerta && (
        <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
      )}

      <div className="d-flex gap-2">
        <Select 
          options={accesoriesOptions}
          value={accesorySelected}
          onChange={handleChangeAccesorySelected}
          className="w-100"
        />

        <button onClick={() => handleAddProductArray(accesorySelected.value)} disabled={!accesorySelected} className="btn btn-secondary">Agregar</button>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h3 className="fw-normal m-0">Lista de accesorios</h3>
        {accesoriesNew?.length > 0 && (
          <div>
            <button onClick={() => addNewAccesory()} className="btn btn-sm btn-success">Guardar</button>
          </div>
        )}
      </div>
      
      {accesoriesNew?.length > 0 | product?.accessories?.length > 0 ? (
        <table className="table table-hover">
          <thead className="table-secondary">
            <tr>
              <th>Folio</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {accesoriesNew.map(accesory => (
            <tr key={accesory.AccessoryFolio}>
              <td>{accesory?.AccessoryFolio}</td>
              <td>{accesory?.Name}</td>
              <td>
                <div>
                  <button
                    onClick={() => removeAccessory(accesory.AccessoryFolio)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {product?.accessories?.map(accesory => (
            <tr key={accesory.Folio}>
              <td>{accesory?.Folio}</td>
              <td>{accesory?.Name}</td>
              <td>
                <div>
                  <button
                    onClick={() => deleteAccesory(accesory.Folio)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </table>
      ) : (
        <h4>No hay accesorios dados de alta</h4>
      )}
    </div>
  )
}

export default CrudProductAccesoriesPage