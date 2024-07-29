import Type from "../models/Type.js"


const getAllTypes = async(req, res) => {
    const typeObj = new Type();
    const types = await typeObj.getAll();

    if(types) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            types
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const getOneType = async(req, res) => {
    const { id } = req.params;
    const type = await new Type().getByID(id)

    if(type) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            type
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addNewType = async(req, res) => {
    const { type } = req.body;
    const response = await new Type(type).addOne();

    if(response) {
        return res.status(200).json({
            status : 200, 
            msg: response.msg
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const updateType = async(req, res) => {
    const { type } = req.body;

    const typeObj = new Type(type);

    const response = await typeObj.updateOne(typeObj);

    if(response) {
        return res.status(200).json({
            status : 200, 
            msg: response.msg
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

export {
    getAllTypes, 
    getOneType, 
    addNewType, 
    updateType
}