import { io } from "../index.js";
import DetProSpe from "../models/DetProSpe.js";
import Product from "../models/Product.js"
import DetProAcc from "../models/DetProAcc.js";

const getAllProduct = async(req, res) => {
    const products = await new Product().getAllProductInfo();

    if(products) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            products
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addNewProduct = async(req, res) => {
    const { products, product } = req.body;

    if(product) {
        const productObj = new Product(product);

        const response = await productObj.addOne(productObj);
        
        if(response) {
            return res.status(200).json({
                status : 200, 
                msg: response.msg, 
                folio : product.Folio
            })
        } else {
            return res.status(500).json({status : 500, msg: "Error al agregar el producto"})
        }
    }

    if(products) {
        const productObj = new Product();
        const productsDB = await productObj.getAll();

        const productsArray = [];

        for(let i=0;i<products.length;i++) {
            const product = new Product(products[i]);

            const alredyExist = productsDB.filter(productDB => productDB.Folio === product.Folio);

            if(alredyExist.length > 0) {
                const res = await product.updateOne(product);

                if(!res) {
                    return res.status(500).json({status : 500, msg: "Error al actualizar el producto"})
                }
            } else {
                productsArray.push(product);
            }
        }

        if(productsArray.length > 0) {
            const response = await productObj.addMany(productsArray);

            if(response) {
                return res.status(200).json({
                    status : 200, 
                    msg: "Se agregaron los productos correctamente", 
                })
            } else {
                return res.status(500).json({status : 500, msg: "Error al agregar el producto"})
            }

        } else {
            return res.status(200).json({
                status : 200, 
                msg: "Se actualizaron los productos correctamente", 
            })
        }
    }   
}

const addProductInfo = async(req, res) => {
    const { 
        specifications, 
        certifications, 
        imageHeaderURL, 
        imageIconURL,
        accesories, 
        folio,
    } = req.body;

    if(specifications.length > 0) {
        const speObj = new DetProSpe()

        const speArray = specifications.map(specification => {
            return new DetProSpe(specification)
        })

        const response = await speObj.addMany(speArray);

        if(!response) {
            const error = new Error("Hubo un error")
            return res.status(500).json({status : 500, msg: error})
        }
    }

    if(imageHeaderURL !== "") {
        const productObj = new Product();

        const response = await productObj.updateOneColumn(folio, 'ImageHeaderURL', imageHeaderURL)

        if(!response) {
            const error = new Error("Hubo un error")
            return res.status(500).json({status : 500, msg: error})
        }
    }

    if(imageIconURL !== "") {
        const productObj = new Product();

        const response = await productObj.updateOneColumn(folio, 'ImageIconURL', imageIconURL)

        if(!response) {
            const error = new Error("Hubo un error")
            return res.status(500).json({status : 500, msg: error})
        }
    }

    

    return res.status(200).json({msg: "Información actualizada correctamente"})
}

const updateProduct = async(req, res) => {
    const { product } = req.body;

    const productObj = new Product(product)
    const response = await productObj.updateOne(productObj);

    if(response) {
        io.emit('productsUpdate')

        return res.status(200).json({
            status : 200, 
            msg: "Se actualizo el producto correctamente", 
        })
    } else {
        return res.status(500).json({status : 500, msg: "Error al actualizar el producto"})
    }
}

const deleteProduct = async(req, res) => {
    const { folio } = req.params;
    const productObj = new Product();

    const response = await productObj.updateOneColumn(folio, 'Active', false)

    if(response) {
        return res.status(200).json({msg: "Producto desactivado correctamente"})
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const activateProduct = async(req, res) => {
    const { folio } = req.params;
    const productObj = new Product();

    const response = await productObj.updateOneColumn(folio, 'Active', 1)

    if(response) {
        io.emit('productsUpdate')

        return res.status(200).json({msg: "Producto activado correctamente"})
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addProductAccesory = async(req, res) => {
    let { accesories } = req.body
    const DetProAccObj = new DetProAcc();

    for(let i=0;i<accesories.length;i++) {
        accesories[i] = new DetProAcc(accesories[i])
    }

    const response = await DetProAccObj.addMany(accesories);

    if(response) {
        io.emit('productsUpdate')

        return res.status(201).json({
            status : 201,
            msg : "Accesorio agregado correctamente"
        })
    } else {
        return res.status(500).json({
            status : 500, 
            msg : "Hubo un error, por favor intentelo mas tarde"
        })
    }
}

const deleteProductAccesory = async(req, res) => {
    const { folio, accesoryFolio } = req.params
    const DetProAccObj = new DetProAcc()

    const sql = `
        DELETE FROM DetProAcc
        WHERE 
            ProductFolio = '${folio}' AND
            AccessoryFolio = '${accesoryFolio}'
    `

    if(await DetProAccObj.exectQuery(sql)) {
        io.emit('productsUpdate')
        
        return res.status(201).json({
            status : 201,
            msg : "Accesorio eliminado correctamente"
        })
    } else {
        return res.status(500).json({
            status : 500, 
            msg : "Hubo un error, por favor intentelo mas tarde"
        })
    }
}

export {
    getAllProduct, 
    addNewProduct, 
    updateProduct, 
    deleteProduct, 
    addProductInfo, 
    activateProduct, 
    addProductAccesory, 
    deleteProductAccesory
}