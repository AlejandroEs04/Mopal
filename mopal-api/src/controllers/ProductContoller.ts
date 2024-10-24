import type { Request, Response } from 'express'
import ProductRecord from '../models/Product'

export class ProductController {
    static getAllProduct = async(req: Request, res: Response) => {
        try {
            const products = await new ProductRecord().getAll()
            res.json(products)
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }
    
    static createProduct = async(req: Request, res: Response) => {
        if(req.body.lenght) {
            res.status(500).json({ msg: 'Lo sentimos, esta funcion aun no esta disponible' })
            return
        }

        const product = new ProductRecord(req.body)

        try {
            await product.create(product, ['tableName'])
            res.send('Producto registrado correctamente')
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }

    static updateProduct = async(req: Request, res: Response) => {
        const { id } = req.params
        const product = new ProductRecord(req.body)

        try {
            await product.update(id, product)
            res.send('Producto actualizado correctamente')
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }
}