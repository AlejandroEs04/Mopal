import checkPassword from "../helpers/checkPassword.js";
import { emailCreateUser, emailUpdateUser } from "../helpers/email.js";
import hashearPassword from "../helpers/hashearPassword.js";
import { io } from "../index.js";
import CustomerUser from "../models/CustomerUser.js";
import SupplierUser from "../models/SupplierUser.js";
import User from "../models/User.js"
import UserInfo from "../models/UserInfo.js";

const getAllUsers = async(req, res) => {
    const userObj = new UserInfo;
    const users = await userObj.getAll();

    if(users) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            users
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const getOneUser = async(req, res) => {
    const { id } = req.params;
    const userObj = new UserInfo();

    const user = await userObj.getByID(id);

    if(user) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            user
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addNewUser = async(req, res) => {
    const { user } = req.body;
    const userObj = new User(user);

    /** FALTA VALIDACION DEL NOMBRE DE USUARIO Y CORREO */
    const existEmail = await userObj.getByElement('Email', userObj.Email)
    const existUserName = await userObj.getByElement('UserName', userObj.UserName)

    if(existEmail) {
        return res.status(400).json({status : 400, msg: "El correo ya existe"})
    }

    if(existUserName) {
        return res.status(400).json({status : 400, msg: "El nombre de usuario ya existe"})
    }

    await emailCreateUser({
        email: user.Email, 
        fullName: user.LastName + " " + user.Name, 
        userName: user.UserName, 
        password: user.Password
    })

    userObj.Password = await hashearPassword(userObj.Password);

    const response = await userObj.addOne(userObj);
    if(response) {
        if(user.supplier) {
            const typeObj = new SupplierUser({UserID : response.response[0].insertId, SupplierID : user.supplier});
            await typeObj.addOne(typeObj)
        }
    
        if(user.customer) {
            const typeObj = new CustomerUser({UserID : response.response[0].insertId, CustomerID : user.customer});
            await typeObj.addOne(typeObj)
        }

        io.emit('userUpdate')

        return res.status(200).json({
            status : 200, 
            msg: response.msg
        })
    } else {
        return res.status(500).json({status : 500, msg: "Hubo un error"})
    }
}

const updateUser = async(req, res) => {
    const { user } = req.body;
    const userObj = new User(user) 

    const oldUser = await userObj.getByID(user.ID);

    if(user.Password) {
        await emailUpdateUser({
            email: user.Email, 
            fullName: user.LastName + " " + user.Name, 
            userName: user.UserName, 
            password: user.Password
        })
        userObj.Password = await hashearPassword(user.Password)
    } else {
        userObj.Password = oldUser.Password
    }
    const response = await userObj.updateOne(userObj);

    if(response) {
        io.emit('userUpdate')

        return res.status(200).json({
            status : 200, 
            msg: response.msg
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const deleteUser = async(req, res) => {
    const { id } = req.params;
    const userObj = new User();

    const response = await userObj.toggleActiveOne(id, false);
    if(response) {
        io.emit('userUpdate')

        return res.status(200).json({
            status : 200, 
            msg: response.msg
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const recoveryUser = async(req, res) => {
    const { id } = req.params;
    const userObj = new User();

    const response = await userObj.toggleActiveOne(id, true);

    if(response) {
        io.emit('userUpdate')

        return res.status(200).json({
            msg: "Usuario reactivado correctamente"
        })
    } else {
        return res.status(500).json({
            msg: "Hubo un error, intentelo mas tarde"
        })
    }
}

export {
    getAllUsers, 
    getOneUser, 
    addNewUser, 
    updateUser, 
    deleteUser, 
    recoveryUser
}