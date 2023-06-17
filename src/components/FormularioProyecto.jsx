import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Alerta from "./Alerta"
import useProyectos from "../hooks/useProyectos"


const FormularioProyecto = () => {

    const params = useParams()
    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    const { alerta, mostrarAlerta, submitProyecto, proyecto } = useProyectos()
    const { msg } = alerta

    useEffect(() => {
        mostrarAlerta({})

        if (params.id) {
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [params])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validarFormulario()) {
            await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente })

            setId(null)
            setNombre("")
            setDescripcion("")
            setFechaEntrega("")
            setCliente("")
        }
    }

    const validarFormulario = () => {

        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return false
        } else {
            mostrarAlerta({})
        }

        return true
    }

    return (
        <>
            <form className="bg-white py-10 px-5 md:w1/2 rounded-lg shadow-xl" onSubmit={handleSubmit}>

                {msg && <Alerta alerta={alerta} />}

                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="nombre"
                    >Nombre Proyecto
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        placeholder="Nombre del Proyecto"
                        value={nombre}
                        onChange={(e) => { setNombre(e.target.value) }}
                    />
                </div>
                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="descripcion"
                    >Descripcion
                    </label>
                    <textarea
                        id="descripcion"
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        placeholder="Descripcion"
                        value={descripcion}
                        onChange={(e) => { setDescripcion(e.target.value) }}
                    ></textarea>
                </div>
                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="fecha-entrega"
                    >Fecha de Entrega
                    </label>
                    <input
                        id="fecha-entrega"
                        type="date"
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={fechaEntrega}
                        onChange={(e) => { setFechaEntrega(e.target.value) }}
                    />
                </div>
                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="cliente"
                    >Nombre Cliente
                    </label>
                    <input
                        id="cliente"
                        type="text"
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        placeholder="Nombre del Cliente"
                        value={cliente}
                        onChange={(e) => { setCliente(e.target.value) }}
                    />
                </div>

                <input
                    type="submit"
                    value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                    className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
                />
            </form>
        </>
    )
}

export default FormularioProyecto