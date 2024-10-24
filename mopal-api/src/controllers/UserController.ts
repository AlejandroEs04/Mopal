import type { Request, Response } from 'express'
import UserRecord from '../models/User'
import { hashPassword } from '../utils/utils'

export class UserController {
    static getAllUser = async(req: Request, res: Response) => {
        try {
            const users = await new UserRecord().getAll()
            res.json(users)
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }

    static createUser = async(req: Request, res: Response) => {
        const user = new UserRecord(req.body)

        try {
            // Check if there some else with same credentials
            if((await user.getByElement('email', user.email)).length) {
                res.status(400).json({ msg: 'Ya existe otro usuario con el mismo correo' })
                return
            }

            if((await user.getByElement('userName', user.userName)).length) {
                res.status(400).json({ msg: 'Ya existe otro usuario con el mismo correo' })
                return
            }

            // TODO: Add email sending

            user.password = await hashPassword(user.password)

            await user.create(user)
            res.send('Usuario creado correctamente')
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }

    static updateUser = async(req: Request, res: Response) => {
        const { id } = req.params
        const user = new UserRecord(req.body)

        try {
            const oldUser = await user.getById(id)

            // if password changes, we gonna hash the new password, if it's not, we gonna pass the last password
            if(user.password) {
                // TODO: Add email sending
                user.password = await hashPassword(user.password)
            } else {
                user.password = oldUser.password
            }

            // TODO: Add customer or supplier user

            await user.update(id, user)
            res.send('Usuario actualizado correctamente')
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }

    static deleteUser = async(req: Request, res: Response) => {
        const { id } = req.params
        
        try {
            await new UserRecord().deleteById(id)
            res.send('Usuario eliminado correctamente')
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }
}