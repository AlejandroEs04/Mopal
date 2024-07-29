import { useEffect, useState } from 'react'
import axios from 'axios';
import useApp from '../hooks/useApp'
import motivos from '../data/motivos';
import Spinner from '../components/Spinner';

const ContactoPage = () => {
  const [stock, setStock] = useState(null);
  const [email, setEmail] = useState(null);
  const [bussinessName, setBussinessName] = useState(null);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [motivo, setMotivo] = useState(null);
  const [motivoId, setMotivoId] = useState(null);
  const [detalles, setDetalles] = useState(null);
  const { folio, quantity, setFolio, products, alerta, setAlerta, handleChangeQuantity, loading, setLoading } = useApp();

  const handleSetStock = () => {
    const product = products?.filter(product => product.Folio === folio);
    setStock(product[0]?.Stock)
  }

  const handleSendMsg = async() => {
    const emailData = {
      email, 
      bussinessName, 
      name, 
      lastName, 
      motivo : motivo.name, 
      folio, 
      quantity, 
      detalles
    }

    try {
      setLoading(true)

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, emailData);
      setAlerta({
        error: false, 
        msg : data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSetStock()
  }, [folio])

  return (
    <div className='container my-5'>
      <div className="row">
        <div className="col-lg-6 p-4">
          <h1>Contacto</h1>

          {alerta && (
            <p className={`alert my-3 ${alerta.error ? 'alert-warning' : 'alert-success'}`}>{alerta.msg}</p>
          )}

          {loading ? (
            <Spinner />
          ) : (
            <form>
              <div className="row">
                <div className="d-flex flex-column col-12">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Ej. correo@correo.com' 
                    className='form-control' 
                    required 
                  />
                </div>

                <div className="d-flex flex-column col-12 mt-2">
                  <label htmlFor="empresa">Nombre de la empresa</label>
                  <input 
                    type="text" 
                    id="empresa" 
                    value={bussinessName}
                    onChange={e => setBussinessName(e.target.value)}
                    placeholder='Nombre de la empresa' 
                    className='form-control' 
                    required 
                  />
                </div>

                <div className="d-flex flex-column col-md-6 mt-2">
                  <label htmlFor="name">Nombre</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder='Nombre' 
                    className='form-control' 
                    required 
                  />
                </div>

                <div className="d-flex flex-column col-md-6 mt-2">
                  <label htmlFor="LastName">Apellido</label>
                  <input 
                    type="text" 
                    id="LastName" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder='Apellido' 
                    className='form-control' 
                    required 
                  />
                </div>
                
                <div className="d-flex flex-column col-12 mt-2">
                  <label htmlFor="motivo">Motivo</label>
                  <select id="motivo" value={motivo} onChange={e => setMotivo(e.target.value)} className='form-select'>
                    <option value="">Ninguno en especial</option>
                    {motivos.map(motivo => (
                      <option key={motivo.Id} value={motivo.Name}>{motivo.Name}</option>
                    ))}
                  </select>
                </div>

                {motivo?.includes('cotizacion') && (
                  <>
                    <div className="d-flex flex-column col-md-6 mt-2">
                      <label htmlFor="producto">Producto de interes</label>
                      <select 
                        value={folio} 
                        onChange={(e) => {
                          setFolio(e.target.value)
                          handleSetStock()
                        }} 
                        id="producto" 
                        className='form-select'
                      >
                        <option value="">Ninguno en especial</option>
                        {products?.map(product => (
                          <option value={product.Folio} key={product.Folio}>{product.Name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="d-flex flex-column col-md-6 mt-2">
                      <label htmlFor="quantity">Cantidad</label>
                      <input type="number" value={quantity} onChange={e => handleChangeQuantity(e.target.value, stock)} id="quantity" placeholder='Cantidad' className='form-control' required />
                    </div>
                  </>  
                )}
                

                
                <div className="d-flex flex-column col-12 mt-2">
                  <label htmlFor="detalles">Solicitar detalles</label>
                  <textarea id="detalles" value={detalles} onChange={e => setDetalles(e.target.value)} className='form-control' rows={5}></textarea>
                </div>
              </div>
              <button type="button" onClick={() => handleSendMsg()} className='btnPrimaryBg w-100 mt-3'>Enviar</button>
            </form>
          )}
        </div>
        <div className='col-lg-6'>
          <div className="bg-light shadow rounded p-4 d-flex flex-column justify-content-center text-center">
            <h3 className='fw-bold'>"Estamos para apoyarte, gracias por comunicarte con nosotros!"</h3>
            <p>Responderemos a su mensaje en la mayor brevedad</p>

            <div className='px-5 pt-3'>
              <a href="https://api.whatsapp.com/send?phone=528121523307&text=Me%20interesa%20informaci%C3%B3n%20acerca%20de%20Mopal%20Grupo." className='text-dark urlImage'>
                <i className="fa-brands fa-whatsapp"></i>
                <p className='m-0 fw-medium fs-5'>Tambien puedes comunidarte por whatsapp, solo haz click aqui</p>
              </a>
            </div>
            
            <ul className='lstServices list-group px-5 mt-5'>
              <li><i className="fa-solid fa-check"></i> SOLUCIONES DE AUTOMATIZACIÓN INDUSTRIAL</li>
              <li><i className="fa-solid fa-check"></i> VÁLVULAS INDUSTRIALES DE LA MEJOR CALIDAD</li>
              <li><i className="fa-solid fa-check"></i> DISTRIBUIDORES AUTORIZADOS DE MARCAS INTERNACIONALES</li>
              <li><i className="fa-solid fa-check"></i> EXCELENCIA EN SERVICIO</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactoPage