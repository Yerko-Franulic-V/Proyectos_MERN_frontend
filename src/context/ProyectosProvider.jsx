import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'

import useAuth from '../hooks/useAuth'

let socket

const ProyectosContext = createContext()

const ProyectosProvider = ({ children }) => {

    const { auth } = useAuth()
    const navigate = useNavigate()

    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})

    const [alerta, setAlerta] = useState({})
    const [cargando, setCargando] = useState(false)

    const [modalFormTarea, setModalFormTarea] = useState(false)
    const [modalEliminaTarea, setModalEliminaTarea] = useState(false)
    const [modalEliminaColaborador, setModalEliminaColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    useEffect(() => {
        const obtenerProyectos = async () => {

            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const { data } = await clienteAxios.get('/proyectos', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })

                setProyectos(data)
                //console.log(data)

            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    //ALERTA --------------------

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta)
    }

    //PROYECTOS --------------------

    const submitProyecto = async (proyecto) => {

        const token = localStorage.getItem("token")
        if (!token) return

        if (proyecto.id) {
            await editarProyecto(proyecto, token)
        } else {
            await nuevoProyecto(proyecto, token)
        }
    }

    const editarProyecto = async (proyecto, token) => {

        try {
            // En caso de post va en el sig. orden -> clienteAxios.post(URL, Datos, Configuracion)
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            //Sincronizar el State
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: "Proyecto actualizado Correctamente",
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const nuevoProyecto = async (proyecto, token) => {

        try {

            // En caso de post va en el sig. orden -> clienteAxios.post(URL, Datos, Configuracion)
            const { data } = await clienteAxios.post('/proyectos', proyecto, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            if (data._id) {

                setProyectos([...proyectos, data])

                setAlerta({
                    msg: "Proyecto creado Correctamente",
                    error: false
                })

                setTimeout(() => {
                    setAlerta({})
                    navigate("/proyectos")
                }, 3000)
            }

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const obtenerProyecto = async (id) => {

        setCargando(true)

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            // En caso de post va en el sig. orden -> clienteAxios.post(URL, Datos, Configuracion)
            const { data } = await clienteAxios.get(`/proyectos/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setProyecto(data)
            setAlerta({})

        } catch (error) {
            navigate("/proyectos")

            setAlerta({
                msg: error.response.data.msg,
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async (id) => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            // En caso de post va en el sig. orden -> clienteAxios.post(URL, Datos, Configuracion)
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            //console.log(data)
            //Filtrar el proyecto eliminado del state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    //TAREAS --------------------

    const handleModalTarea = () => {
        setAlerta({})
        setModalFormTarea(!modalFormTarea)
        setTarea({})
    }

    const submitTarea = async (tarea) => {

        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
    }

    const crearTarea = async (tarea) => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const { data } = await clienteAxios.post("/tareas", tarea, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            //console.log(data)

            // Socket IO se encarga de actualizar la nueva tarea al state

            setAlerta({})
            handleModalTarea()

            //SOCKET IO
            socket.emit("nueva tarea", data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const editarTarea = async (tarea) => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setAlerta({})
            setModalFormTarea(false)

            //socket io
            socket.emit("actualizar tarea", data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea)
        setModalFormTarea(true)
    }

    const handleModalEliminaTarea = (tarea) => {
        setTarea(tarea)
        setModalEliminaTarea(!modalEliminaTarea)
    }

    const eliminarTarea = async () => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setAlerta({
                msg: data.msg,
                error: false
            })

            setModalEliminaTarea(false)

            //Socket
            socket.emit("eliminar tarea", tarea)

            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 4000)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const completarTarea = async (id) => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setTarea({})
            setAlerta({})

            //socket io
            socket.emit("cambiar estado", data)

        } catch (error) {
            console.log(error)
        }
    }

    //COLABORADOR --------------------

    const submitColaborador = async (email) => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const { data } = await clienteAxios.post(`/proyectos/colaboradores`, { email }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setColaborador(data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const agregarColaborador = async (email) => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            proyecto.colaboradores.push(colaborador._id)
            setColaborador({})

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate(`/proyectos/${proyecto._id}`)
            }, 3000)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setColaborador(colaborador)
        setModalEliminaColaborador(!modalEliminaColaborador)
    }

    const eliminarColaborador = async () => {

        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            //Filtrar el colaborador eliminado del arreglo de colaboradores del proyecto
            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)
            setColaborador({})
            setModalEliminaColaborador(false)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    //BUSCADOR --------------------

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //SOCKET IO --------------------

    const submitTareasProyecto = (tarea) => {
        // agrega la tarea al state al agregar
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        // actualizar la tarea al state al eliminar
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const editarTareaProyecto = (tarea) => {
        // actualizar la tarea al state al editar
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = (tarea) => {
        // actualizar la tarea al state al completar la tarea
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setTarea({})
        setColaborador({})
        setAlerta({})
    }

    return (
        <ProyectosContext.Provider
            value={{
                cerrarSesionProyectos,

                alerta,
                mostrarAlerta,
                cargando,

                proyectos,
                submitProyecto,
                obtenerProyecto,
                proyecto,                
                eliminarProyecto,

                modalFormTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminaTarea,
                handleModalEliminaTarea,
                eliminarTarea,
                completarTarea,

                colaborador,
                submitColaborador,
                agregarColaborador,
                eliminarColaborador,
                handleModalEliminarColaborador,
                modalEliminaColaborador,

                buscador,
                handleBuscador,

                submitTareasProyecto,
                eliminarTareaProyecto,
                editarTareaProyecto,
                cambiarEstadoTarea
            }}
        >{children}
        </ProyectosContext.Provider>
    )
}

export { ProyectosProvider }

export default ProyectosContext