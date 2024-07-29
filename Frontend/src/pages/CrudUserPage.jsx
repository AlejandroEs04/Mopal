import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom"
import useAdmin from "../hooks/useAdmin";
import Select from 'react-select';
import useApp from "../hooks/useApp";
import Spinner from "../components/Spinner";
import generatePSWD from "../helpers/generarPassword";

const CrudUserPage = () => {
  const [selectedSupplierOption, setSelectedSupplierOption] = useState(null)
  const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)
  const [userType, setUserType] = useState(0)
  const [disableRol, setDisableRol] = useState(false)
  const { roles, customers, suppliers, users } = useAdmin()
  const { loading, alerta, handleSaveUser, user, setUser } = useApp();
  const { id } = useParams();
  
  const handleChange = (e) => {
    const { name, value } = e.target
    const isNumber = ['RolID'].includes(name)

    setUser({
      ...user, 
      [name] : isNumber ? +value : value
    })
  }

  const supplierOptions = suppliers.map(supplier => {
    const supplierNew = {
      value : supplier.ID, 
      label : `${supplier.ID} - ${supplier.BusinessName}`
    }
    return supplierNew;
  })

  const handleSupplierSelectChange = (selected) => {
    setUser({
      ...user, 
      supplier : selected.value
    });
    setSelectedSupplierOption(selected)
  };
  
  const customerOptions = customers.map(customer => {
    const customerNew = {
      value : customer.ID, 
      label : `${customer.ID} - ${customer.BusinessName}`
    }
    return customerNew;
  })

  const handleCustomerSelectChange = (selected) => {
    setUser({
      ...user, 
      customer : selected.value
    });
    setSelectedCustomerOption(selected)
  };

  const navigate = useNavigate();

  const checkInfo = useCallback(() => {
    return user.UserName === '' ||
      user.Name === '' ||
      user.LastName === '' ||
      user.RolID === 0
  }, [user])

  useEffect(() => {
    checkInfo()
  }, [user])

  useEffect(() => {
    if(userType === "2" || userType === "1") {
      setUser({
        ...user, 
        RolID : 6
      })
      setDisableRol(true)

      switch (userType) {
        case "1":
          setUser({ ...user, supplier : null })
          break;
        
        case "2":
          setUser({ ...user, customer : null })
          break;
      }
    } else {
      setDisableRol(false)
    }
  }, [userType])

  useEffect(() => {
    if(id && users.length) {
      const userDB = users.filter(user => user.ID === +id)[0];
      
      if(userDB?.CustomerID) {
        const customer = customers?.filter(customer => customer.ID === userDB.CustomerID)

        setUserType(1)

        setSelectedCustomerOption({
          value : customer[0]?.ID, 
          label : `${customer[0]?.ID} - ${customer[0]?.BusinessName}`
        })

        setUser({
          ...userDB, 
          customer : userDB.CustomerID
        })
      } else if(userDB.SupplierID) {
        const supplier = suppliers?.filter(supplier => supplier.ID === userDB.SupplierID)

        setUserType(2)

        setSelectedSupplierOption({
          value : supplier[0]?.ID, 
          label : `${supplier[0]?.ID} - ${supplier[0]?.BusinessName}`
        })
        
        setUser({
          ...userDB, 
          supplier : userDB.SupplierID
        })
      } else {
        setUser(userDB)
      }
    }
  }, [users])

  const handleGetUserName = () => {
    const { Name, LastName } = user
    let userName = ""
  
    if(Name !== "") {
      userName += Name?.charAt(0);
    }
  
    if(LastName !== "") {
      const lastName = LastName?.split(" ");
      userName += lastName[0]
  
      if(lastName[1] !== undefined) {
        userName += lastName[1]?.charAt(0)
      } else {
        userName += lastName[0].charAt(1).toUpperCase()
      }
    }
  
    userName += (Math.random() * (999 - 100) + 1).toFixed(0)
    return userName
  }

  useEffect(() => {
    if(!id) setUser({ ...user, UserName : handleGetUserName() })
  }, [user.Name, user.LastName])

  useEffect(() => {
    if(!id) {
      
      setUser({ ...user, Password : generatePSWD() })
    }
  }, [])

  return (
    <div className="container mt-4">
      <button onClick={() => navigate(-1)} className="backBtn mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>

          <p>Back</p>
      </button>

      <h2>Crear Usuario</h2>
      <p>Ingresa los datos que se solicitan para dar de alta un nuevo usuario</p>

      {alerta && (
        <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <form>
          <div className="row g-3">
            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="name" className="fw-bold fs-6">Nombre</label>
              <input 
                type="text" 
                id="name"
                name="Name"
                placeholder="Nombre del usuario" 
                value={user.Name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="lastName" className="fw-bold fs-6">Apellido</label>
              <input 
                type="text" 
                id="lastName" 
                name="LastName"
                placeholder="Apellidos del usuario"
                value={user.LastName}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="email" className="fw-bold fs-6">Correo</label>
              <input 
                type="email" 
                id="email" 
                name="Email"
                placeholder="Ej. correo@correo.com"
                value={user.Email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="numero" className="fw-bold fs-6">Número de contacto</label>
              <input 
                type="number" 
                id="numero" 
                name="Number"
                placeholder="Numero del usuario"
                value={user.Number}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="address" className="fw-bold fs-6">Direccion</label>
              <input 
                type="text" 
                id="address" 
                name="Address"
                placeholder="Ej. Aragon 129, Privadas del rey"
                value={user.Address}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="userName" className="fw-bold fs-6">Nombre de usuario</label>
              <input 
                type="text" 
                id="userName" 
                placeholder="Nombre de usuario"
                name="UserName"
                value={user.UserName}
                disabled
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="password" className="fw-bold fs-6">Password</label>
              <input 
                type="text" 
                disabled
                id="password" 
                name="Password"
                placeholder="Password del usuario"
                value={user.Password}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="rol" className="fw-bold fs-6">Rol</label>
              <select 
                id="rol" 
                value={user.RolID} 
                name="RolID"
                onChange={handleChange}
                className="form-select"
                disabled={disableRol}
              >
                <option value="0">Seleccione un rol</option>
                {roles?.map(rol => (
                  <option key={rol.ID} value={rol.ID}>{rol.Name}</option>
                ))}
              </select>
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="type" className="fw-bold fs-6">Tipo de usuario</label>
              <select id="type" value={userType} onChange={e => setUserType(e.target.value)} className="form-select">
                <option value="0">Interno</option>
                <option value="1">Cliente</option>
                <option value="2">Proveedor</option>
              </select>
            </div>

            {+userType === 1 && (
              <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                <label htmlFor="supplier">Cliente</label>
                  <Select 
                    options={customerOptions} 
                    onChange={handleCustomerSelectChange} 
                    value={selectedCustomerOption}
                    className="w-100"
                  />
              </div>
            )}

            {+userType === 2 && (
              <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                <label htmlFor="supplier">Proveedor</label>
                  <Select 
                    options={supplierOptions} 
                    onChange={handleSupplierSelectChange} 
                    value={selectedSupplierOption}
                    className="w-100"
                  />
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button 
              type="button"
              className={`btn ${checkInfo() ? 'bgIsInvalid' : 'bgPrimary'} mt-4`}
              disabled={checkInfo()}
              onClick={() => handleSaveUser(user)}
            >Guardar Usuario</button>

            <button 
              type="button"
              className={`btn btn-secondary mt-4`}
              disabled={!id}
              onClick={() => setUser({
                ...user, 
                Password : generatePSWD()
              })}
            >Generar Password</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CrudUserPage