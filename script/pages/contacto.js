// ======================================================
// contacto.js
//
// Controlador de la página de contacto.
//
// Responsabilidades:
// - Validar el formulario.
// - Mostrar mensajes de error.
// - Simular el envío.
// - Mostrar spinner.
// - Mostrar toast.
// - Limpiar el formulario.
// ======================================================
import {
    esCampoVacio,
    esEmailValido,
    validarLongitud,
    mostrarError,
    limpiarError
} from "../utils/validator.js";

import {
    mostrarToast
} from "../components/toast.js";

import {
    mostrarSpinner,
    ocultarSpinner
} from "../components/spinner.js";

// ======================================================
// Elementos del DOM
// ======================================================
const formulario = document.getElementById("formularioContacto");
const nombre = document.getElementById("tuNombre");
const correo = document.getElementById("tuCorreo");
const asunto = document.getElementById("asunto");
const mensaje = document.getElementById("tuMensaje");
// ======================================================
// Inicialización
// ======================================================
console.log("contacto.js cargado");
function iniciarContacto() {
    if (!formulario) return;
    inicializarValidaciones();
    formulario.addEventListener(
        "submit",
        enviarFormulario
    );
    console.log("iniciarContacto");
}
// ======================================================
// Limpia errores mientras escribe
// ======================================================
function inicializarValidaciones() {
    [nombre, correo, asunto, mensaje].forEach(campo => {
        campo.addEventListener(
            "input",
            () => limpiarError(campo)
        );
    });
}
// ======================================================
// Enviar formulario
// ======================================================
async function enviarFormulario(event) {
    console.log("submit");
    event.preventDefault();

    limpiarError(nombre);
    limpiarError(correo);
    limpiarError(asunto);
    limpiarError(mensaje);
    // ------------------------------
    // Validaciones
    // ------------------------------

    if (esCampoVacio(nombre.value)) {
        mostrarError(
            nombre,
            "Ingrese su nombre."
        );
        nombre.focus();
        return;
    }
    if (!validarLongitud(nombre.value, 3, 50)) {
        mostrarError(
            nombre,
            "Debe tener entre 3 y 50 caracteres."
        );
        nombre.focus();
        return;
    }
    if (esCampoVacio(correo.value)) {
        mostrarError(
            correo,
            "Ingrese su correo."
        );
        correo.focus();
        return;
    }
    if (!esEmailValido(correo.value)) {
        mostrarError(
            correo,
            "Ingrese un correo válido."
        );
        correo.focus();
        return;
    }
    if (esCampoVacio(asunto.value)) {
        mostrarError(
            asunto,
            "Ingrese un asunto."
        );
        asunto.focus();
        return;
    }
    if (esCampoVacio(mensaje.value)) {
        mostrarError(
            mensaje,
            "Ingrese un mensaje."
        );
        mensaje.focus();
        return;
    }
    if (!validarLongitud(mensaje.value, 10, 1000)) {
        mostrarError(
            mensaje,
            "El mensaje debe tener al menos 10 caracteres."
        );
        mensaje.focus();
        return;
    }
    try {
        mostrarSpinner();
        // Simulación de envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        mostrarToast(
            "Mensaje enviado correctamente."
        );
        formulario.reset();
    }
    catch (error) {
        console.error(error);
        mostrarToast(
            "No se pudo enviar el mensaje."
        );
    }
    finally {
        ocultarSpinner();
    }
}
// ======================================================
// Arranque
// ======================================================
document.addEventListener(
    "DOMContentLoaded",
    iniciarContacto
);