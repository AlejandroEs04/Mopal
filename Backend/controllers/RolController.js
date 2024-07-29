import Rol from "../models/Rol.js";

const getAllRol = async(req, res) => {
    const rolObj = new Rol();
    const roles = await rolObj.getAll();

    if(roles) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            roles
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

export {
    getAllRol
}