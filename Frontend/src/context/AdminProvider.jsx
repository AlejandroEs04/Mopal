import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";
import generateQuotation from "../helpers/generateQuotation";
import generateQuotationPdf from "../pdf/generateQuotationPdf";

const AdminContext = createContext();

const AdminProvider = ({children}) => {
    const [alerta, setAlerta] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState('');
    const [header, setheader] = useState('');
    const [id, setId] = useState('');

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [request, setRequest] = useState([]);
    const [requestNew, setRequestNew] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [sales, setSales] = useState([]);
    const [reportInfo, setReportInfo] = useState([]);

    const handleGetUsers = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/users`, config);
            setUsers(data.users)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetRequest = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/request`, config);
            setRequest(data.request.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSpecification = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/specifications`);
            setSpecifications(data.specifs)
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleGetReport = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/report`);
            setReportInfo(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetRoles = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/roles`, config);
            setRoles(data.roles)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetPurchase = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/purchases`, config);
            setPurchases(data.purchases.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSales = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/sales`, config);
            setSales(data.sales.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetCustomers = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/customers`, config);
            setCustomers(data.customers)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSuppliers = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/suppliers`, config);
            setSuppliers(data.suppliers)
        } catch (error) {
            console.log(error)
        }
    }

    const handleBuildBuyEmail = async(buy) => {

    }

    const savePurchase = async(purchase) => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        if(purchase.Folio === "") {
            try {
                setLoading(true)
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase : purchase }, config);
                setAlerta({
                  error: false, 
                  msg : data.msg
                })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        } else {
            try {
                setLoading(true)
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase : purchase }, config);
                setAlerta({
                  error: false, 
                  msg : data.msg
                })
            } catch (error) {
                setAlerta({
                    error: true, 
                    msg: error.response.data.msg
                })
            } finally {
                setLoading(false)
            }
        } 
    }

    const handleToggleSaleStatus = async(folio, status, pathname = null) => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales/${folio}`, { status }, config);

            setAlerta({
                error: false, 
                msg : data.msg
            })
        } catch (error) {
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })
        }
    }

    const handleChangeQuantityProduct = (productos, Quantity, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Quantity = +Quantity;
            }
    
            return producto
        })
        return newArray
    }
    
    const handleChangeDiscountProduct = (productos, Discount, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Discount = +Discount;
            }
    
            return producto
        })
        return newArray
    }

    const handleAddProductArray = (products, productsArray, productID) => {
        if(productID) {
          const productNew = products.filter(producto => producto.Folio === productID);
    
          const existArray = productsArray.filter(producto => producto.Folio === productID)
    
          if(existArray.length === 0) {
            return [
                ...productsArray, 
                {
                    ...productNew[0], 
                    Quantity : 1, 
                    Discount : null
                }
            ]
          }
        }
    }

    const handleAfterDeletePurchase = (item) => {
        const newArray = purchases?.map(purchase => {
            if(+purchase.Folio === +item.Folio) {
                return item
            } else {
                return purchase
            }
        })

        setPurchases(newArray);
    }

    const handleChangeStatus = async(modelName, id, statusId) => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/${modelName}/status/${id}`, { statusId }, config)

            setAlerta({
                error : false, 
                msg : data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        } catch (error) {
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSale = async(saleFolio) => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/sales/${saleFolio}`, config);
            setAlerta({
                error : false, 
                msg : "La venta de ha desactivado con exito"
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        } catch (error) {
            setAlerta({
                error : true, 
                msg : error.response.data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        }
    }

    const handleSaveItem = (modelName, item, id = null) => {
        if(id) {
            updateNewItem(modelName, item)
        } else {
            addNewItem(modelName, item)
        }
    }

    const addNewItem = async(modelName, item) => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/${modelName}`, { item }, config);
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const updateNewItem = async(modelName, item) => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/${modelName}`, { item }, config);
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFilter = (array, element, value, modelName) => {
        let arrayFiltered = []

        switch (element) {
            case 'active':
                arrayFiltered = array.filter(item => item?.Active === +value);
                break;
            
            case 'statusID':
                arrayFiltered = array.filter(item => modelName === 'request' ? item?.Status === +value : item?.StatusID === +value);
                break;
            
            case 'searchBar':
                const [filtered, products] = handleSearchBarFilter(array, value, modelName)
                arrayFiltered = filtered
                break;
        }

        return arrayFiltered
    }

    const handleSearchBarFilter = (array, value, modelName) => {
        let itemsFiltered = array
        let productsFiltered = []
        const values = value.split(",")

        values.map(value => {
            value = value.trim()

            itemsFiltered = itemsFiltered.filter(item => {
                const matchID = modelName === 'request' ?
                    item.ID.toString().toLowerCase().includes(value?.toLowerCase()) :
                    item.Folio.toString().toLowerCase().includes(value?.toLowerCase())
                const matchBussinessName = item?.BusinessName?.toLowerCase()?.includes(value.toLowerCase())
                const matchSupplierName = item?.SupplierName?.toLowerCase()?.includes(value.toLowerCase())
                const matchCustomerName = item?.CustomerName?.toLowerCase()?.includes(value.toLowerCase())
                const matchUserName = item?.UserFullName?.toLowerCase()?.includes(value.toLowerCase())
                const userMatch = item?.User?.toLowerCase().includes(value?.toLowerCase());

                productsFiltered = item?.Products?.filter(product => {
                    let matchFolio 

                    if(modelName === "request") {
                        matchFolio = product.ProductFolio.toString().toLowerCase().includes(value?.toLowerCase())
                    } else {
                        matchFolio = product.Folio.toString().toLowerCase().includes(value?.toLowerCase())
                    }
                    return matchFolio
                })

                const productsMatch = productsFiltered?.length > 0

                item.ProductsFiltered = productsFiltered

                return matchID || 
                    matchBussinessName || 
                    matchSupplierName || 
                    matchCustomerName || 
                    matchUserName ||
                    userMatch ||
                    productsMatch
            })
        })

        return [itemsFiltered, productsFiltered]
    }

    // Agregar / Generar una nueva cortizacion
    const handleGenerateSale = async(sale) => {
        const token = localStorage.getItem('token');
    
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }

        try {
          const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales`, { sale }, config);

          setAlerta({
            error: false, 
            msg : data.msg
          })

          setTimeout(() => {
            setAlerta(null)
          }, 5000)
        } catch (error) {
          console.log(error)
        }
    }
    const handleUpdateSale = async(sale) => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/sales`, { sale }, config);
            
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

    const handleDeleteSaleProduct = async(id, productFolio) => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/sales/${id}/${productFolio}`, config);
            
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

    const sendRequestQuotation = async(id, request, subtotal, iva, total) => {
        const pdfData = generateQuotation(request, subtotal, iva, total);
        const formData = new FormData();

        formData.append('pdf', pdfData, 'archivo.pdf');

        await axios.post(`${import.meta.env.VITE_API_URL}/api/sendEmail/quotation/${id}`, formData);

        setAlerta({
            error: false, 
            msg: "Correo enviado exitosamente"
        })
    }

    const sendQuotationPdf = async(folio, quotation, subtotal, iva, total) => {
        const pdfData = generateQuotationPdf(quotation, subtotal, iva, total);
        const formData = new FormData();

        formData.append('pdf', pdfData, 'archivo.pdf');

        await axios.post(`${import.meta.env.VITE_API_URL}/api/sendEmail/quotation/${folio}`, formData);

        setAlerta({
            error: false, 
            msg: "Correo enviado exitosamente"
        })
    }

    useEffect(() => {
        handleGetUsers();
        handleGetSuppliers();
        handleGetPurchase();
        handleGetCustomers();
        handleGetSales();
        handleGetRoles();
        handleGetSpecification();
        handleBuildBuyEmail();
        handleGetRequest();
        handleGetReport()

        socket.on('purchaseUpdate', response => {
            handleGetPurchase()
        })
        socket.on('purchaseDeleted', response => {
            handleAfterDeletePurchase(response)
        })
        socket.on('saleUpdate', response => {
            handleGetSales()
        })
        socket.on('requestCreated', response => {
            handleGetRequest()

            setShowToast(true)
            setMessage("Se ha realizado una nueva solicitud\nPara acceder a ella, haga click aqui")
            setheader("Nueva Solicitud")
            setId(response.ID)
            
            setTimeout(() => {
                setShowToast(false)
            }, 10000)
        })
        socket.on('requestUpdate', response => {
            handleGetRequest()
        })
        socket.on('userUpdate', response => {
            handleGetUsers();
        })
        socket.on('customerDiscountAdded', () => {
            handleGetCustomers();
        })
        socket.on('customerDiscountDeleted', () => {
            handleGetCustomers();
        })
        socket.on('supplierDiscountAdded', () => {
            handleGetSuppliers();
        })
        socket.on('supplierDiscountDeleted', () => {
            handleGetSuppliers();
        })
    }, [])

    useEffect(() => {
        setRequest([
            ...request, 
            requestNew
        ])
    }, [requestNew])

    return (
        <AdminContext.Provider
            value={{
                users, 
                suppliers, 
                purchases, 
                request,
                handleGetPurchase,
                customers, 
                sales, 
                handleGetSales,
                roles, 
                specifications, 
                alerta, 
                setAlerta,
                savePurchase, 
                handleChangeQuantityProduct, 
                handleChangeDiscountProduct, 
                handleAddProductArray, 
                handleToggleSaleStatus, 
                handleDeleteSale,
                handleChangeStatus,
                loading, 
                setLoading,
                showToast, 
                setShowToast, 
                header, 
                message, 
                id,
                reportInfo, 
                handleSaveItem, 
                handleFilter, 
                handleGenerateSale, 
                handleUpdateSale,
                handleDeleteSaleProduct, 
                sendRequestQuotation, 
                sendQuotationPdf
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export {
    AdminProvider
}

export default AdminContext;