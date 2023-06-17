import { useState, useEffect } from "react"
import { useParams, Link } from 'react-router-dom'
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"


const NuevoPassword = () => {

  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')

  const [tokenValido, setTokenValido] = useState(false)
  const [passwordModificado, setPasswordModificado] = useState(false)

  const [alerta, setAlerta] = useState({})
  const { msg } = alerta

  const params = useParams()
  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios.get(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validarFormulario()) {

      try {
        const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, { password })

        setAlerta({
          msg: data.msg,
          error: false
        })
        setPasswordModificado(true)
        setPassword('')
        setRepetirPassword('')

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
  }

  const validarFormulario = () => {

    if ([password, repetirPassword].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return false
    } else if (password !== repetirPassword) {
      setAlerta({
        msg: 'Los password no son iguales',
        error: true
      })
      return false
    } else if (password.length < 6) {
      setAlerta({
        msg: 'El password es muy corto, agrega minimo 6 caracteres',
        error: true
      })
      return false
    } else {
      setAlerta({})
    }

    return true
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu password y no pierdas acceso a tus
        <span className="text-slate-700"> proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (

        <form className="my-10 bg-white shadow rounded-lg px-10 py-10" onSubmit={handleSubmit}>

          <div className="my-5">

            <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password de registro"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

          </div>
          <div className="my-5">

            <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password2">Repetir Password</label>
            <input
              id="password2"
              type="password"
              placeholder="Repite tu Password de registro"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={repetirPassword}
              onChange={e => setRepetirPassword(e.target.value)}
            />

          </div>

          <input
            type="submit"
            value="Guardar Nuevo Password"
            className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors" />

        </form>

      )}

      {passwordModificado && (
        <Link className="block text-center my-5 text-slate-500 uppercase text-sm hover:text-sky-600" to="/">Inicia Sesión</Link>
      )}
    </>


  )
}

export default NuevoPassword