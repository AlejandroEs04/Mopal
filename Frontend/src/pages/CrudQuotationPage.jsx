import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import Select from 'react-select';
import formatearFechaInput from "../helpers/formatearFechaInput";
import findNextID from "../helpers/findNextID";
import findLastID from "../helpers/findLastID ";
import DeletePop from "../components/DeletePop";
import InputContainer from "../components/InputContainer";
import ProductTableView from "../components/ProductTableView";
import AdminModal from "../components/AdminModal";
import ModalForm from "../components/ModalForm";
import axios from "axios";
import TextAreaWithAutocomplete from "../components/TextAreaWithAutocomplete";
import { toast } from "react-toastify";

const initialState = {
    Folio : '',
    SaleDate : formatearFechaInput(Date.now()), 
    CustomerID : 0, 
    CustomerUserID : 0, 
    CurrencyID : 1, 
    StatusID : 1, 
    UserID : 0, 
    Amount : 0, 
    Active : true, 
    Observation : '', 
    InternObservation: '', 
    ContactName: '',
    Products : []
}

const CrudQuotationPage = () => {
    const { auth } = useAuth();

    const [sale, setSale] = useState(initialState)

    const handleChangeInfo = (e) => {
        const { name, value } = e.target;
        const isNumber = name.includes['CustomerID', 'CustomerUserID', 'CurrencyID', 'StatusID', 'UserID', 'Amount']

        setSale({
            ...sale, 
            [name] : isNumber ? +value : value
        })
    }

    const [customerUsers, setCustomerUsers] = useState([])
    const [customerDiscounts, setCustomerDiscounts] = useState([])
    const [show, setShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [modalSetUpShow, setModalSetUpShow] = useState(false);
    const [productFolio, setProductFolio] = useState('');
    const [productGroup, setProductGroup] = useState('');
    const [discount, setDiscount] = useState(0)
    
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)
    
    const { id } = useParams();
    const { pathname } = useLocation()

    const { users, customers, sales, setLoading, handleToggleSaleStatus, handleGenerateSale, handleUpdateSale, observations } = useAdmin();

    // Inicializar Select
    const customerOptions = customers?.map(customer => {
        const customerNew = {
            value : customer.ID, 
            label : `${customer.ID} - ${customer.BusinessName}`
        }

        return customerNew;
    })

    const handleCustomersSelectChange = (selected) => {
        if(!id) {
            setSale({
                ...sale, 
                CustomerID : selected.value
            });
            setSelectedCustomerOption(selected)
        }
    };

    const handleDeleteProduct = () => {
        handleDeleteSaleProduct(id, productFolio, productGroup)
    }

    const handleDeleteSaleProduct = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)
            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/sales/${id}/${productFolio}/${productGroup}`, config);
            toast.info(data.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleGetQuotations = () => {
        const quotations = sales.filter(sale => sale?.StatusID === 1);
        return quotations
    }

    const handleNextQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetQuotations()
            return findNextID(quotations, id)
        }
    }
    
    const handleLastQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetQuotations()
            return findLastID(quotations, id)
        }
    }

    const handleModalDiscount = (e, folio, assembly) => {
        if(e.target.checked) {
            const discountModal = customerDiscounts.filter(customerDiscount => customerDiscount.ID === +discount)[0];
    
            const newArray = sale.Products.map(product => product.Folio === folio && product.AssemblyGroup === assembly ? {
                ...product, 
                Discount : +discountModal.PercentageTotal, 
                Discounts : discountModal.Percentages.map(percentage => {
                    return {
                        Discount: +percentage.Percentage
                    }
                })
            } : product)
    
            setSale({
                ...sale, 
                Products : newArray
            })
        } else {
            const newArray = sale.Products.map(product => product.Folio === folio && product.AssemblyGroup === assembly ? {
                ...product, 
                Discount : 0, 
                Discounts : []
            } : product)

            setSale({
                ...sale, 
                Products : newArray 
            })
        }
    }

    useEffect(() => {
        const customerItem = customers?.filter(customer => customer.ID === sale.CustomerID);

        if(customerItem[0]?.Discounts.length > 0) {
            setCustomerDiscounts(customerItem[0].Discounts)
        } else {
            setCustomerDiscounts([])
        }

        if(customerItem[0]?.Users.length > 0) {
            setCustomerUsers(customerItem[0].Users)
        } else {
            setCustomerUsers([])
        }
    }, [sale.CustomerID])

    useEffect(() => {
        const calculoTotal = sale?.Products?.reduce((total, product) => total + ((product.Quantity * product.PricePerUnit) - ((product.Quantity * product.PricePerUnit) * (product.Discount / 100))), 0)
        setSale({
            ...sale, 
            Amount : +calculoTotal
        })
    }, [sale.Products])
    
    useEffect(() => {
        if(id && sales.length && auth.ID) {
            let saleDB = sales?.filter(sale => sale.Folio === +id)[0];
                
            setSelectedCustomerOption({
                value : saleDB?.CustomerID, 
                label : `${saleDB?.CustomerID} - ${saleDB?.BusinessName}`
            })

            setSale({
                ...saleDB,
                SaleDate: formatearFechaInput(new Date(saleDB?.SaleDate)),
                UserID: auth.ID
            })
        } else if(auth.ID) {
            setSale({
                ...initialState, 
                UserID: auth.ID
            })
        }
    }, [sales, pathname, auth])

    const checkInfo = useCallback(() => {
        return sale.UserID === 0 ||
          sale.CustomerID === 0 ||
          sale.Products?.length === 0
      }, [sale])
    
    useEffect(() => {
      checkInfo()
    }, [sale])

    return (
        <>
            <div className="container my-4">
                <div className="d-flex justify-content-between mb-4">
                    <Link to={'/admin/quotation'} className="backBtn text-decoration-none text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>

                        <p>Back</p>
                    </Link>

                    <div className="d-flex gap-3">
                        <Link to={`/admin/quotation/form/${handleLastQuotation()}`} className="backBtn text-decoration-none text-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            <p>Anterior</p>
                        </Link>

                        <Link to={`/admin/quotation/form/${handleNextQuotation()}`} className="backBtn text-decoration-none text-dark">
                            <p>Siguiente</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </div>
                </div>
                

                <div className="row mb-2">
                    <div className="col-lg-7">
                        <h2>{id ? 'Editar' : 'Generar'} Cotización</h2>
                        <p>Ingresa los datos que se solicitan para dar de alta una nueva cotización</p>
                    </div>

                    <div className="col-lg-5 d-flex gap-2 justify-content-lg-end">
                        <div>
                            <button
                                disabled={checkInfo()}
                                className={`btn btn-success w-100 btn-sm`}
                                onClick={() => id ? handleUpdateSale(sale) : handleGenerateSale(sale)}
                            >
                                {sale.Folio ? 'Editar' : 'Generar'} Cotización
                            </button>
                        </div>

                        <div>
                            <button
                                className={`btn btn-primary w-100 btn-sm`}
                                onClick={() => setModalSetUpShow(true)}
                            >
                                Configurar cotización
                            </button>
                        </div>
                        
                        {id && (
                            <div>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handleToggleSaleStatus(sale.Folio, 2)}
                                >
                                    Finalizar Cotización
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <form className="row g-3">
                    <InputContainer 
                        label="Folio"
                        name="Folio"
                        id="folio"
                        type="text"
                        placeholder="Folio de la cotizacion"
                        value={sale.Folio}
                        disable
                    />

                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="customer">Cliente</label>
                        <Select 
                            options={customerOptions} 
                            onChange={handleCustomersSelectChange} 
                            value={selectedCustomerOption}
                            className="w-100"
                        />
                    </div>
                    
                    <InputContainer 
                        label="Fecha de la cotizacion"
                        name="SaleDate"
                        type="date"
                        placeholder="Fecha de la cotizacion"
                        value={sale.SaleDate}
                        handleAction={handleChangeInfo}
                    />

                    <div className="col-md-6 d-flex flex-column mb-2">
                        <label htmlFor="observaciones">Observaciones Generales</label>
                        <TextAreaWithAutocomplete 
                            options={observations.filter(observation => 
                                (observation.type === 'external' || observation.type === 'all') && 
                                (observation.action === 'quotation' || observation.action === 'all')
                            )}
                            className="form-control"
                            text={sale.Observation}
                            name={'Observation'}
                            handleChangeProp={handleChangeInfo}
                        />
                    </div>

                    <div className="col-md-6 d-flex flex-column mb-2">
                        <label htmlFor="InternObservation">Observaciones Internas</label>
                        <TextAreaWithAutocomplete 
                            options={observations.filter(observation => 
                                (observation.type === 'internal' || observation.type === 'all') && 
                                (observation.action === 'quotation' || observation.action === 'all')
                            )}
                            className="form-control"
                            text={sale.InternObservation}
                            name={'InternObservation'}
                            handleChangeProp={handleChangeInfo}
                        />
                    </div>
                </form>

                <ProductTableView 
                    searchBar
                    action={sale}
                    discounts={customerDiscounts}
                    setShow={() => setModalShow(!modalShow)}
                    setAction={setSale}
                    setDeleteProductId={setProductFolio}
                    setDeleteProductGroup={setProductGroup}
                    showDeletePop={setShow}
                />

                <DeletePop 
                    setShow={setShow}
                    show={show}
                    setFolio={setProductFolio}
                    text={`¿Quieres eliminar el producto ${productFolio}?`}
                    header="Eliminar Producto"
                    handleFunction={handleDeleteProduct}
                />
            </div>

            <AdminModal
                show={modalSetUpShow}
                onHide={() => {
                    setModalSetUpShow(false)
                }}
                header={"Configura la cotización"}
            >
                <div className="row g-3">
                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="user">Usuario</label>
                        <select id="user" name="UserID" className="form-select" disabled defaultValue={sale.UserID} onChange={e => handleChangeInfo(e)}>
                            <option value="0">Seleccione el usuario</option>
                            {users?.map(user => user.RolID <= 5 && user.Active === 1 && (
                                <option key={user.ID} value={user.ID}>{`${user.ID} - ${user.Name + ' ' + user.LastName}`}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="currency">Tipo de cambio</label>
                            <select id="currency" defaultValue={'USD'} className="form-select">
                            <option value="USD">Dolar Estadounidense</option>
                            <option value="MXN">Peso Mexicano</option>
                        </select>
                    </div>

                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="user">Contacto del cliente</label>
                        <select disabled={sale.Folio || sale?.ContactName.length > 0} id="user" name="CustomerUserID" className="form-select" value={sale.CustomerUserID} onChange={e => handleChangeInfo(e)}>
                            <option value={0}>Sin Contacto</option>
                            {customerUsers?.map(user => (
                                <option key={user.UserID} value={user.UserID}>{`${user.UserID} - ${user.FullName}`}</option>
                            ))}
                        </select>
                    </div>

                    <InputContainer  
                        label="Nombre de contacto"
                        name="ContactName"
                        id="contactName"
                        type="text"
                        placeholder="Nombre de contacto"
                        value={sale?.ContactName}
                        disable={+sale.CustomerUserID !== 0}
                        handleAction={handleChangeInfo}
                    />
                </div>
            </AdminModal>

            <AdminModal
                show={modalShow}    
                onHide={() => {
                    setModalShow(false)
                    setDiscount(0)
                }}
                header={'Descuentos'}
            >
                <ModalForm 
                    discounts={customerDiscounts}
                    setDiscount={setDiscount}
                    discount={discount}
                    action={sale}
                    handleModalDiscount={handleModalDiscount}
                />
            </AdminModal>
        </>
    )
}

export default CrudQuotationPage