import Specification from "../models/Specification.js"

const getAllSpecifications = async(req, res) => {
    const specifObj = new Specification();
    const specifs = await specifObj.getAll();

    if(specifs) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            specifs
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

export {
    getAllSpecifications
}