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
    const [productFolio, setProductFolio] = useState('');
    const [productGroup, setProductGroup] = useState('');
    const [discount, setDiscount] = useState(0)
    
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)
    
    const { id } = useParams();
    const { pathname } = useLocation()

    const { users, customers, sales, handleToggleSaleStatus, alerta, setAlerta, handleGenerateSale, handleUpdateSale, handleDeleteSaleProduct, loading } = useAdmin();

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

        if(customerItem[0]?.Users === undefined) {
            return
        }

        if(customerItem[0]?.Users.length > 0) {
            setCustomerUsers(customerItem[0].Users)
            setCustomerDiscounts(customerItem[0].Discounts)
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
        if(id && sales.length) {
            let saleDB = sales?.filter(sale => sale.Folio === +id)[0];
                
            setSelectedCustomerOption({
                value : saleDB?.CustomerID, 
                label : `${saleDB?.CustomerID} - ${saleDB?.BusinessName}`
            })
            
            setSale({
                ...saleDB,
                SaleDate: formatearFechaInput(new Date(saleDB?.SaleDate))
            })
        } else {
            setSale(initialState)
        }
    }, [sales, pathname])

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
                        <h2>Generar Cotización</h2>
                        <p>Ingresa los datos que se solicitan para dar de alta una nueva cotización</p>
                    </div>

                    <div className="col-lg-5 d-flex gap-2 justify-content-lg-end">
                        <div>
                            <button
                                disabled={checkInfo()}
                                className={`btn ${checkInfo() ? 'bg-transparent text-success' : 'btn-success'} w-100`}
                                onClick={() => id ? handleUpdateSale(sale) : handleGenerateSale(sale)}
                            >
                                {sale.Folio ? 'Editar' : 'Generar'} Cotizacion
                            </button>
                        </div>
                        
                        {id && (
                            <div>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleToggleSaleStatus(sale.Folio, 2)}
                                >
                                    Finalizar Cotización
                                </button>
                            </div>
                        )}

                        
                    </div>
                </div>

                {alerta && (
                    <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
                )}

                <form className="row g-2">
                    <InputContainer 
                        label="Folio"
                        name="Folio"
                        id="folio"
                        type="text"
                        placeholder="Folio de la cotizacion"
                        value={sale.Folio}
                        disable
                    />

                    <div className="col-lg-4 col-md-6 d-flex flex-column">
                        <label htmlFor="customer">Cliente</label>
                        <Select 
                            options={customerOptions} 
                            onChange={handleCustomersSelectChange} 
                            value={selectedCustomerOption}
                            className="w-100"
                        />
                    </div>
                        
                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="user">Usuario</label>
                        <select disabled={sale.Folio || customerUsers.length === 0} id="user" name="CustomerUserID" className="form-select" value={sale.CustomerUserID} onChange={e => handleChangeInfo(e)}>
                            <option value={0}>Sin Contacto</option>
                            {customerUsers?.map(user => (
                                <option key={user.UserID} value={user.UserID}>{`${user.UserID} - ${user.FullName}`}</option>
                            ))}
                        </select>
                    </div>

                    <InputContainer 
                        label="Fecha de la cotizacion"
                        name="SaleDate"
                        type="date"
                        placeholder="Fecha de la cotizacion"
                        value={sale.SaleDate}
                        handleAction={handleChangeInfo}
                    />
                    
                    <div className="col-lg-4 col-md-6 d-flex flex-column">
                        <label htmlFor="currency">Tipo de cambio</label>
                            <select id="currency" defaultValue={'USD'} className="form-select">
                            <option value="USD">Dolar Estadounidense</option>
                            <option value="MXN">Peso Mexicano</option>
                        </select>
                    </div>
                    
                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="user">Usuario</label>
                        <select id="user" name="UserID" className="form-select" disabled={id} value={sale.UserID} onChange={e => handleChangeInfo(e)}>
                        <option value="0">Seleccione el usuario</option>
                        {users?.map(user => user.RolID <= 5 && user.Active === 1 && (
                            <option key={user.ID} value={user.ID}>{`${user.ID} - ${user.Name + ' ' + user.LastName}`}</option>
                        ))}
                        </select>
                    </div>

                    <div className="col-md-6 d-flex flex-column mb-2">
                        <label htmlFor="observaciones">Observaciones</label>
                        <textarea 
                            name="Observation"
                            id="observaciones" 
                            rows={4} 
                            className="form-control" 
                            value={sale.Observation} 
                            onChange={e => { handleChangeInfo(e)}}>    
                        </textarea>
                    </div>

                    <div className="col-md-6 d-flex flex-column mb-2">
                        <label htmlFor="InternObservation">Observaciones (Internas)</label>
                        <textarea 
                            name="InternObservation"
                            id="InternObservation" 
                            rows={4} 
                            className="form-control" 
                            value={sale.InternObservation} 
                            onChange={e => handleChangeInfo(e)}
                        ></textarea>
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