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
//
// Ejemplo:
// const aceptar = await confirmarAccion(
//      "¿Vaciar carrito?"
// );
//
// if(aceptar){
//      ejecutarAccion();
// }
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
// ======================================================
// Mostrar confirmación
// ======================================================
export function confirmarAccion(mensaje) {
    return new Promise((resolve) => {
        if (!elementos.modal) {
            resolve(false);
            return;
        }
        // Actualiza mensaje
        elementos.mensaje.textContent =
            mensaje;
        // Muestra modal
        elementos.modal.classList.remove(
            "hidden"
        );
        // ------------------------------
        // Aceptar
        // ------------------------------
        const aceptar = () => {
            cerrarModal();
            limpiarEventos();
            resolve(true);
        };
        // ------------------------------
        // Cancelar
        // ------------------------------
        const cancelar = () => {
            cerrarModal();
            limpiarEventos();
            resolve(false);
        };
        // ------------------------------
        // Eventos temporales
        // ------------------------------
        elementos.botonAceptar.onclick =
            aceptar;
        elementos.botonCancelar.onclick =
            cancelar;
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
    elementos.modal.classList.add(
        "hidden"
    );
}