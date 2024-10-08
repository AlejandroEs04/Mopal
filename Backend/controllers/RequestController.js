import { io } from "../index.js";
import Request from "../models/Request.js"
import RequestProductDiscount from "../models/RequestProductDiscount.js";
import Product from "../models/Product.js";
import RequestProduct from "../models/RequestProduct.js";
import Supplier from "../models/Supplier.js";
import Customer from "../models/Customer.js";
import { requestAcepted, requestCanceled, requestEmail } from "../helpers/email.js";
import User from "../models/User.js";

const getAllRequest = async(req, res) => {
    const requestObj = new Request()
    const requests = await requestObj.getAllRequestInfo()
    const productDiscount = await requestObj.getAllTable('RequestProductDiscount')
    const requestProducts = await requestObj.getRequestProductInfo()

    for(let i = 0;i<requests.length;i++) {
        requests[i].Products = requestProducts.filter(product => +product.RequestID === +requests[i].ID)

        for(let j = 0; j<requests[i].Products.length;j++) {
            requests[i].Products[j].Discounts = productDiscount?.filter(discount => discount.ProductID === requests[i].Products[j].Folio &&
                +discount.AssemblyGroup === +requests[i].Products[j].AssemblyGroup &&
                +discount.RequestID === +requests[i].ID
            )
        }
    }

    if(requests) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            requests
        })
    }
} 

const getOneRequest = async(req, res) => {
    const { id } = req.params
    const requestObj = new Request();
    const request = await requestObj.getRequestByID(+id)
    const requestProductsObj = await requestObj.getRequestProductInfo();
    const productDiscount = await requestObj.getAllTable('RequestProductDiscount')

    const products = requestProductsObj.filter(product => product.RequestID === +id)

    if(products.length > 0) {
        request.Products = products

        for(let j = 0; j<request.Products.length;j++) {
            request.Products[j].Discounts = productDiscount?.filter(discount => discount.ProductID === request.Products[j].Folio &&
                +discount.AssemblyGroup === +request.Products[j].AssemblyGroup &&
                +discount.RequestID === +request.ID
            )
        }
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

    const requests = await requestObj.getAllRequestInfo(user.ID);

    for(let i=0;i<requests.length;i++) {
        const products = requestProducts?.filter(product => product.RequestID === requests[i].ID)
        requests[i].Products = products

        for(let j=0;j<requests[i].Products.length;j++) {
            const product = await productObj.getByFolioProductInfo(requests[i].Products[j].ProductFolio)
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
        return res.status(500).json({
            msg: "Hubo un error"
        })
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
    const requestProductDiscountObj = new RequestProductDiscount();

    const requestProduct = await requestProductsObj.getByElementArray('RequestID', +id);

    const discounts = []

    if(edited) {
        for(let i=0; i<requestOld.Products.length; i++) {
            requestOld.Products[i].ProductFolio = requestOld.Products[i].Folio;
            const productNewObj = new RequestProduct(requestOld.Products[i]);

            const sqlUpdateRequestProduct = `
                UPDATE RequestProduct 
                    SET 
                        ProductFolio = '${productNewObj.ProductFolio}', 
                        Assembly = '${productNewObj.Assembly}',
                        Quantity = ${productNewObj.Quantity}, 
                        PricePerUnit = ${productNewObj.PricePerUnit}, 
                        Discount = ${productNewObj.Discount}
                WHERE RequestID = ${productNewObj.RequestID}
            `

            for(let j = 0; j<requestOld.Products[i].Discounts.length; j++) {
                discounts.push(new RequestProductDiscount({
                    Discount: +requestOld.Products[i].Discounts[j].Discount, 
                    ProductID: requestOld.Products[i].Folio, 
                    AssemblyGroup: requestOld.Products[i].AssemblyGroup, 
                    RequestID: requestOld.Products[i].RequestID
                }))
            }

            const response = await productObj.exectQuery(sqlUpdateRequestProduct);
            await requestProductDiscountObj.addMany(discounts)

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
    const userObj = new User();
    const user = await userObj.getUserByID(reqUser.UserID)

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
    const userObj = new User();
    const user = await userObj.getUserByID(reqUser.UserID)
    
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