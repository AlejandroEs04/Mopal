import Sale from "../models/Sale.js"
import SaleProduct from "../models/SaleProduct.js"
import axios from 'axios'

const getProductsSaleTotal = async(req, res) => {
    const { month, year } = req.params
    let sales = await new Sale().getAll();
    const saleProducts = await new SaleProduct().getAll();
    const formatedSales = []

    if(sales.length === 0) {
        return res.json({ msg : `Aun no hay ventas` })
    }

    if(month && year) {
        sales = sales.filter(sale => {
            const saleMonth = new Date(sale.SaleDate).getMonth() + 1
            const saleYear = new Date(sale.SaleDate).getFullYear()

            if(+saleMonth === +month && +saleYear === +year){
                return true
            } else {
                return
            }
        })
        
        if(sales.length === 0) {
            return res.json({ msg : `No hay ventas del ${month}/${year}` })
        }
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
        console.log(error)
        return res.status(500).json({ msg: "Hubo un error" })
    }
}

export {
    getProductsSaleTotal
}