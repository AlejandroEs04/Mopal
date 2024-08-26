import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import PurchaseProduct from "../models/PurchaseProduct.js";
import Sale from "../models/Sale.js"
import SaleProduct from "../models/SaleProduct.js"
import axios from 'axios'

const getProductsSaleTotal = async(req, res) => {
    let sales = await new Sale().getAll();
    const saleProducts = await new SaleProduct().getAll();
    const formatedSales = []

    if(sales.length === 0) {
        return res.json({ msg : `Aun no hay ventas` })
    }

    for(let i = 0; i<sales.length; i++) {
        let formatedProducts = []
        const products = saleProducts.filter(product => +product.SaleFolio === +sales[i].Folio)

        if(products.length > 0) {
            formatedProducts = products.map(product => {
                return {
                    id : product.ProductFolio, 
                    quantity : product.Quantity, 
                    price : (product.PricePerUnit - (product.PricePerUnit * (product.Discount / 100))), 
                }
            })

            formatedSales.push({
                id : sales[i].Folio, 
                date : sales[i].SaleDate, 
                user_id : sales[i].CustomerID,
                amount : +sales[i].Amount,
                products : formatedProducts
            })
        }
    }

    try {
        const { data : productsInfo } = await axios.post(`${process.env.INVENTORY_API_URL}/product-analysis`, formatedSales)
        const { data : salesInfo } = await axios.post(`${process.env.INVENTORY_API_URL}/action-analysis`, formatedSales)

        return res.status(201).json({
            products : productsInfo,
            sales : salesInfo
        })
    } catch (error) {
        return res.status(500).json({ msg: "Hubo un error" })
    }
}

const getInventoryMovement = async(req, res) => {
    const sales = await new Sale().getAll();
    const saleProducts = await new SaleProduct().getAll();
    const purchases = await new Purchase().getAll()
    const purchaseProducts = await new PurchaseProduct().getAll();
    const productsDB = await new Product().getAll()

    let salesFormated = []
    let purchasesFormated = []
    let productsFormated = []

    for(let i = 0; i<sales.length; i++) {
        let formatedProducts = []
        const products = saleProducts.filter(product => +product.SaleFolio === +sales[i].Folio)

        if(products.length > 0) {
            formatedProducts = products.map(product => {
                return {
                    id : product.ProductFolio, 
                    quantity : product.Quantity, 
                    price : (product.PricePerUnit - (product.PricePerUnit * (product.Discount / 100))), 
                }
            })

            salesFormated.push({
                id : sales[i].Folio, 
                date : sales[i].SaleDate, 
                user_id : sales[i].CustomerID,
                amount : +sales[i].Amount,
                products : formatedProducts
            })
        }
    }

    for(let i = 0; i<purchases.length; i++) {
        let formatedProducts = []
        const products = purchaseProducts.filter(product => +product.PurchaseFolio === +purchases[i].Folio)

        if(products.length > 0) {
            formatedProducts = products.map(product => {
                return {
                    id : product.ProductFolio, 
                    quantity : product.Quantity, 
                    price : (product.PricePerUnit - (product.PricePerUnit * (product.Discount / 100))), 
                }
            })

            purchasesFormated.push({
                id : purchases[i].Folio, 
                date : purchases[i].PurchaseDate, 
                user_id : purchases[i].SupplierID,
                amount : +purchases[i].Amount,
                products : formatedProducts
            })
        }
    }

    for(let i = 0; i<productsDB.length;i++) {
        productsFormated = productsDB.map(product => {
            return {
                id : product.Folio, 
                stock : +product.StockAvaible + +product.StockOnWay, 
                price : +product.ListPrice, 
            }
        })
    }

    try {
        const { data } = await axios.post(`${process.env.INVENTORY_API_URL}/inventory-analysis`, {
            products : productsFormated, 
            sales : salesFormated, 
            purchases : purchasesFormated
        })

        return res.status(201).json(data)
    } catch (error) {
        return res.status(500).json({
            msg: error.response.data
        })
    }
}

const getSaleReport = async(req, res) => {
    const { user, trader, products = [], id, fromDate, toDate } = req.body
    let sales = await new Sale().getAll();
    let saleProducts = await new SaleProduct().getAll();
    const productsDB = await new Product().getAll()

    if(id) {
        sales = sales.filter(sale => +sale.Folio === id)
    }

    if(user) {
        sales = sales.filter(sale => +sale.CustomerID === user)
    }

    if(trader) {
        sales = sales.filter(sale => +sale.UserID === trader)
    }

    if(fromDate && toDate) {
        sales = sales.filter(sale => 
                new Date(sale.SaleDate).getTime() >= new Date(fromDate).getTime() &&
                new Date(sale.SaleDate).getTime() <= new Date(toDate).getTime()
        )
    } else if(fromDate) {
        sales = sales.filter(sale => new Date(sale.SaleDate).getTime() >= new Date(fromDate).getTime())
    } else if(toDate) {
        sales = sales.filter(sale => new Date(sale.SaleDate).getTime() <= new Date(toDate).getTime())
    }

    for(let i = 0; i<sales.length; i++) {
        const saleProduct = saleProducts.filter(product => {
            if(product.SaleFolio === sales[i].Folio && products.length != 0) {
                if(products.includes(product.ProductFolio)) {
                    return true
                } else {
                    return false
                }
            } else if(product.SaleFolio === sales[i].Folio) {
                return true
            } else {
                return false
            }
        })

        const productsNew = saleProduct.map(product => {
            const productCurrent = productsDB.map(productDB => {
                if(productDB.Folio === product.ProductFolio) {
                    return {
                        ...product, 
                        Name: productDB.Name, 
                        Description: productDB.Description
                    } 
                }
            })

            return productCurrent.filter(item => item != undefined)[0]
        })

        sales[i].products = productsNew
    }

    sales = sales.filter(sale => sale.products.length > 0)

    return res.status(201).json({
        sales
    })
}

export {
    getProductsSaleTotal, 
    getInventoryMovement, 
    getSaleReport
}