import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useApp from '../hooks/useApp';

const InventoryUserInfo = () => {
    const { auth } = useAuth();
    const { user, setUser } = useApp();
    const [userInfo, setUserInfo] = useState(auth);

    const handleChange = (e) => {
        setUserInfo({
            ...user, 
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = () => {
        
    }

    useEffect(() => {
        setUser(auth)
    }, [])

    return (
        <div>
            <h1>Informacion de la cuenta</h1>
            <p>A continuacion de muestra la Informacion relacionada con la cuenta actual, se podra modificar cierta informacion o solicitar algun cambio</p>
        
            <form>
                <div className='row g-2'>
                    <div className='col-sm-6 col-lg-4'>
                        <label htmlFor="name">Nombre</label>
                        <input 
                            type="text"
                            name="Name" 
                            id="name" 
                            disabled
                            className='form-control'
                            value={user.Name}
                            onChange={e => handleChange(e)}
                        />
                    </div>
                    <div className='col-sm-6 col-lg-4'>
                        <label htmlFor="lastName">Apellido(s)</label>
                        <input 
                            type="text"
                            name="LastName" 
                            id="lastName" 
                            disabled
                            className='form-control'
                            value={user.LastName}
                            onChange={e => handleChange(e)}
                        />
                    </div>
                    <div className='col-sm-6 col-lg-4'>
                        <label htmlFor="email">Correo</label>
                        <input 
                            type="text"
                            name="Email" 
                            id="email" 
                            disabled
                            className='form-control'
                            value={user.Email}
                            onChange={e => handleChange(e)}
                        />
                    </div>
                    <div className='col-8'>
                        <label htmlFor="address">Direccion</label>
                        <input 
                            type="text"
                            name="Address" 
                            id="address" 
                            className='form-control'
                            value={user.Address}
                            placeholder='Ej. Aragon 4080, Col. Obispado, Monterrey, Nuevo Leon'
                            onChange={e => handleChange(e)}
                        />
                    </div>
                    <div className='col-sm-6 col-lg-4'>
                        <label htmlFor="Number">Telefono de contacto</label>
                        <input 
                            type="text"
                            name="Number" 
                            id="Number" 
                            placeholder='Ej. 8114567890'
                            className='form-control'
                            value={user.Number}
                            onChange={e => handleChange(e)}
                        />
                    </div>
                    <div className='col-sm-6 col-lg-4'>
                        <label htmlFor="Username">Nombre de usuario</label>
                        <input 
                            type="text"
                            name="UserName" 
                            id="Username" 
                            disabled
                            className='form-control'
                            value={user.UserName}
                            onChange={e => handleChange(e)}
                        />
                    </div>
                </div>

                <div className="d-flex gap-3 mt-2">
                    <button type='submit' className='btn bgPrimary'>Guardar Cambios</button>
                    <button type='button' className='btn btn-dark'>Solicitar Cambios</button>
                </div>
            </form>
        </div>
    )
}

export default InventoryUserInfo