import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";
import generateQuotation from "../helpers/generateQuotation";
import generateQuotationPdf from "../pdf/generateQuotationPdf";
import { toast } from "react-toastify";

const AdminContext = createContext();

const AdminProvider = ({children}) => {
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState('');
    const [header, setheader] = useState('');
    const [id, setId] = useState('');

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [observations, setObservations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [request, setRequest] = useState([]);
    const [requestNew, setRequestNew] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [sales, setSales] = useState([]);
    const [reportInfo, setReportInfo] = useState({});

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
            setRequest(data.requests.reverse())
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

    const handleGetReportInformation = async(filters, type) => {
        setLoading(true)

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/report/${type}`, filters);
            return data
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
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

    const handleGetObservations = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/observations`, config);
            setObservations(data.observations)
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
                toast.success(data.msg)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        } else {
            try {
                setLoading(true)
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase : purchase }, config);
                toast.success(data.msg)
            } catch (error) {
                toast.error(error.response.data.msg)
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
            toast.success(data.msg)
        } catch (error) {
            toast.error(error.response.data.msg)
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
            toast.success(data.msg)
        } catch (error) {
            toast.error(error.response.data.msg)
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
            toast.success(data.msg)
        } catch (error) {
            toast.error(error.response.data.msg)
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
          toast.success(data.msg)
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
            toast.success(data.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSaleProduct = async(id, productFolio, productGroup) => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/sales/${id}/${productFolio}/${productGroup ?? 0}`, config);
            toast.success(data.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSendRequestQuotation = async(id, request, subtotal, iva, total) => {
        const pdfData = generateQuotationPdf(request, subtotal, iva, total);
        const formData = new FormData();

        formData.append('pdf', pdfData, 'archivo.pdf');

        await axios.post(`${import.meta.env.VITE_API_URL}/api/sendEmail/requests/quotation/${id}`, formData);
        toast.success('Correo enviado correctamente')
    }

    const handleSendQuotation = async(id, quotation, subtotal, iva, total) => {
        const pdfData = generateQuotation(quotation, subtotal, iva, total);
        const formData = new FormData();

        formData.append('pdf', pdfData, 'archivo.pdf');

        await axios.post(`${import.meta.env.VITE_API_URL}/api/sendEmail/quotation/${id}`, formData);
        toast.success('Correo enviado correctamente')
    }

    const sendQuotationPdf = async(folio, quotation, subtotal, iva, total) => {
        const pdfData = generateQuotationPdf(quotation, subtotal, iva, total);
        const formData = new FormData();

        formData.append('pdf', pdfData, 'archivo.pdf');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/sendEmail/quotation/${folio}`, formData);
            toast.success('Correo enviado correctamente')
        } catch (error) {
            toast.error(error.response.data.msg)
            return
        }
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
        handleGetObservations();

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
        socket.on('observationReload', () => {
            handleGetObservations();
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
                observations,
                specifications, 
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
                handleFilter, 
                handleGenerateSale, 
                handleUpdateSale,
                handleDeleteSaleProduct, 
                handleSendQuotation, 
                sendQuotationPdf, 
                handleGetReportInformation, 
                handleSendRequestQuotation
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