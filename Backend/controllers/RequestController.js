import { io } from "../index.js";
import Request from "../models/Request.js"
import UserInfo from "../models/UserInfo.js";
import Product from "../models/Product.js";
import RequestProduct from "../models/RequestProduct.js";
import RequestProductView from "../models/RequestProductView.js";
import Supplier from "../models/Supplier.js";
import Customer from "../models/Customer.js";
import { requestAcepted, requestCanceled, requestEmail } from "../helpers/email.js";

const getAllRequest = async(req, res) => {
    const requestObj = new Request();
    const request = await requestObj.getAllView('RequestInfoView');

    const requestProductsObj = await new RequestProductView().getAll();

    for(let i = 0;i<request.length;i++) {
        const productsArray = requestProductsObj.filter(product => product.RequestID === request[i].ID)

        request[i].Products = productsArray
    }

    if(request) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            request
        })
    }
} 

const getOneRequest = async(req, res) => {
    const { id } = req.params

    const requestObj = new Request();
    const requestProductsObj = await new RequestProductView().getAll();
    
    const request = await requestObj.getByElementView('RequestInfoView', 'ID', +id)

    const products = requestProductsObj.filter(product => product.RequestID === +id)

    if(products.length > 0) {
        request.Products = products
    }

    if(request) {
        return res.status(200).json({
            statu: 200, 
            msg: "Ok", 
            request
        })
    } else {
        return res.status(500).json({
            status: 500, 
            msg: "Hubo un error"
        })
    }
}

const getUserRequest = async(req, res) => {
    const { user } = req

    const requestObj = new Request();
    const requestProducts = await new RequestProduct().getAll()
    const productObj = new Product()

    const requests = await requestObj.getByElementViewArray('RequestInfoView', 'UserID', +user.ID);

    for(let i=0;i<requests.length;i++) {
        const products = requestProducts?.filter(product => product.RequestID === requests[i].ID)
        requests[i].Products = products

        for(let j=0;j<requests[i].Products.length;j++) {
            const product = await productObj.getByElementView('ProductInfo', 'Folio', requests[i].Products[j].ProductFolio)
            requests[i].Products[j].Name = product.Name
            requests[i].Products[j].ListPrice = product.ListPrice
            requests[i].Products[j].Cost = product.Cost
        }
    }

    if(requests) {
        return res.status(201).json({
            status: 201, 
            requests
        })
    } else {
        console.log("Algo fallo")
    }
}

const addNewRequest = async(req, res) => {
    const { request } = req.body;

    let bussinesName = "";
    let fullName = "";
    let userEmail = "";

    const requestObj = new Request(request);
    const RequestProductObj = new RequestProduct();

    let supplierUserObj = await new Supplier().getByElementView('SupplierUserView', 'UserID', requestObj.UserID);
    
    if(supplierUserObj) {
        bussinesName = supplierUserObj.BusinessName;
        fullName = supplierUserObj.FullName;
        userEmail = supplierUserObj.Email;
    }

    const customerUserObj = await new Customer().getByElementView('CustomerUserView','UserID', requestObj.UserID);
    if(customerUserObj) {
        bussinesName = customerUserObj.BusinessName;
        fullName = customerUserObj.FullName;
        userEmail = customerUserObj.Email;
    }

    const response = await requestObj.addOne(requestObj);

    if(response) {
        for(let i = 0;i<request.Products.length;i++) {
            request.Products[i].RequestID = response.response[0].insertId
        }

        const responseProducts = await RequestProductObj.addMany(request.Products);

        if(!responseProducts) {
            return res.status(500).json({
                status : 500, 
                msg : "Hubo un error al agregar los productos"
            })
        }

        const datos = {
            bussinesName, 
            userName : fullName, 
            userEmail, 
            Products : request.Products, 
            requestID : response.response[0].insertId, 
        };

        requestObj.ID = response.response[0].insertId;
        requestObj.UserFullName = fullName

        await requestEmail(datos);

        io.emit('requestCreated', { request: requestObj })

        return res.status(200).json({
            status : 200, 
            msg: requestObj.ActionID === 1 ? "Cotizacion generada con exito" : "Solicitud generada con exito"
        })
    } else {
        return res.status(500).json({status : 500, msg: "Hubo un error al generar la solicitud, por favor, intentelo mas tarde"})
    }
}

