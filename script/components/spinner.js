// ======================================================
// spinner.js
// Controla el indicador de carga.
// ======================================================

let temporizadoresCarga = [];

/**
 * Mensajes que se muestran progresivamente durante
 * una carga prolongada.
 */
const mensajesCarga = [
    {
        demora: 0,
        mensaje: "Preparando tu tienda...",
        detalle: "Conectando con nuestros productos..."
    },
    {
        demora: 5000,
        mensaje: "Buscando productos ecológicos...",
        detalle: "Estamos preparando el catálogo."
    },
    {
        demora: 10000,
        mensaje: "Ya casi estamos...",
        detalle: "Gracias por esperar un momento."
    }
];

/**
 * Limpia todos los temporizadores activos del spinner.
 */
function limpiarTemporizadoresCarga() {
    temporizadoresCarga.forEach((temporizador) => {
        clearTimeout(temporizador);
    });

    temporizadoresCarga = [];
}

/**
 * Actualiza el mensaje principal y el detalle
 * del indicador de carga.
 */
function actualizarMensajeCarga(indice) {
    const mensaje = document.getElementById("spinnerMensaje");
    const detalle = document.getElementById("spinnerDetalle");

    const contenido = mensajesCarga[indice];

    if (!contenido) {
        return;
    }

    if (mensaje) {
        mensaje.textContent = contenido.mensaje;
    }

    if (detalle) {
        detalle.textContent = contenido.detalle;
    }
}

/**
 * Muestra el indicador de carga y programa
 * los mensajes progresivos.
 */
export function mostrarSpinner() {
    const spinner = document.getElementById("spinner");

    if (!spinner) {
        return;
    }

    limpiarTemporizadoresCarga();

    spinner.style.display = "flex";
    spinner.setAttribute("aria-busy", "true");

    actualizarMensajeCarga(0);

    mensajesCarga.slice(1).forEach((contenido, indice) => {
        const temporizador = setTimeout(() => {
            actualizarMensajeCarga(indice + 1);
        }, contenido.demora);

        temporizadoresCarga.push(temporizador);
    });
}

/**
 * Oculta el indicador de carga y cancela
 * los mensajes que todavía no se mostraron.
 */
export function ocultarSpinner() {
    const spinner = document.getElementById("spinner");

    limpiarTemporizadoresCarga();

    if (!spinner) {
        return;
    }

    spinner.style.display = "none";
    spinner.setAttribute("aria-busy", "false");
}