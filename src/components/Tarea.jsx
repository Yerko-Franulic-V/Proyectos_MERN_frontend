import { formatearFecha } from "../helpers/formatearFecha"

import useAdmin from "../hooks/useAdmin"
import useProyectos from "../hooks/useProyectos"

const Tarea = ({ tarea }) => {

    const { handleModalEditarTarea, handleModalEliminaTarea, completarTarea } = useProyectos()
    const admin = useAdmin()

    const { nombre, descripcion, fechaEntrega, prioridad, estado, _id } = tarea

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className="mb-1 text-xl">{nombre}</p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
                <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-1 text-xl">Prioridad: {prioridad}</p>
                {estado && <p className="text-xs bg-green-600 uppercase p-2 rounded-lg text-white text-center">Completada por: {tarea.completado.nombre}</p>}
            </div>

            <div className="flex flex-col lg:flex-row gap-2">

                {admin && (
                    <button
                        onClick={() => handleModalEditarTarea(tarea)}
                        className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-indigo-800"
                    >Editar</button>
                )}

                <button
                    onClick={() => completarTarea(_id)}
                    className={`${estado ? 'bg-sky-600 hover:bg-sky-800' : 'bg-gray-600 hover:bg-gray-800'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                >{estado ? "Completa" : "Incompleta"}</button>

                {admin && (
                    <button
                        onClick={() => handleModalEliminaTarea(tarea)}
                        className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-red-800"
                    >Eliminar</button>
                )}
            </div>
        </div>
    )
}

export default Tarea