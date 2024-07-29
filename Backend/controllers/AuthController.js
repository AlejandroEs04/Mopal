import checkPassword from "../helpers/checkPassword.js";
import generarJWT from "../helpers/generarJWT.js";
import User from "../models/User.js";

const auth = async(req, res) => {
    const { UserName, Password } = req.body;
    const userObj = new User(req.body);

    const user = await userObj.getByElement('UserName', UserName);

    if(!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(401).json({msg: error.message});
    }

    if(user?.Active === 0) {
        const error = new Error("Error, Acceso denegado");
        return res.status(401).json({msg: error.message});
    }

    if(await checkPassword(Password, user.Password)) {
        const { Password, ...userAuth } = user;
        userAuth.token = generarJWT(user.ID);
        
        return res.json(userAuth);
    } else {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message})
    }
}

const getAuth = async(req, res) => {
    const { user } = req

    return res.json(user)
}

export {
    auth, 
    getAuth
}