const acceptRequest = async(req, res) => {
    const { id } = req.params
    const { requestOld, edited } = req.body

    const requestObj = new Request();
    const productObj = new Product();
    const requestProductsObj = new RequestProduct();

    const requestProduct = await requestProductsObj.getByElementArray('RequestID', +id);

    if(edited) {
        for(let i=0; i<requestOld.Products.length; i++) {
            const productNewObj = new RequestProduct(requestOld.Products[i]);

            const sqlUpdateRequestProduct = `
                UPDATE RequestProduct 
                    SET 
                        ProductFolio = '${productNewObj.ProductFolio}', 
                        Assembly = '${productNewObj.Assembly}',
                        Quantity = ${productNewObj.Quantity}, 
                        PricePerUnit = ${productNewObj.PricePerUnit}, 
                        Percentage = ${productNewObj.Percentage}
                WHERE RequestID = ${productNewObj.RequestID}
            `

            const response = await productObj.exectQuery(sqlUpdateRequestProduct);

            if(!response) {
                return res.status(500).json({
                    status: 500, 
                    msg: "Ha habido un error actualizando el producto"
                })
            }
        }
    }

    for(let i=0;i<requestProduct.length;i++) {
        const product = await productObj.getByFolio(requestProduct[i].ProductFolio);

        const sqlUpdateStock = `
            UPDATE Product 
            SET 
                StockAvaible = ${product.StockAvaible - requestProduct[i].Quantity},
                StockOnHand = ${product.StockOnHand + requestProduct[i].Quantity}
            WHERE Folio = '${requestProduct[i].ProductFolio}'
        `
        const responseProduct = await productObj.exectQuery(sqlUpdateStock);

        if(!responseProduct) {
            return res.status(500).json({
                status: 500, 
                msg: "Ha habido un error actualizando el producto"
            })
        }
    }
    
    let response

    const reqUser = await requestObj.getByElement('ID', +id);
    const userObj = new UserInfo();
    const user = await userObj.getByElement('ID', reqUser.UserID)

    switch (+requestOld.ActionID) {
        case 1 : 
            response = await requestObj.updateOneColumn(+id, 'Status', 5) 
            break;

        case 2 :
            response = await requestObj.updateOneColumn(+id, 'Status', 2) 

            await requestAcepted({
                FullName : user.FullName, 
                Email : user.Email, 
                Products : requestOld.Products
            })
            break;
        
        default : 
            console.log('Hay un error');
            break;
    }

    if(response) {
        io.emit('requestUpdate', { msg: "Ok" })

        return res.status(201).json({
            status: 201, 
            msg: "Se ha confirmado la solicitud"
        })
    } else {
        return res.status(500).json({
            status: 500, 
            msg: "Ha habido un error, por favor intentelo mas tarde"
        })
    }
}

const cancelRequest = async(req, res) => {
    const { id } = req.params
    const requestObj = new Request()

    const reqUser = await requestObj.getByElement('ID', +id);
    const userObj = new UserInfo();
    const user = await userObj.getByElement('ID', reqUser.UserID)
    
    await requestCanceled({
        FullName : user.FullName, 
        Email : user.Email, 
        productFolio : reqUser.ProductFolio,
        quantity : reqUser.Quantity
    })

    const response = requestObj.deleteOneId(id);

    if(response) {
        io.emit('requestUpdate', { msg: "Ok" })

        return res.status(201).json({
            status: 201, 
            msg: "Se ha eliminado la solicitud"
        })
    } else {
        return res.status(500).json({
            status: 500, 
            msg: "Ha habido un error, por favor intentelo mas tarde"
        })
    }
}

const toggleStatus = async(req, res) => {
    const { id } = req.params;
    const { statusId } = req.body;

    const requestObj = new Request();
    const requestProductsObj = new RequestProduct();
    const productObj = new Product();

    const request = await requestObj.getByID(id)

    if(statusId === 4) {
        const requestProducts = await requestProductsObj.getByElementArray('RequestID', id);

        for(let i=0;i<requestProducts.length;i++) {
            const product = await productObj.getByFolio(requestProducts[i].ProductFolio);

            const sqlUpdateStock = `
                UPDATE Product 
                SET 
                StockOnHand = ${product.StockOnHand - requestProducts[i].Quantity}
                WHERE Folio = '${product.Folio}'
            `

            if(!await productObj.exectQuery(sqlUpdateStock)) {
                return res.status(501).json({
                    status : 501, 
                    msg : "Hubo un error al actualizar los productos"
                })
            }
        }

    }

    const response = await requestObj.updateOneColumn(+id, 'Status', +statusId);

    if(response) {
        io.emit('requestUpdate', { msg: "Ok" })

        return res.status(200).json({
            status : 200, 
            msg : "Estatus actualizado correctamente"
        })
    } else {
        return res.status(501).json({
            msg : "Hubo un error al actualizar el estado de la solicitud"
        })
    }
}

export {
    addNewRequest, 
    getAllRequest, 
    getOneRequest, 
    acceptRequest, 
    cancelRequest, 
    getUserRequest, 
    toggleStatus
}