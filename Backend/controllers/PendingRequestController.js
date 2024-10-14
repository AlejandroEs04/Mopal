import { io } from '../index.js'
import PendingRequest from '../models/PendingRequest.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

export const getAllPendingRequest = async(req, res) => {
    try {
        const pendingRequests = await new PendingRequest().getAllItems()
        const users = await new User().getAllUserInfo()

        pendingRequests.map((pendingRequest, index) => {
            pendingRequests[index].user = users.filter(user => user.ID === pendingRequest.userId)[0]
        })

        return res.json({ pendingRequests })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}

export const approveRequest = async(req, res) => {
    const { id } = req.params
    const pendingRequestObj = new PendingRequest()
    const pendingRequest = await pendingRequestObj.getItemById(id)

    if(pendingRequest.productData.length) {
        return res.status(500).json({msg: 'Esta funcion no esta disponible por el momento'})
    } else {
        const product = new Product(pendingRequest.productData)

        switch(pendingRequest.action) {
            case 'create': 
                try {
                    await product.addItem(product)
                } catch (error) {
                    return res.status(500).json({ msg: 'Hubo un error al registrar el producto' })
                }
            break
    
            case 'update':
                try {
                    await product.updateOne(product)
                } catch (error) {
                    return res.status(500).json({ msg: 'Hubo un error al actualizar el producto' })
                }
            break

            case 'delete':
                try {
                    product.Active = false
                    await product.updateOne(product)
                } catch (error) {
                    return res.status(500).json({ msg: 'Hubo un error al actualizar el producto' })
                }
            break
        }
    }

    try {
        pendingRequest.status = 'approved'

        await pendingRequestObj.updateItem(pendingRequest)
        io.emit('pendingRequestUpdated')
        io.emit('productsUpdate')
        return res.send('Petición aprobada correctamente')
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}

export const rejectRequest = async(req, res) => {
    const { id } = req.params
    const pendingRequestObj = new PendingRequest()
    const pendingRequest = await pendingRequestObj.getItemById(id)

    try {
        pendingRequest.status = 'rejected'

        await pendingRequestObj.updateItem(pendingRequest)
        io.emit('pendingRequestUpdated')
        return res.send('Petición rechazada correctamente')
    } catch (error) {
        return res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}