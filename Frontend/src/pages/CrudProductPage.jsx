import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from "axios";
import useApp from "../hooks/useApp";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { toast } from 'react-toastify'

const productInitialState = {
    Folio: '', 
    Name: '', 
    ListPrice : 0, 
    TypeID : 0, 
    Description : '', 
    ClassificationID : 0, 
    StockAvaible : 0, 
    MinStock : 0, 
    MaxStock : 1
}

const CrudProductPage = () => {
    const [product, setProduct] = useState(productInitialState)

    const handleChange = (e) => {
        const { name, value } = e.target
        const isNumber = ['listPrice', 'typeID', 'classificationID', 'stock', 'minStock', 'maxStock'].includes(name)

        setProduct({
            ...product, 
            [name] : isNumber ? +valueTrim : value
        })
    }
    // Inicializar alerta 
    const [alerta, setAlerta] = useState(null);

    // Get informacion
    const { types, classifications, products } = useApp();

    const navigate = useNavigate();
    const { id } = useParams();

    const checkInfo = useCallback(() => {
        return product.Folio === '' ||
            product.Description === '' ||
            product.ListPrice <= 0 ||
            +product.TypeID === 0 ||
            +product.ClassificationID === 0 
    }, [product])

    useEffect(() => {
        checkInfo()
    }, [product])

    const handleAddProduct = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            let response 

            if(id) {
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/products`, { product }, config)
                response = data
            } else {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, { product }, config)
                response = data
            }

            toast.success(response.msg)
            navigate('/admin')
        } catch (error) {
            toast.error(error.response.data.msg)
        }
    }

    useEffect(() => {
        if(id) {
            const productDB = products?.filter(product => product.Folio === id)[0];
            productDB && setProduct(productDB)
        }
    }, [products])

    return (
        <div className="container my-5">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>
            <h2>Crear Producto</h2>
            <p className="mb-3">Ingresa los datos que se solicitan para dar de alta un nuevo producto</p>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <form className="row">
                <div className="col-lg-6 d-flex flex-column gap-3">
                    <Input 
                        label={'Folio'}
                        name={'Folio'}
                        value={product.Folio}
                        handleAction={handleChange}
                        placeholder={'Folio del producto'}
                    />
                    <Input 
                        label={'Name'}
                        name={'Name'}
                        value={product.Name}
                        handleAction={handleChange}
                        placeholder={'Nombre del producto'}
                    />
                    <Textarea 
                        label={'Descripcion'}
                        name={'Description'}
                        value={product.Description}
                        handleAction={handleChange}
                    />
                </div>

                <div className="col-lg-6 d-flex flex-column gap-3">
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <Input 
                                label={'Precio Lista (USD)'}
                                name={'ListPrice'}
                                value={product.ListPrice}
                                handleAction={handleChange}
                                type="number"
                                placeholder={'Precio del producto'}
                            />
                        </div>

                        <div className="col-sm-6">
                            <div className={`d-flex flex-column`}>
                                <label htmlFor="type">Tipo de producto</label>
                                <select value={product.TypeID} name="TypeID" id="type" className="form-select" onChange={handleChange}>
                                <option value="0">SELECCIONE UN TIPO</option>
                                {types?.map(type => (
                                    <option key={type.ID} value={type.ID}>{type.Name}</option>
                                ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className={`d-flex flex-column`}>
                                <label htmlFor="classification">Clasificacion</label>
                                <select value={product.ClassificationID} name="ClassificationID" id="classification" className="form-select" onChange={handleChange}>
                                    <option value="0">SELECCIONE UNA CLASIFICACION</option>
                                    {classifications?.map(classification => (
                                        <option key={classification.ID} value={classification.ID}>{classification.Name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <Input 
                                label={'Stock'}
                                name={'StockAvaible'}
                                value={product.StockAvaible}
                                handleAction={handleChange}
                                type="number"
                                placeholder={'Stock'}
                            />
                        </div>
                        <div className="col-sm-6">
                            <Input 
                                label={'Stock minimo'}
                                name={'MinStock'}
                                value={product.MinStock}
                                handleAction={handleChange}
                                type="number"
                                placeholder={'Stock minimo'}
                            />
                        </div>
                        <div className="col-sm-6">
                            <Input 
                                label={'Stock maximo'}
                                name={'MaxStock'}
                                value={product.MaxStock}
                                handleAction={handleChange}
                                type="number"
                                placeholder={'Stock maximo'}
                            />
                        </div>
                    </div>

                    <div>
                        <button 
                            type="button"
                            className={`btn ${checkInfo() ? 'bgIsInvalid' : 'bgPrimary'} w-100`}
                            disabled={checkInfo()}
                            onClick={() => handleAddProduct()}
                        >Guardar Producto</button>

                        {id && product?.ClassificationID === 1 && (
                            <Link 
                                to="accessory"
                                className={`btn mt-2 btn-secondary w-100`}
                                disabled={checkInfo()}
                            >Configurar Producto</Link>
                        )}
                    </div>

                    
                </div>
            </form>
        </div>
    )
}

export default CrudProductPage