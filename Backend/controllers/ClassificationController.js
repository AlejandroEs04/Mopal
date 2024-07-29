import Classification from "../models/Classification.js"

const getAllClassification = async(req, res) => {
    const classifications = await new Classification().getAll()
    if(classifications) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            classifications
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const getOneClassification = async(req, res) => {
    const { id } = req.params;
    const classObj = await new Classification().getByID(id);

    if(classObj) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            classObj
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addNewClassification = async(req, res) => {
    const { classification } = req.body;
    const response = await new Classification(classification).addOne();

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

const updateClassification = async(req, res) => {
    const { id } = req.params;
    const { classification } = req.body;
    const classObj = new Classification();

    const oldClass = await classObj.getByID(id);

    classObj.ID = id;
    classObj.Name = classification?.Name ?? oldClass.Name;

    const response = await classObj.updateOne(classObj);

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
    getAllClassification, 
    getOneClassification, 
    addNewClassification, 
    updateClassification
}