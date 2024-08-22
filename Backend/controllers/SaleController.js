import { io } from "../index.js"
import Product from "../models/Product.js"
import Sale from "../models/Sale.js"
import SaleProduct from "../models/SaleProduct.js"
import SaleProductDiscount from "../models/SaleProductDiscount.js"

const getAllSales = async(req, res) => {
    const saleObj = new Sale();

    const sales = await saleObj.getAllView('SaleInfo')
    const products = await saleObj.getAllView('SaleProductInfo');
    const productDiscount = await saleObj.getAllView('SaleProductDiscount')

    if(sales && products) {
        for(let i=0; i<sales.length; i++) {
            const productsArray = products.filter(product => product.SaleFolio === sales[i].Folio);
            sales[i].Products = productsArray

            for(let j = 0; j<sales[i].Products.length;j++) {
                sales[i].Products[j].Discounts = productDiscount?.filter(discount => discount.ProductID === sales[i].Products[j].Folio &&
                    +discount.AssemblyGroup === +sales[i].Products[j].AssemblyGroup &&
                    +discount.SaleID === +sales[i].Folio
                )
            }
        }

        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            sales
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addNewSale = async(req, res) => {
    const { sale } = req.body

    const productoObj = new Product()
    const saleObj = new Sale(sale)
    const saleProductDiscountObj = new SaleProductDiscount()

    const response = await saleObj.addOneWithoutFolio(saleObj);

    if(!response) {
        return res.status(500).json({msg : "Hubo un error"})
    }

    const productsArray = []
    const discounts = []

    for(let i = 0; i < sale.Products.length; i++) {
        productsArray[i] = new SaleProduct({
            ...sale.Products[i], 
            SaleFolio : response.response[0].insertId
        })

        for(let j = 0; j<sale.Products[i].Discounts.length; j++) {
            discounts.push(new SaleProductDiscount({
                Discount: +sale.Products[i].Discounts[j].Discount, 
                ProductID: productsArray[i].ProductFolio, 
                AssemblyGroup: productsArray[i].AssemblyGroup, 
                SaleID: productsArray[i].SaleFolio
            }))
        }

        if(+saleObj.StatusID === 2) {
            const productoOld = await productoObj.getByFolio(productsArray[i].ProductFolio);

            const sqlUpdateStock = `
                UPDATE Product 
                SET 
                    StockAvaible = ${productoOld.StockAvaible - productsArray[i].Quantity}, 
                    StockOnHand = ${productoOld.StockOnHand + productsArray[i].Quantity}
                WHERE Folio = '${productsArray[i].ProductFolio}'
            `

            const responseProduct = await productoObj.exectQuery(sqlUpdateStock);

            if(!responseProduct) {
                return res.status(500).json({status : 500, msg: "Hubo un error al actualizar los productos"})
            }
        }
    }

    const saleProductObj = new SaleProduct();

    const responseProducts = await saleProductObj.addMany(productsArray);

    if(discounts.length > 0) {
        await saleProductDiscountObj.addMany(discounts)
    }

    if(responseProducts) {
        io.emit('saleUpdate');

        return res.status(200).json({
            status : 200, 
            msg: "Cotizacion generada con exito", 
            folio : response.response[0].insertId
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const updateSale = async(req, res) => {
    const { sale } = req.body

    const saleObj = new Sale(sale)
    const saleProductObj = new SaleProduct();
    const productoObj = new Product();
    const saleProductDiscountObj = new SaleProductDiscount()

    const discounts = [];

        for(let i = 0;i < sale.Products.length; i++) {
            const sqlRemoveDiscounts = `
                DELETE FROM SaleProductDiscount
                WHERE SaleID = ${sale.Folio}
            `

            await saleProductObj.exectQuery(sqlRemoveDiscounts)

            const sqlGetProducts = `
                SELECT * FROM SaleProduct 
                WHERE ProductFolio = '${sale.Products[i].Folio}' AND SaleFolio = ${saleObj.Folio}
            `
            const product = await saleProductObj.exectQueryInfo(sqlGetProducts);
    
            for(let j = 0; j<sale.Products[i].Discounts.length; j++) {
                discounts.push(new SaleProductDiscount({
                    Discount: +sale.Products[i].Discounts[j].Discount, 
                    ProductID: sale.Products[i].Folio, 
                    AssemblyGroup: sale.Products[i].AssemblyGroup, 
                    SaleID: sale.Folio
                }))
            }

            if(product.length === 0) {
                const productNew = new SaleProduct({
                    SaleFolio : saleObj.Folio, 
                    ProductFolio : sale.Products[i].Folio, 
                    Quantity : +sale.Products[i].Quantity, 
                    PricePerUnit : +sale.Products[i].PricePerUnit,
                    Discount : +sale.Products[i].Discount ?? 0, 
                    Observations: sale.Products[i].Observations
                })
    
                const resNewProduct = await saleProductObj.addOne(productNew)
    
                if(!resNewProduct) {
                    return res.status(500).json({status : 500, msg: "Hubo un error al agregar un producto"})
                }
    
                const productoOld = await productoObj.getByFolio(sale.Products[i].Folio);
    
                const sqlUpdateStock = `
                    UPDATE Product 
                    SET 
                        StockAvaible = ${productoOld.StockAvaible - productNew.Quantity}, 
                        StockOnHand = ${productoOld.StockOnHand + productNew.Quantity}
                    WHERE Folio = '${productNew.ProductFolio}'
                `
    
                const responseProduct = await productoObj.exectQuery(sqlUpdateStock);
    
                if(!responseProduct) {
                    return res.status(500).json({status : 500, msg: "Hubo un error al actualizar los productos"})
                }
            } else {
                const QuantityNew = +sale.Products[i].Quantity
                const DiscountNew = +sale.Products[i].Discount
                if(QuantityNew !== product[0].Quantity || DiscountNew !== product[0].Discount) {
                    const saleProduct = new SaleProduct(sale.Products[i])
    
                    const sqlUpdateSaleProducto = `
                        UPDATE SaleProduct 
                        SET Quantity = ${+QuantityNew},
                        Discount = ${+DiscountNew}, 
                        Observations = '${sale.Products[i].Observations}'
                        WHERE ProductFolio = '${sale.Products[i].Folio}' AND SaleFolio = ${saleObj.Folio}
                    `
    
                    const resUpdateSaleProducto = saleProduct.exectQuery(sqlUpdateSaleProducto);
    
                    if(!resUpdateSaleProducto) {
                        return res.status(500).json({status : 500, msg: "Hubo un error al actualizar un producto"})
                    }
    
                    const producto = await productoObj.getByFolio(sale.Products[i].Folio);
    
                    const sqlUpdateStock = `
                        UPDATE Product 
                        SET 
                            StockAvaible = ${(+producto.StockAvaible - (+QuantityNew - +product[0].Quantity))}, 
                            StockOnHand = ${+producto.StockOnHand + (+QuantityNew - +product[0].Quantity)}
                        WHERE Folio = '${producto.Folio}'
                    `
    
                    const responseProduct = await productoObj.exectQuery(sqlUpdateStock);
    
                    if(!responseProduct) {
                        return res.status(500).json({status : 500, msg: "Hubo un error al actualizar los productos"})
                    }
                }
            }
    }

    if(discounts.length > 0) {
        await saleProductDiscountObj.addMany(discounts)
    }
    const response = await saleObj.updateOne(saleObj)

    if(response) {
        io.emit('saleUpdate')

        return res.status(200).json({
            status : 200, 
            msg: "Venta actualizada con exito"
        })
    } else {
        return res.status(500).json({status : 500, msg: "Hubo un error al actualizar la venta"})
    }
}

const toggleSale = async(req, res) => {
    const { folio } = req.params;
    const { status } = req.body;

    const saleObj = new Sale();
    const productObj = new Product();
    const saleProductObj = new SaleProduct()

    const saleProducts = await saleProductObj.getByElementArray('SaleFolio', folio)

    if(status === 2) {
        for(let i=0; i<saleProducts.length; i++) {
            const product = await productObj.getByFolio(saleProducts[i].ProductFolio);
            
            const sqlUpdateStock = `
                UPDATE Product 
                SET 
                StockAvaible = ${+product.StockAvaible - +saleProducts[i].Quantity},
                StockOnHand = ${+product.StockOnHand + +saleProducts[i].Quantity}
                WHERE Folio = '${product.Folio}'
            `

            const res = await productObj.exectQuery(sqlUpdateStock)

            if(!res) {
                return res.status(500).json({status : 500, msg: "Hubo un error al actualizar el producto"})
            }
        }
    }

    const response = await saleObj.updateOneColumn(folio, 'StatusID', status)

    if(response) {
        io.emit('saleUpdate')
        
        return res.status(200).json({
            status : 200, 
            msg: "Cotizacion actualizada con exito"
        })
    } else {
        return res.status(500).json({status : 500, msg: "Hubo un error al actualizar la venta"})
    }
}

const deleteSale = async(req, res) => {
    const { folio } = req.params

    const saleObj = new Sale();
    const saleProductObj = new SaleProduct();
    const productObj = new Product();

    const sale = await saleObj.getByFolio(folio);

    if(sale.Active === 0) {
        return res.status(409).json({
            status : 409, 
            msg : "La compra ya esta desactivada"
        })
    }
    
    /** if(sale.StatusID === 4) {
        return res.status(400).json({
            status : 400, 
            msg : "La venta ha sido entregada, no se puede eliminar"
        })
    } **/

    const saleProducts = await saleProductObj.getByElementArray('SaleFolio', folio);

    if(sale.StatusID > 1) {
        for(let i=0;i<saleProducts.length;i++) {
            const product = await productObj.getByFolio(saleProducts[i].ProductFolio);
            
            let sqlUpdateStock = ""

            if(sale.StatusID > 1 && sale.StatusID < 4) {
                sqlUpdateStock = `
                    UPDATE Product 
                    SET 
                        StockAvaible = ${+product.StockAvaible + +saleProducts[i].Quantity},
                        StockOnHand = ${+product.StockOnHand - +saleProducts[i].Quantity}
                    WHERE Folio = '${saleProducts[i].ProductFolio}'
                `
            } else if (sale.StatusID === 4) {
                sqlUpdateStock = `
                    UPDATE Product 
                    SET 
                        StockAvaible = ${+product.StockAvaible + +saleProducts[i].Quantity}
                    WHERE Folio = '${saleProducts[i].ProductFolio}'
                `
            }

            if(!await productObj.exectQuery(sqlUpdateStock)) {
                return res.status(500).json({
                    status : 500, 
                    msg : "Hubo un error al actualizar un producto"
                })
            }
        }
    } 

    const response = await saleObj.updateOneColumn(folio, 'Active', false);

    if(response) {
        io.emit('saleUpdate')
        return res.status(200).json({
            status : 200, 
            msg: "Venta eliminado con exito"
        })
    } else {
        return res.status(500).json({status : 500, msg: "Hubo un error al eliminar la venta"})
    }
}

const deleteSaleProduct = async(req, res) => {
    const { saleId, productId } = req.params
    const productoObj = new Product();
    const saleProductObj = new SaleProduct();

    const sqlGetProducts = `
        SELECT * FROM SaleProduct 
        WHERE ProductFolio = '${productId}' AND SaleFolio = ${saleId}
    `

    const sale = await saleProductObj.exectQueryInfo(sqlGetProducts);
    
    const producto = await productoObj.getByFolio(productId);
    
    const sqlUpdateStock = `
        UPDATE Product 
        SET 
        StockAvaible = ${(+producto.StockAvaible + +sale[0].Quantity)}, 
        StockOnHand = ${+producto.StockOnHand - +sale[0].Quantity}
        WHERE Folio = '${producto.Folio}'
    `
    
    const responseProduct = await productoObj.exectQuery(sqlUpdateStock);
    
    if(!responseProduct) {
        return res.status(500).json({status : 500, msg: "Hubo un error al actualizar los productos"})
    }
    
    const sqlDeleteProduct = `DELETE FROM SaleProduct WHERE SaleFolio = ${saleId} AND ProductFolio = '${productId}'`
    const response = saleProductObj.exectQuery(sqlDeleteProduct);

    if(response) {
        io.emit('saleUpdate')
        return res.status(200).json({
            status : 200, 
            msg: "Producto eliminado con exito"
        })
    } else {
        return res.status(500).json({status : 500, msg: "Hubo un error al eliminar el producto"})
    }
}

const changeStatus = async(req, res) => {
    const { id } = req.params;
    const { statusId } = req.body;

    const saleObj = new Sale();
    const productObj = new Product();
    const saleProductObj = new SaleProduct()

    if(+statusId === 4) {
        const products = await saleProductObj.getByElementArray('SaleFolio', id);
    
        for(let i=0; i<products.length; i++) {
            const product = await productObj.getByFolio(products[i].ProductFolio);
    
            const res = await productObj.updateOneColumn(product.Folio, 'StockOnHand', (+product.StockOnHand - +products[i].Quantity))
            
            if(!res) {
                return res.status(500).json({
                    status : 500, 
                    msg : "Ha habido un error al actualizar los productos"
                }) 
            }
        }
    }


    const response = await saleObj.updateOneColumn(id, "StatusID", statusId)

    if(response) {
        io.emit('saleUpdate');

        return res.status(201).json({
            status : 200, 
            msg : "Se ha actualizado el estado de la compra"
        }) 
    } else {
        return res.status(500).json({
            status : 500, 
            msg : "Ha habido un error al actualizar la compra"
        })  
    }
}


export {
    getAllSales, 
    addNewSale, 
    updateSale, 
    toggleSale, 
    deleteSaleProduct, 
    deleteSale, 
    changeStatus
}