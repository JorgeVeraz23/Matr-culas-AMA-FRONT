export const API_BASE_URL = "https://localhost:7016/api/";


export const API_ROUTES = {
    estudiante: {
        crear: `${API_BASE_URL}Estudiantes/CrearEstudiante`,
        editar: `${API_BASE_URL}Estudiantes/ActualizarEstudiante`,
        eliminar: `${API_BASE_URL}Estudiantes/EliminarEstudiante`,
        listar: `${API_BASE_URL}Estudiantes/GetAllEstudiantes`,
        obtenerPorId: `${API_BASE_URL}Estudiantes/ObtenerEstudiante`
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
        obtenerPorId: `${API_BASE_URL}Paralelo/ObtenerParaleloPorId`
    },
    matricula: {
        obtenerPorId: `${API_BASE_URL}Matricula/ObtenerMatriculaPorId`,
        crear: `${API_BASE_URL}Matricula/CrearMatricula`,
        eliminar: `${API_BASE_URL}Matricula/EliminarMateria`,
        obtenerMateriaPorIdEstudiante: `${API_BASE_URL}ObtenerMatriculaPorEstudiante`,
        actualizar: `${API_BASE_URL}Matricula/ActualizarMatricula`

    }
} as const;