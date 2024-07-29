import SupplierDiscount from "../models/SupplierDiscount.js"
import PercentageDiscounts from "../models/PercentageDiscounts.js"
import { io } from "../index.js"
import CustomerDiscount from "../models/CustomerDiscount.js"
import CustomerPercentageDiscounts from "../models/CustomerPercentageDiscounts.js"

export const getDiscounts = async(req, res) => {
    const discountObj = await new SupplierDiscount().getAll()

    for(let i = 0; i<discountObj.length;i++) {
        const percentages = await new PercentageDiscounts().getByElementArray('DiscountID', discountObj[i].ID)

        discountObj[i].percentages = percentages
        i++
    }

    return res.status(201).json({discounts : discountObj});
}

export const addDiscount = async(req, res) => {
    const discountObj = new SupplierDiscount(req.body)
    const response = await discountObj.addOne(discountObj)
    
    if(!response) {
        return res.status(500).json({msg: "No se pudo agregar el descuento"})
    }

    req.body.Discounts.forEach(async(item) => {
        const itemObj = new PercentageDiscounts({
            DiscountID: response.response[0].insertId, 
            Percentage: item
        });

        const responseItem = await itemObj.addOne(itemObj)

        if(!responseItem) {
            return res.status(500).json({msg: "No se agregaron los porcentajes"})
        }
    });

    io.emit('supplierDiscountAdded');

    return res.status(200).json({
        msg: "Se agrego el descuento correctamente"
    })
}

export const removeDiscount = async(req, res) => {
    const { id } = req.params

    const response = await new SupplierDiscount().deleteOneId(id);

    if(!response) {
        return res.status(500).json({
            msg: "Hubo un error, porfavor intentelo mas tarde"
        })
    }

    io.emit('supplierDiscountDeleted');

    return res.status(200).json({
        msg: "Se elimino el descuento correctamente"
    })
}

export const updateDiscount = async(req, res) => {
    const { discount } = req.body;

    const discountObj = new SupplierDiscount(discount)

    if(await discountObj.updateOne(discountObj)) {
        return res.status(201).json({
            msg: "Descuento actualizado correctamente"
        })
    } else {
        return res.status(500).json({
            msg: "Error al actualizar el descuento"
        })
    }
}

export const supplierProductDiscount = async(req, res) => {
    return res.status(404).json({
        msg: "Esta ruta ya no se encuentra en funcionamiento"
    })
}

export const addCustomerDiscount = async(req, res) => {
    const discountObj = new CustomerDiscount(req.body)
    const response = await discountObj.addOne(discountObj)
    
    if(!response) {
        return res.status(500).json({msg: "No se pudo agregar el descuento"})
    }

    req.body.Discounts.forEach(async(item) => {
        const itemObj = new CustomerPercentageDiscounts({
            DiscountID: response.response[0].insertId, 
            Percentage: item
        });

        const responseItem = await itemObj.addOne(itemObj)

        if(!responseItem) {
            return res.status(500).json({msg: "No se agregaron los porcentajes"})
        }
    });

    io.emit('customerDiscountAdded');

    return res.status(200).json({
        msg: "Se agrego el descuento correctamente"
    })
}

export const removeCustomerDiscount = async(req, res) => {
    const { id } = req.params

    const response = await new CustomerDiscount().deleteOneId(id);

    if(!response) {
        return res.status(500).json({
            msg: "Hubo un error, porfavor intentelo mas tarde"
        })
    }

    io.emit('customerDiscountDeleted');

    return res.status(200).json({
        msg: "Se elimino el descuento correctamente"
    })
}
