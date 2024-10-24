import { Request, Response } from "express"
import EntityRecord from "../models/Entity"

export class EntityController {
    static getAllEntites = async(req: Request, res: Response) => {
        try {
            const entities = await new EntityRecord().getAll()
            res.json(entities) 
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }   
    }

    static createEntity = async(req: Request, res: Response) => {
        const entity = new EntityRecord(req.body)

        try {
            if(entity.email && (await entity.getByElement('email', entity.email)).length) {
                res.status(400).json({ msg: 'Ya existe un cliente / proveedor con el mismo correo' })
                return
            }   

            await entity.create(entity)
            res.send('Cliente/Proveedor creado correctamente')
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }

    static updateEntity = async(req: Request, res: Response) => {
        const { id } = req.params
        const entity = new EntityRecord(req.body)

        try {
            await entity.update(id, entity)
            res.send('Cliente/Proveedor actualizado correctamente')
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }

    static deleteEntity = async(req: Request, res: Response) => {

    }

    static addEntityDiscount = async(req: Request, res: Response) => {
        
    }

    static deleteEntityDiscount = async(req: Request, res: Response) => {

    }

    static addEntityUser = async(req: Request, res: Response) => {

    }

    static deleteEntityUser = async(req: Request, res: Response) => {

    }
}