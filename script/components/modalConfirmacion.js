// ======================================================
// modalConfirmacion.js
//
// Componente reutilizable para mostrar confirmaciones.
//
// Responsabilidades:
// - Abrir modal de confirmación.
// - Cambiar mensaje.
// - Esperar respuesta del usuario.
// - Cerrar modal.
// - Devolver true / false.
// - Gestionar correctamente el foco y aria-hidden.
// ======================================================

// ======================================================
// Elementos DOM
// ======================================================
const elementos = {
    modal:
        document.getElementById("modal-confirm"),
    mensaje:
        document.getElementById("modal-message"),
    botonCancelar:
        document.getElementById("modal-no"),
    botonAceptar:
        document.getElementById("modal-yes")
};
// Guarda el elemento que tenía el foco antes
// de abrir el modal.
let elementoAnterior = null;
// ======================================================
// Mostrar confirmación
// ======================================================
export function confirmarAccion(mensaje) {
    return new Promise((resolve) => {
        if (!elementos.modal) {
            resolve(false);
            return;
        }
        // Guardamos el botón que abrió el modal.
        elementoAnterior =
            document.activeElement;
        // Actualiza el mensaje.
        elementos.mensaje.textContent =
            mensaje;
        // Hace visible el modal.
        elementos.modal.classList.remove(
            "hidden"
        );
        // Ahora el modal es accesible.
        elementos.modal.setAttribute(
            "aria-hidden",
            "false"
        );
        // Movemos el foco dentro del modal.
        elementos.botonCancelar.focus();
        // ==================================================
        // Aceptar
        // ==================================================
        const aceptar = () => {
            cerrarModal();
            limpiarEventos();
            resolve(true);
        };
        // ==================================================
        // Cancelar
        // ==================================================
        const cancelar = () => {
            cerrarModal();
            limpiarEventos();
            resolve(false);
        };
        // Eventos temporales.
        elementos.botonAceptar.onclick =
            aceptar;
        elementos.botonCancelar.onclick =
            cancelar;
        // ==================================================
        // Limpia los eventos después de responder.
        // ==================================================
        function limpiarEventos() {
            elementos.botonAceptar.onclick =
                null;
            elementos.botonCancelar.onclick =
                null;
        }
    });
}
// ======================================================
// Cerrar modal
// ======================================================
function cerrarModal() {
    // Primero devolvemos el foco al elemento
    // que abrió el modal.
    if (
        elementoAnterior &&
        typeof elementoAnterior.focus === "function"
    ) {
        elementoAnterior.focus();
    }
    // Ocultamos visualmente el modal.
    elementos.modal.classList.add(
        "hidden"
    );
    // Ahora sí lo ocultamos para lectores de pantalla.
    elementos.modal.setAttribute(
        "aria-hidden",
        "true"
    );
    elementoAnterior = null;
}