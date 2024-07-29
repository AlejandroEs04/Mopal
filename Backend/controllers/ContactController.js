import { sendEmailToSystem } from "../helpers/email.js"

const sendEmail = async(req, res) => {
    try {
        await sendEmailToSystem(req.body);

        return res.status(200).json({
            status : 200, 
            msg : "Correo enviado con exito"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500, 
            msg : "Hubo un problema con el servidor, por favor, intente mas tarde"
        })
    }
}

export {
    sendEmail
}