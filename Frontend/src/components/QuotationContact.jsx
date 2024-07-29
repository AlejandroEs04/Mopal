import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApp from '../hooks/useApp';

const QuotationContact = () => {
    const [productFolio, setProductFolio] = useState('');
    const [email, setEmail] = useState(null);
    const [bussinessName, setBussinessName] = useState(null);
    const [name, setName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [motivo, setMotivo] = useState(null);
    const [detalles, setDetalles] = useState(null);
    const { products } = useApp();

    const { folio } = useParams();

    useEffect(() => {
        if(folio) {
            setProductFolio(folio)
        }
    }, [])

    return (
        <div className='bg-light p-4 rounded shadow'>
            <h2 className='text textPrimary'>Solicita Cotización</h2>
            <p>Ingresa la información que se te pide para realiza la Cotización</p>

            <form className='row g-3'>
                <div className='col-lg-4 col-md-12'>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        className='form-control' 
                        placeholder='Ej. correo@correo.com'
                    />
                </div>

                <div className='col-lg-4 col-md-6'>
                    <label htmlFor="name">Nombre</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        className='form-control' 
                        placeholder='Nombre'
                    />
                </div>

                <div className='col-lg-4 col-md-6'>
                    <label htmlFor="lastName">Apellido(s)</label>
                    <input 
                        type="text" 
                        name="lastName" 
                        id="lastName" 
                        className='form-control' 
                        placeholder='Apellido(s)'
                    />
                </div>

                <div className='col-md-4'>
                    <label htmlFor="bussinesName">Nombre de la empresa</label>
                    <input 
                        type="text" 
                        name="bussinesName" 
                        id="bussinesName" 
                        className='form-control' 
                        placeholder='Nombre de la empresa'
                    />
                </div>

                <div className='col-md-4'>
                    <label htmlFor="product">Producto de interes</label>
                    <select name="" id="product" className='form-select'>
                        <option value="0">Ninguno en especial</option>
                        {products?.map(product => (
                            <option key={product.Folio} value={product.Folio}>{product.Name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label htmlFor="quantity">Cantidad</label>
                    <input type="number" name="" id="quantity" className='form-control' placeholder='Cantidad' />
                </div>

                <div className="col">
                    <button className='btn bgPrimary'>Enviar cotizacion</button>
                </div>
                
            </form>
        </div>
  )
}

export default QuotationContact