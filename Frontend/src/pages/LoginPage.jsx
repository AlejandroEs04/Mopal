import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import Spinner from '../components/Spinner';

const LoginPage = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [bussiness, setBussiness] = useState("");

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState(null)

  const [newAccount, setNewAccount] = useState(false)

  const { loading, setLoading } = useApp();
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate()

  const handleLogin = async(e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth`, {
        UserName: userName, 
        Password: password
      });

      setAuth(data)

      localStorage.setItem('token', data.token);

      setAlerta(null)

      if(data.RolID >= 1 && data.RolID <= 5) {
        navigate('/admin')
      } else {
        navigate('/inventory')
      }
    } catch (error) {
      setAlerta({
        error: true, 
        msg: error.response.data.msg
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container px-0 my-sm-5 py-sm-4'>
      <div className='d-flex justify-content-center'>
        {newAccount ? (
          <form onSubmit={e => handleLogin(e)} className={`p-5 shadow maxWidthForm bg-light w-100`}>
            <div>
              <h1 className='text-start'>Solicitar Accesso</h1>
              <p>Complete el formulario para solicitad acceso al sistema</p>

              {alerta && (
                <p className='alert alert-danger'>{alerta.msg}</p>
              )}

            </div>

            <label htmlFor="name" className='form-label'>Nombre(s)</label>
            <input type="text" value={name} placeholder='Nombre(s)' onChange={e => setName(e.target.value)} id="nombre" className='form-control' />
            
            <label htmlFor="lastName" className='form-label mt-2'>Apellido(s)</label>
            <input type="text" value={lastName} placeholder='Apellido(s)' onChange={e => setLastName(e.target.value)} id="lastName" className='form-control' />
            
            <label htmlFor="email" className='form-label mt-2'>Correo</label>
            <input type="email" value={email} placeholder='Ej. correo@correo.com' onChange={e => setEmail(e.target.value)} id="email" className='form-control' />
          
            <label htmlFor="bussiness" className='form-label mt-2'>Nombre de la empresa</label>
            <input type="text" value={bussiness} placeholder='Nombre de la empresa' onChange={e => setBussiness(e.target.value)} id="bussiness" className='form-control' />

            <button type='submit' onClick={() => console.log("Enviando")} className='btn bgPrimary mt-3'>Solicitar Acceso</button>

            <p className='mt-3 mb-0'>¿Ya tienes cuenta? <button type='button' className='text-primary px-0' onClick={() => setNewAccount(false)}>Iniciar Sesión</button></p>
            <p className='mt-1'>¿Olvidaste tu password? <Link to={"/"} className='text-primary px-0 text-decoration-none'>Solicitad Cambio</Link></p>
          </form>
        ) : (
          <form onSubmit={e => handleLogin(e)} className={`p-5 shadow maxWidthForm bg-light w-100`}>
            <div>
              <h1 className='text-start'>Iniciar Sesión</h1>
              <p>Ingrese sus licencias para iniciar sesión</p>

              {alerta && (
                <p className='alert alert-danger'>{alerta.msg}</p>
              )}
            </div>
            
            <div className={`d-flex flex-column mt-1`}>
              <label htmlFor="userName" className='form-label'>Nombre de usuario</label>
              <input type="text" value={userName} placeholder='Nombre de usuario' onChange={e => setUserName(e.target.value)} id="userName" className='form-control' />
            </div>
            <div className={`d-flex flex-column mt-2`}>
              <label htmlFor="password" className='form-label'>Contraseña</label>
              <input type="password" value={password} placeholder='Contraseña' onChange={e => setPassword(e.target.value)} id="password" className='form-control' />
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <button type="submit" className={`btnPrimaryBg mt-3`}>Iniciar Sesión</button>
            )}

            <p className='mt-3 mb-0'>¿Aun no tienes cuenta? <button type='button' className='text-primary px-0' onClick={() => setNewAccount(true)}>Solicitar Acceso</button></p>
            <p className='mt-1'>¿Olvidaste tu password? <Link to={"/"} className='text-primary px-0 text-decoration-none'>Solicitad Cambio</Link></p>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage