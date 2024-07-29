import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useApp from '../hooks/useApp'
import axios from 'axios';
import useAdmin from '../hooks/useAdmin';
import ProductViewForm from '../components/ProductViewForm';

const CrudProductListPage = () => {
    const [productList, setProductList] = useState({
        ID: 0,
        Name: '', 
        ImageHeaderURL: '', 
        ImageIconURL: '', 
        TypeID: 0, 
        ClassificationID: 0
    })
    const { types, classifications, productsList } = useApp();
    const { alerta, setAlerta } = useAdmin()

    const { id } = useParams();

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target
        const isNumber = ['ID', 'TypeID', 'ClassificationID'].includes(name)

        setProductList({
            ...productList, 
            [e.target.name] : isNumber ? +value : value
        })
    }

    const handleChangeNoInput = (element, value) => {
        setProductList({
            ...productList, 
            [element] : value 
        })
    }

    const handleSaveProducto = async(e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = axios.post(`${import.meta.env.VITE_API_URL}/api/productsList`, { productList }, config)
            setAlerta({
                error: false, 
                msg: data.msg
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(id) {
            const product = productsList?.filter(productList => productList.ID === +id)[0]
            setProductList(product)
        }
    }, [productList])

    return (
        <div className='container my-5'>
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <h2>Crear un listado de Productos</h2>
            <p className='mb-1'>Ingresa los datos que se solicitan para dar de alta un nuevo listado de productos</p>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}
            
            <form 
                className='row g-3 mt-3'
                onSubmit={e => handleSaveProducto(e)}
            >
                <div>
                    <label htmlFor="name" className='form-label'>Nombre</label>
                    <input 
                        type="text" 
                        name="Name" 
                        id="name" 
                        className='form-control' 
                        placeholder='Nombre del producto'
                        value={productList?.Name}
                        onChange={e => handleChange(e)}
                    />
                </div>

                <div className='col-md-6'>
                    <label htmlFor="type" className='form-label'>Tipo</label>
                    <select 
                        name="TypeID" 
                        id="type"
                        className='form-select'
                        value={productList?.TypeID}
                        onChange={e => handleChange(e)}
                    >
                        <option value="0">Seleccione un tipo</option>
                        {types?.map(type => (
                            <option key={type.ID} value={type.ID}>{type.Name}</option>
                        ))}
                    </select>
                </div>

                <div className='col-md-6'>
                    <label htmlFor="classification" className='form-label'>Clasificación</label>
                    <select 
                        name="ClassificationID" 
                        id="classification"
                        className='form-select'
                        value={productList?.ClassificationID}
                        onChange={e => handleChange(e)}
                    >
                        <option value="0">Seleccione una clasificación</option>
                        {classifications?.map(classification => (
                            <option key={classification.ID} value={classification.ID}>{classification.Name}</option>
                        ))}
                    </select>
                </div>

                <div className='col-md-6'>
                    <input type="submit" value="Guardar Producto" className='btn btn-dark w-100' />
                </div>
            </form>

            <form>
                {id && (
                    <div className="mt-5">
                        {alerta && (
                            <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
                        )}
                        <div>
                            <ProductViewForm 
                                productList={productList}
                                handleChangeNoInput={handleChangeNoInput}
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default CrudProductListPage