import Swal from "sweetalert2";

type ActionType = 'create' | 'edit' | 'delete'; // Definimos los tipos posibles para la acción

const ModalSweetAlert = (action: ActionType, onConfirm: () => void) => {
  let title = '';
  let text = '';
  let icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'question'; // Definimos los valores permitidos para 'icon'
  
  // Definir los mensajes según la acción
  switch (action) {
    case 'create':
      title = '¿Estás seguro de crear este estudiante?';
      text = 'Se creará un nuevo estudiante con los datos proporcionados.';
      icon = 'info';
      break;
    case 'edit':
      title = '¿Estás seguro de editar este estudiante?';
      text = 'Los cambios se guardarán y serán permanentes.';
      icon = 'warning';
      break;
    case 'delete':
      title = '¿Estás seguro de eliminar este estudiante?';
      text = 'Una vez eliminado, no podrás revertir esta acción.';
      icon = 'error';
      break;
    default:
      return;
  }

  Swal.fire({
    title: title,
    text: text,
    icon: icon, // Ahora se asegura de que el icono sea de un tipo válido
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: action === 'delete' ? 'Sí, eliminar' : 'Sí, continuar',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      let successMessage = '';
      if (action === 'create') {
        successMessage = '¡Estudiante creado exitosamente!';
      } else if (action === 'edit') {
        successMessage = '¡Estudiante editado exitosamente!';
      } else if (action === 'delete') {
        successMessage = '¡Estudiante eliminado exitosamente!';
      }

      Swal.fire("¡Éxito!", successMessage, "success");
    }
  });
};

export default ModalSweetAlert;
