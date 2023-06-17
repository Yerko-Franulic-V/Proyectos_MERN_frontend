import useAuth from "../hooks/useAuth"
import useProyectos from "../hooks/useProyectos"

const useAdmin = () => {

    const { proyecto } = useProyectos()
    const { auth } = useAuth()

  return proyecto.creador === auth._id
}

export default useAdmin