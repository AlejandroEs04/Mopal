import { quotationSend } from "../helpers/email.js";
import Request from "../models/Request.js";
import RequestProductView from "../models/RequestProductView.js";
import UserInfo from "../models/UserInfo.js";

const sendEmailQuotation = async(req, res) => {
    const { id } = req.params

    const pdfBuffer = req.file.buffer;
    const requestProductsObj = new RequestProductView();
    const request = await new Request().getByID(id)
    const user = await new UserInfo().getByID(request.UserID);

    const products = await requestProductsObj.getByElementArray('RequestID', +id)
    
    try {
        await quotationSend({
            FullName : user.FullName, 
            Email : user.Email, 
            products, 
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
    sendEmailQuotation
}