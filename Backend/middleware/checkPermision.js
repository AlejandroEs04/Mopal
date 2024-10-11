import PendingRequest from "../models/PendingRequest.js"
import Product from "../models/Product.js"

const actionDictionary = {
    post: 'create', 
    put: 'update', 
    delete: 'delete'
}

export const checkProductActionsPermision = async(req, res, next) => {
    const { RolID, ID } = req.user
    const hasPermisions = RolID === 1 || RolID === 5

    if(!hasPermisions) {
        const pendingRequestObj = new PendingRequest({
            userId: ID, 
            action: actionDictionary[req.method.toLowerCase()], 
            productData: req.body.product ?? Object.assign({}, await new Product().getByFolio(req.params.folio)) 
        })

        try {
            await pendingRequestObj.addItem(pendingRequestObj)
            return res.json({msg: 'Su solicitud se ha generado correctamente'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg: 'Hubo un error'
            })
        }
    }

    next()
}