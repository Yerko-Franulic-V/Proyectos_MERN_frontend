import { useState } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

    const { mostrarAlerta, alerta, submitColaborador } = useProyectos()
    const [email, setEmail] = useState('')
    const { msg } = alerta

    const handleSubmit = async (e) => {
        e.preventDefault()

        mostrarAlerta({})

        if (email === '') {
            mostrarAlerta({
                msg: "El email es obligatorio",
                error: true
            })
            return
        }

        await submitColaborador(email)
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white py-10 px-5 lg:w-1/2 w-full rounded-lg shadow">

                {msg && <Alerta alerta={alerta} />}

                <div className='mb-5 mt-5'>
                    <label
                        htmlFor='email'
                        className='text-gray-700 uppercase font-bold text-sm'
                    >Email Colaborador</label>
                    <input
                        type='email'
                        id="email"
                        placeholder='Email del usuario'
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <input
                    type='submit'
                    className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-lg text-sm'
                    value='Buscar Colaborador' />
            </form>
        </>
    )
}

export default FormularioColaborador