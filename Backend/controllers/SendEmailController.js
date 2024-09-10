import { quotationSend } from "../helpers/email.js";
import Customer from "../models/Customer.js";
import RequestProduct from "../models/RequestProduct.js";
import Sale from "../models/Sale.js";
import SaleProduct from "../models/SaleProduct.js";
import User from "../models/User.js";

const sendEmailQuotation = async(req, res) => {
    const { id } = req.params

    const pdfBuffer = req.file.buffer;
    const quotationObj = new Sale();
    const quotation = await quotationObj.getByFolio(id)

    let user 
    let FullName
    user = await new User().getUserByID(quotation.CustomerUserID);

    if(!user) {
        user = await new Customer().getByID(quotation.CustomerID)

        if(!user.Email) {
            return res.status(500).json({
                msg: "No se puede enviar el correo, no hay una direccion de correo asignada"
            })
        }
        FullName = user.BusinessName
    } else {
        FullName = user.Name + ' ' + user.LastName
    }

    const products = await new SaleProduct().getByElementArray('SaleFolio', quotation.Folio);
    
    try {
        await quotationSend({
            FullName, 
            Email : user.Email, 
            Products: products, 
            pdfBuffer
        })

        return res.status(201)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Hubo un error"
        })
    }
}

const sendEmailRequestQuotation = async(req, res) => {
    const { id } = req.params

    const pdfBuffer = req.file.buffer;
    const requestObj = new Request();
    const request = await requestObj.getByFolio(id)
    const user = await new User().getUserByID(request.UserID);

    const products = await new RequestProduct().getByElementArray('RequestID', request.ID);
    
    try {
        await quotationSend({
            FullName : user.Name + ' ' + user.LastName, 
            Email : user.Email, 
            Products: products, 
            pdfBuffer
        })

        return res.status(201)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Hubo un error"
        })
    }
}

export {
    sendEmailQuotation, 
    sendEmailRequestQuotation
}