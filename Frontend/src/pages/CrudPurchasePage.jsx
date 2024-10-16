import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import axios from "axios";
import Select from 'react-select';
import PurchasePdf from "../pdf/PurchasePdf";
import Spinner from 'react-bootstrap/Spinner';
import DeletePop from "../components/DeletePop";
import InputContainer from "../components/InputContainer";
import formatearFechaInput from "../helpers/formatearFechaInput";
import useAuth from "../hooks/useAuth";
import AdminModal from "../components/AdminModal";
import ModalForm from "../components/ModalForm";
import ProductTableView from "../components/ProductTableView";
import TextAreaWithAutocomplete from "../components/TextAreaWithAutocomplete";
import { toast } from "react-toastify";

const initialState = {
    Folio : 0,
    PurchaseDate : formatearFechaInput(Date.now()), 
    SupplierID : 0, 
    SupplierUserID : 0, 
    CurrencyID : 1, 
    StatusID : 1, 
    UserID : 0, 
    Amount : 0, 
    Active : true, 
    Observation : '',
    InternObservation: '', 
    Products : []
}

const CrudPurchasePage = () => {
    const [purchase, setPurchase] = useState(initialState)

    const handleChangeInfo = (e) => {
        const { name, value } = e.target;
        const isNumber = name.includes['SupplierID', 'SupplierUserID', 'CurrencyID', 'StatusID', 'UserID', 'Amount']

        setPurchase({
            ...purchase, 
            [name] : isNumber ? +value : value
        })
    }

    const [supplierUsers, setSupplierUsers] = useState([])
    const [supplierDiscounts, setSupplierDiscounts] = useState([])
    const [show, setShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [modalSetUpShow, setModalSetUpShow] = useState(false);
    const [productFolio, setProductFolio] = useState('');
    const [productGroup, setProductGroup] = useState('');
    const [discount, setDiscount] = useState(0)

    const [selectedSupplierOption, setSelectedSupplierOption] = useState(null)

    const { pathname } = useLocation()
    const { id } = useParams()

    const { users, suppliers, purchases, loading, setLoading, observations } = useAdmin();
    const { auth } = useAuth();

    const [edit, setEdit] = useState(false);

    // Redireccionamiento
    const navigate = useNavigate();

    const supplierOptions = suppliers.map(supplier => {
        const supplierNew = {
            value : supplier.ID, 
            label : `${supplier.ID} - ${supplier.BusinessName}`
        }

        return supplierNew;
    })
    
    const handleSupplierSelectChange = (selected) => {
        if(!id) {
            setPurchase({
                ...purchase, 
                SupplierID : selected.value
            });
            setSelectedSupplierOption(selected)
        }
    };

    const handleDeleteProduct = () => {
        if(id) {
            const currentPurchaseProducts = purchases.filter(purchase => +purchase.Folio === +id)[0].Products
            
            if(currentPurchaseProducts.filter(product => product.Folio === productFolio && product.AssemblyGroup === productGroup).length > 0) {
                handleDeleteSaleProduct()
                return
            }
        }
        
        setPurchase({
            ...purchase, 
            Products: purchase.Products.filter(product => !(product.AssemblyGroup === productGroup && product.Folio === productFolio))
        })
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

            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/purchases/${id}/${productFolio}/${productGroup}`, config);
            toast.success(data.msg)
        } catch (error) {
            toast.error(error.response.data.msg)
        } finally {
            setLoading(false)
        }
    }

    const handleSavePurchase = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            let response 

            if(id) {
                purchase.Folio = id

                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase }, config);
                response = data
            } else {

                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase }, config);
                response = data
            }
            toast.success(response.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleModalDiscount = (e, folio, assembly) => {
        if(e.target.checked) {
            const discountModal = supplierDiscounts.filter(supplierDiscount => supplierDiscount.ID === +discount)[0];
    
            const newArray = purchase.Products.map(product => product.Folio === folio && product.AssemblyGroup === assembly ? {
                ...product, 
                Discount : +discountModal.PercentageTotal, 
                Discounts : discountModal.Percentages.map(percentage => {
                    return {
                        Discount: +percentage.Percentage
                    }
                })
            } : product)
    
            setPurchase({
                ...purchase, 
                Products : newArray
            })
        } else {
            const newArray = purchase.Products.map(product => product.Folio === folio && product.AssemblyGroup === assembly ? {
                ...product, 
                Discount : 0, 
                Discounts : []
            } : product)

            setPurchase({
                ...purchase, 
                Products : newArray 
            })
        }

    }

    useEffect(() => {
        setPurchase({
            ...purchase, 
            UserID : +auth.ID
        })
    }, [auth, ])

    useEffect(() => {
        const supplierItem = suppliers?.filter(supplier => supplier.ID === purchase.SupplierID);

        if(supplierItem[0]?.Discounts?.length > 0) {
            setSupplierDiscounts(supplierItem[0].Discounts)
        } else {
            setSupplierDiscounts([])
        }

        if(supplierItem[0]?.Users.length > 0) {
            setSupplierUsers(supplierItem[0].Users)
        } else {
            setSupplierUsers([])
        }
    }, [purchase.SupplierID])
    
    useEffect(() => {
        const calculoTotal = purchase?.Products?.reduce((total, product) => total + ((product.Quantity * product.PricePerUnit) - ((product.Quantity * product.PricePerUnit) * (product.Discount / 100))), 0)
        setPurchase({
            ...purchase, 
            Amount : +calculoTotal
        })
    }, [purchase.Products])

    useEffect(() => {
        if(id && purchases.length  && auth.ID) {
            let purchaseDB = purchases?.filter(purchase => purchase.Folio === +id)[0];
                
            setSelectedSupplierOption({
                value : purchaseDB?.SupplierID, 
                label : `${purchaseDB?.SupplierID} - ${purchaseDB?.BusinessName}`
            })
            
            setPurchase({
                ...purchaseDB,
                PurchaseDate: formatearFechaInput(new Date(purchaseDB?.PurchaseDate)), 
                UserID: auth.ID
            })
        } else if(auth.ID) {
            setPurchase({
                ...initialState, 
                UserID: auth.ID
            })
        }
    }, [purchases, pathname, auth])

    const checkInfo = useCallback(() => {
        return +purchase.UserID === 0 ||
            +purchase.SupplierID === 0 ||
            +purchase?.Products?.length === 0
    }, [purchase])
    
    useEffect(() => {
        checkInfo()
    }, [purchase])

    return (
        <>
            <div className="container mt-4">
                <button onClick={() => navigate(-1)} className="backBtn mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                    <p>Back</p>
                </button>

                <div className="row">
                    <div className="col-lg-8">
                        <h2>{id ? 'Editar' : 'Generar'} Compra</h2>
                        <p>Ingresa los datos que se solicitan para dar de alta una nueva compra</p>
                    </div>

                    <div className="col-lg-4 d-flex  justify-content-lg-end gap-2">
                        {loading ? (
                            <Spinner />
                        ) : (
                            <>
                                {edit && id ? (
                                    <div>
                                        <button 
                                            onClick={() => handleSavePurchase()}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Editar Compra
                                        </button>
                                    </div>
                                ) : id && (
                                    <div>
                                        <PurchasePdf 
                                            ordenCompra={purchase}
                                        />
                                    </div>
                                )}

                                <div>
                                    <button
                                        disabled={checkInfo()}
                                        className={`btn ${checkInfo() ? 'bg-transparent text-success' : 'btn-success'} btn-sm w-100`}
                                        onClick={() => handleSavePurchase()}
                                    >{id ? 'Editar' : 'Generar'} Compra</button>
                                </div>
                                
                                <div>
                                    <button
                                        className={`btn btn-primary w-100 btn-sm`}
                                        onClick={() => setModalSetUpShow(true)}
                                    >
                                        Configurar compra
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <form className="row g-2">
                    <InputContainer 
                        label="Folio"
                        name="Folio"
                        id="folio"
                        type="number"
                        value={purchase.Folio}
                        placeholder="Folio de la compra"
                        handleAction={handleChangeInfo}
                    />

                    <div className="col-lg-4 col-md-6 d-flex flex-column">
                        <label htmlFor="supplier">Proveedor</label>
                        <Select 
                            options={supplierOptions} 
                            onChange={handleSupplierSelectChange} 
                            value={selectedSupplierOption}
                            className="w-100"
                        />
                    </div>

                    <InputContainer 
                        label="Fecha de la compra"
                        name="PurchaseDate"
                        id="purchaseDate"
                        type="date"
                        placeholder="Fecha de la compra"
                        value={purchase.PurchaseDate}
                        handleAction={handleChangeInfo}
                    />

                    {/* <InputContainer 
                        label="Fecha de entrega estimada"
                        name="DeliveryDate"
                        id="deliveryDate"
                        type="date"
                        placeholder="Fecha de entrega estimada"
                        value={purchase.DeliveryDate}
                        handleAction={handleChangeInfo}
                    /> */}
                    

                    <div className="col-md-6 d-flex flex-column mb-2">
                        <label htmlFor="observaciones">Observaciones Generales</label>
                        <TextAreaWithAutocomplete 
                            options={observations.filter(observation => 
                                (observation.type === 'external' || observation.type === 'all') && 
                                (observation.action === 'purchase' || observation.action === 'all')
                            )}
                            className="form-control"
                            text={purchase.Observation}
                            name={'Observation'}
                            handleChangeProp={handleChangeInfo}
                        />
                    </div>

                    <div className="col-md-6 d-flex flex-column mb-2">
                        <label htmlFor="InternObservation">Observaciones Internas</label>
                        <TextAreaWithAutocomplete 
                            options={observations.filter(observation => 
                                (observation.type === 'internal' || observation.type === 'all') && 
                                (observation.action === 'purchase' || observation.action === 'all')
                            )}
                            className="form-control"
                            text={purchase.InternObservation}
                            name={'InternObservation'}
                            handleChangeProp={handleChangeInfo}
                        />
                    </div>
                </form>

                <ProductTableView 
                    searchBar
                    action={purchase}
                    setAction={setPurchase}
                    discounts={supplierDiscounts}
                    setShow={() => setModalShow(!modalShow)}
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
                        <select id="user" name="UserID" className="form-select" disabled defaultValue={purchase.UserID} onChange={e => handleChangeInfo(e)}>
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
                        <label htmlFor="user">Contacto del proveedor</label>
                        <select disabled={purchase.Folio || purchase?.ContactName?.length > 0} id="user" name="CustomerUserID" className="form-select" value={purchase.SupplierUserID} onChange={e => handleChangeInfo(e)}>
                            <option value={0}>Sin Contacto</option>
                            {supplierUsers?.map(user => (
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
                        value={purchase?.ContactName}
                        disable={+purchase.CustomerUserID !== 0}
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
                header={"Descuentos"}
            >
                <ModalForm 
                    discounts={supplierDiscounts}
                    setDiscount={setDiscount}
                    discount={discount}
                    action={purchase}
                    handleModalDiscount={handleModalDiscount}
                />
            </AdminModal>
        </>
    )
}

export default CrudPurchasePage