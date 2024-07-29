import React, { useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import actions from '../data/actions';
import ProductTableForm from '../components/ProductTableForm';

const initialState = {
    ID: 0, 
    UserID: 0, 
    ActionID: 1, 
    products: []
}

const CrudRequestPage = () => {
    const [request, setRequest] = useState(initialState);
    const [productFolio, setProductFolio] = useState('');
    const { users } = useAdmin();

    const handleChangeInfo = (e) => {
        const { name, value } = e.target;

        setRequest({
            ...request, 
            [name] : +value
        })
    }

    return (
        <div className="container mt-4">
            <h1>Crear solicitud</h1>
            <p className="mt-3 alert alert-warning">Esta pagina aun se encuentra en desarrollo, aun no se pueden generar solicitudes</p>
            <div className='row mb-4'>
                <div className='col-md-6 col-lg-4'>
                    <label htmlFor="userID" className='form-label'>Usuario</label>
                    <select value={request.UserID} onChange={handleChangeInfo} name="UserID" id="userID" className='form-select'>
                        <option value="0">Seleccione un usuario</option>
                        {users.map(user => user.RolID === 6 && user.Active === 1 && (
                            <option key={user.ID} value={user.ID}>{user.FullName}</option>
                        ))}
                    </select>
                </div>
                
                <div className='col-md-6 col-lg-4'>
                    <label htmlFor="actionID" className='form-label'>Accion</label>
                    <select value={request.ActionID} onChange={handleChangeInfo} name="ActionID" id="actionID" className='form-select'>
                        {actions.map(action => (
                            <option key={action.Id} value={action.Id}>{action.Name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <ProductTableForm 
                productsArray={request.Products}
                setProductsArray={setRequest}
                sale={request}
                setProductFolio={setProductFolio}
                productFolio={productFolio}
            />
        </div>
    )
}

export default CrudRequestPage