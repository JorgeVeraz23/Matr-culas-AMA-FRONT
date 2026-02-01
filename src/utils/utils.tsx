export const API_BASE_URL = "https://localhost:44349/api/";
// export const API_BASE_URL = "https://matriculasama-api-hcgjfpc9fha2bmar.brazilsouth-01.azurewebsites.net/api/";

export const API_ROUTES = {
  estudiante: {
    crear: `${API_BASE_URL}Estudiante/CrearEstudiante`,
    editar: `${API_BASE_URL}Estudiante/ActualizarEstudiante`,
    eliminar: `${API_BASE_URL}Estudiante/EliminarEstudiante`,
    listar: `${API_BASE_URL}Estudiante/GetAllEstudiantes`,
    obtenerPorId: `${API_BASE_URL}Estudiante/ObtenerEstudiante`,
    search: `${API_BASE_URL}Estudiante/Search`,
    selector: `${API_BASE_URL}Estudiante/SelectorEstudiante`,
    selectorEstudianteDocs: `${API_BASE_URL}Estudiante/SelectorEstudianteDocs`,
  },
  tipoDocumento: {
    listar: `${API_BASE_URL}TipoDocumento/list`,
  },
  materia: {
    crear: `${API_BASE_URL}Materia/CrearMateria`,
    editar: `${API_BASE_URL}Materia/ActualizarMateria`,
    eliminar: `${API_BASE_URL}Materia/EliminarMateria`,
    listar: `${API_BASE_URL}Materia/GetAllMaterias`,
    obtenerPorId: `${API_BASE_URL}Materia/ObtenerMateria`,
    obtenerMateriaPorId: `${API_BASE_URL}Materia/ObtenerMateriaPorGrado`,
  },

  grado: {
    selector: `${API_BASE_URL}Grado/SelectorGrados`,
  },

  paralelo: {
    crear: `${API_BASE_URL}Paralelo/CrearParalelo`,
    editar: `${API_BASE_URL}Paralelo/ActualizarParalelo`,
    eliminar: `${API_BASE_URL}Paralelo/EliminarParalelo`,
    listar: `${API_BASE_URL}Paralelo/GetAllParalelos`,
    selector: `${API_BASE_URL}Paralelo/SelectorParalelos`,
    obtenerPorId: `${API_BASE_URL}Paralelo/ObtenerParaleloPorId`,
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
    register: `${API_BASE_URL}Auth/register`,
    changepassword: `${API_BASE_URL}Auth/change-password`,
  },

  representante: {
    listar: `${API_BASE_URL}Representante/Listar`,
    obtenerPorId: (id: number) =>
      `${API_BASE_URL}Representante/ObtenerPorId/${id}`,
    crear: `${API_BASE_URL}Representante/Crear`,
    actualizar: (id: number) =>
      `${API_BASE_URL}Representante/Actualizar/${id}`,
    eliminar: (id: number) =>
      `${API_BASE_URL}Representante/Eliminar/${id}`,
    selector: `${API_BASE_URL}Representante/selector`  
  },

  gradoParalelo: {
    disponibles: `${API_BASE_URL}GradoParalelo/Disponibles`,
    crear: `${API_BASE_URL}GradoParalelo/Crear`,
    cuposDisponiblesPorEstudiante: `${API_BASE_URL}GradoParalelo/GetCuposDisponibles`,
  },

  anioLectivo: {
    selector: `${API_BASE_URL}AnioLectivo/SelectorAnioLectivo`,
  },

  rol: {
    selector: `${API_BASE_URL}Role/GetAllRoles`,
  },

  users: {
    getAll: `${API_BASE_URL}Users/ObtenerUsuarios`,
    crearUsuario: `${API_BASE_URL}Users/CrearUsuario`,
    getById: (id: string) => `${API_BASE_URL}Users/ObtenerUsuario/${id}`,
    actualizarUsuario: (id: string) =>
      `${API_BASE_URL}Users/ActualizarUsuario/${id}`,
    eliminarUsuario: (id: string) =>
      `${API_BASE_URL}Users/DesactivarUsuario/${id}`,
    reactivarUsuario: (id: string) =>
      `${API_BASE_URL}Users/ReactivarUsuario/${id}`,
  },

  profesor: {
    crear: `${API_BASE_URL}Profesor/CrearProfesor`,
    obtenerPorId: (id: number | string) =>
      `${API_BASE_URL}Profesor/ObtenerPorId?id=${id}`,
    listar: `${API_BASE_URL}Profesor/GetAll`,
    actualizar: (id: number | string) => `${API_BASE_URL}Profesor/${id}`,
    eliminar: (id: number | string) =>
      `${API_BASE_URL}Profesor/Eliminar?id=${id}`,
    search: (q: string, take: number = 10) =>
      `${API_BASE_URL}Profesor/search?q=${encodeURIComponent(q)}&take=${take}`,
  },
  documento: {
  upload: `${API_BASE_URL}Document/upload`,
  listarPorEstudiante: (estudianteId: number) =>
    `${API_BASE_URL}Document/estudiante/${estudianteId}`,
  aprobar: (id: number) => `${API_BASE_URL}Document/${id}/aprobar`,
  download: (id: number) => `${API_BASE_URL}Document/${id}/download`,
},


} as const;
