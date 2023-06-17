import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const autenticarUsuario = async () => {

            const token = localStorage.getItem("token")

            if (!token) {
                setCargando(false)
                return
            }

            try {
                //Validacion del token y obtiene perfil de usuario
                const { data } = await clienteAxios.get('/usuarios/perfil', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })

                setAuth(data)

                //console.log("data AuthProv: ", data)
                //console.log("auth PV: ", auth)
                setCargando(false)
                //navigate("/proyectos")

            } catch (error) {
                console.log(error)
                setAuth({})
            }
        }

        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }

export default AuthContext