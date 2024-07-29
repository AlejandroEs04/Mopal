import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        const autenticarUsuario = async() => {
            const token = localStorage.getItem('token');

            if(!token) {
                setLoading(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/auth`, config);
                setAuth(data)
            } catch (error) {
                setAuth({})
            } finally {
                setLoading(false)
            }
        }

        autenticarUsuario();
    }, [])

    const logOut = () => {
        localStorage.removeItem('token');
        setAuth({});
    }

    return (
        <AuthContext.Provider
            value={{
                auth, 
                setAuth,
                loading,
                logOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext