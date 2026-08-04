// ======================================================
// registro.js
//
// Controlador de registro de usuarios.
//
// Responsabilidades:
// - Validar formulario.
// - Enviar datos al backend.
// - Guardar sesión JWT.
// - Redirigir al usuario.
// ======================================================


import { registrar } from "../api/authApi.js";


import {
    guardarToken,
    guardarUsuario,
    guardarRol,
    cerrarSesion
} from "../utils/storage.js";


import {
    mostrarToast
} from "../components/toast.js";


import {
    mostrarSpinner,
    ocultarSpinner
} from "../components/spinner.js";
import {
    esCampoVacio,
    validarLongitud,
    esPasswordValida,
    mostrarError,
    limpiarError
} from "../utils/validator.js";
// Elementos DOM
const formulario = document.getElementById("registroForm");
const username = document.getElementById("username");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const password = document.getElementById("password");
// Inicialización
function iniciarRegistro() {
    if (!formulario) return;
    inicializarValidaciones();
    formulario.addEventListener(
        "submit",
        enviarRegistro
    );
}
// ======================================================
// Limpia errores mientras el usuario escribe.
// ======================================================

function inicializarValidaciones() {
    username.addEventListener(
        "input",
        () => limpiarError(username)
    );
    nombre.addEventListener(
        "input",
        () => limpiarError(nombre)
    );
    apellido.addEventListener(
        "input",
        () => limpiarError(apellido)
    );
    password.addEventListener(
        "input",
        () => limpiarError(password)
    );
}
// Enviar formulario
async function enviarRegistro(event) {
    event.preventDefault();
    limpiarError(username);
    limpiarError(nombre);
    limpiarError(apellido);
    limpiarError(password);
    // ------------------------------
    // Validaciones
    // ------------------------------
    if (esCampoVacio(username.value)) {
        mostrarError(
            username,
            "Ingrese un usuario."
        );
        username.focus();
        return;
    }
    if (!validarLongitud(username.value, 3, 50)) {
        mostrarError(
            username,
            "Debe tener entre 3 y 50 caracteres."
        );
        username.focus();
        return;
    }
    if (esCampoVacio(nombre.value)) {
        mostrarError(
            nombre,
            "Ingrese su nombre."
        );
        nombre.focus();
        return;
    }
    if (esCampoVacio(apellido.value)) {
        mostrarError(
            apellido,
            "Ingrese su apellido."
        );
        apellido.focus();
        return;
    }
    if (esCampoVacio(password.value)) {
        mostrarError(
            password,
            "Ingrese una contraseña."
        );
        password.focus();
        return;
    }
    if (!esPasswordValida(password.value)) {
        mostrarError(
            password,
            "Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
        );
        password.focus();
        return;
    }
    try {
        mostrarSpinner();
        const respuesta =
            await registrar({
                username: username.value.trim(),
                nombre: nombre.value.trim(),
                apellido: apellido.value.trim(),
                password: password.value
            });
        // limpiar sesión anterior
        cerrarSesion();
        // guardar nueva sesión
        guardarToken(
            respuesta.token
        );
        guardarUsuario(
            respuesta.username
        );
        guardarRol(
            respuesta.role
        );
        mostrarToast(
            "Usuario registrado correctamente."
        );
        setTimeout(() => {
            window.location.href =
                "tienda.html";
        }, 1000);
    }
    catch (error) {
        console.error(error);
        mostrarToast(
            error.message ??
            "Error al registrar usuario."
        );
    }
    finally {
        ocultarSpinner();
    }
}
document.addEventListener(
    "DOMContentLoaded",
    iniciarRegistro
);