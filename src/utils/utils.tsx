export const API_BASE_URL = "https://localhost:44349/api/";


export const API_ROUTES = {
    estudiante: {
        crear: `${API_BASE_URL}Estudiante/CrearEstudiante`,
        editar: `${API_BASE_URL}Estudiante/ActualizarEstudiante`,
        eliminar: `${API_BASE_URL}Estudiante/EliminarEstudiante`,
        listar: `${API_BASE_URL}Estudiante/GetAllEstudiantes`,
        obtenerPorId: `${API_BASE_URL}Estudiante/ObtenerEstudiante`,
        search: `${API_BASE_URL}Estudiante/Search`,
        selector: `${API_BASE_URL}Estudiante/SelectorEstudiante`
    },
    materia: {
        crear: `${API_BASE_URL}Materia/CrearMateria`,
        editar: `${API_BASE_URL}Materia/ActualizarMateria`,
        eliminar: `${API_BASE_URL}Materia/EliminarMateria`,
        listar: `${API_BASE_URL}Materia/GetAllMaterias`,
        obtenerPorId: `${API_BASE_URL}Materia/ObtenerMateria`,
        obtenerMateriaPorId: `${API_BASE_URL}Materia/ObtenerMateriaPorGrado`
    },
    grado: {
        selector: `${API_BASE_URL}Grado/SelectorGrados`
    },
    paralelo: {
        crear: `${API_BASE_URL}Paralelo/CrearParalelo`,
        editar: `${API_BASE_URL}Paralelo/ActualizarParalelo`,
        eliminar: `${API_BASE_URL}Paralelo/EliminarParalelo`,
        listar: `${API_BASE_URL}Paralelo/GetAllParalelos`,
        selector: `${API_BASE_URL}Paralelo/SelectorParalelos`,
        obtenerPorId: `${API_BASE_URL}Paralelo/ObtenerParaleloPorId`
    },
    matricula: {
        obtenerPorId: `${API_BASE_URL}Matricula/ObtenerMatriculaPorId`,
        crear: `${API_BASE_URL}Matricula/Crear`,
        eliminar: `${API_BASE_URL}Matricula/EliminarMateria`,
        obtenerMateriaPorIdEstudiante: `${API_BASE_URL}ObtenerMatriculaPorEstudiante`,
        actualizar: `${API_BASE_URL}Matricula/ActualizarMatricula`,
        getAll: `${API_BASE_URL}Matricula/GetAll`,
    },
    auth: {
        login: `${API_BASE_URL}Auth/login`,
        register: `${API_BASE_URL}Auth/register`
    },
    gradoParalelo: {
        disponibles: `${API_BASE_URL}GradoParalelo/Disponibles`,
        crear: `${API_BASE_URL}GradoParalelo/Crear`,
        cuposDisponiblesPorEstudiante: `${API_BASE_URL}GradoParalelo/GetCuposDisponibles`
    }, 
    anioLectivo: {
        selector: `${API_BASE_URL}AnioLectivo/SelectorAnioLectivo`
    }
} as const;