import { io } from "../index.js";
import Observation from "../models/Observation.js"

export const getAll = async(req, res) => {
    const observations = await new Observation().getAll();

    if(observations) {
        return res.status(200).json({
            observations
        })
    }
}

export const createObservation = async(req, res) => {
    const observationObj = new Observation(req.body)

    const response = await observationObj.addOne(observationObj)

    if(response) {
        io.emit('observationReload')
        return res.status(200).send('Observación creada correctamente')
    } else {
        return res.status(500).json({status : 500, msg: "Error al agregar la observacion"})
    }
}

export const updateObservation = async(req, res) => {
    const observationObj = new Observation(req.body)

    try {
        await observationObj.updateItem(observationObj)

        io.emit('observationReload')
        
        return res.status(200).send('Observación actualizado correctamente')
    } catch (error) {
        return res.status(500).json({status : 500, msg: "Ocurrio un error"})
    }
}

export const deleteObservation = async(req, res) => {

}
