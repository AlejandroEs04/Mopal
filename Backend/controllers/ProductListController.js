import ProductList from "../models/ProductList.js"
import DetProSpe from "../models/DetProSpe.js";

const getAllProductList = async(req, res) => {
    const productListObj = await new ProductList().getAllView('ProductListView');
    
    if(productListObj?.length > 0) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            productLists : productListObj
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addProductList = async(req, res) => {
    const { productList } = req.body

    const productListObj = new ProductList(productList);
    const response = await productListObj.addOne(productListObj);

    if(response) {
        return res.status(200).json({
            status : 200, 
            msg: "Listado de Productos creado correctamente"
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addProductListInfo = async(req, res) => {
    const { 
        specifications, 
        imageHeaderURL, 
        imageIconURL,
        id,
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
        const productListObj = new ProductList();

        const response = await productListObj.updateOneColumn(id, 'ImageHeaderURL', imageHeaderURL)

        if(!response) {
            const error = new Error("Hubo un error")
            return res.status(500).json({status : 500, msg: error})
        }
    }

    if(imageIconURL !== "") {
        const productListObj = new ProductList();

        const response = await productListObj.updateOneColumn(id, 'ImageIconURL', imageIconURL)

        if(!response) {
            const error = new Error("Hubo un error")
            return res.status(500).json({status : 500, msg: error})
        }
    }

    

    return res.status(200).json({msg: "Información actualizada correctamente"})
}

export {
    getAllProductList, 
    addProductList,
    addProductListInfo
}