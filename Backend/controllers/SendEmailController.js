import { quotationSend } from "../helpers/email.js";
import Request from "../models/Request.js";
import User from "../models/User.js";

const sendEmailQuotation = async(req, res) => {
    const { id } = req.params

    const pdfBuffer = req.file.buffer;
    const requestObj = new Request();
    const request = await requestObj.getByID(id)
    const user = await new User().getUserByID(request.UserID);

    const products = await requestObj.getRequestProductInfo(+id)
    
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