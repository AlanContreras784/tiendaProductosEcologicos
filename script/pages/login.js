// ======================================================
// login.js
// Controlador de la página de inicio de sesión.
//
// Responsabilidades:
// - Validar el formulario.
// - Enviar credenciales al backend.
// - Procesar login tradicional.
// - Iniciar login mediante Google.
// - Procesar la respuesta OAuth2 de Google.
// - Guardar la sesión.
// - Redirigir al usuario.
// ======================================================

import { login } from "../api/authApi.js";

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
    mostrarError,
    limpiarError
} from "../utils/validator.js";

// ======================================================
// Elementos del DOM
// ======================================================

const formulario =
    document.getElementById("loginForm");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const btnGoogle =
    document.getElementById("btnGoogle");

// ======================================================
// Inicialización
// ======================================================

function iniciarLogin() {

    if (!formulario) return;

    // Procesamos primero si volvimos de Google.
    procesarLoginGoogle();

    // Inicializamos las validaciones.
    inicializarValidaciones();

    // Login tradicional.
    formulario.addEventListener(
        "submit",
        enviarFormulario
    );

    // Login mediante Google.
    if (btnGoogle) {

        btnGoogle.addEventListener(
            "click",
            iniciarLoginGoogle
        );
    }
}

// ======================================================
// INICIAR LOGIN CON GOOGLE
// ======================================================

function iniciarLoginGoogle() {

    console.log(
        "Iniciando autenticación con Google..."
    );

    window.location.href =
        "http://localhost:8080/oauth2/authorization/google";
}

// ======================================================
// PROCESAR RESPUESTA DE GOOGLE
// ======================================================

function procesarLoginGoogle() {

    const hash =
        window.location.hash;

    // Si no volvimos de Google,
    // no hacemos nada.
    if (!hash.startsWith("#oauth2=")) {
        return;
    }

    try {

        // ----------------------------------------------
        // Obtener datos enviados por Spring
        // ----------------------------------------------

        const datosCodificados =
            hash.substring("#oauth2=".length);

        const datosDecodificados =
            decodeURIComponent(
                datosCodificados
            );

        const respuesta =
            JSON.parse(
                datosDecodificados
            );

        console.log(
            "Respuesta login Google:",
            respuesta
        );

        // ----------------------------------------------
        // Validar respuesta
        // ----------------------------------------------

        if (
            !respuesta.token ||
            !respuesta.username ||
            !respuesta.role
        ) {

            throw new Error(
                "La respuesta de Google no contiene los datos de sesión necesarios."
            );
        }

        // ----------------------------------------------
        // Limpiar sesión anterior
        // ----------------------------------------------

        cerrarSesion();

        // ----------------------------------------------
        // Guardar nueva sesión
        // ----------------------------------------------

        guardarToken(
            respuesta.token
        );

        guardarUsuario(
            respuesta.username
        );

        guardarRol(
            respuesta.role
        );

        // ----------------------------------------------
        // Limpiar token de la URL
        // ----------------------------------------------

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        // ----------------------------------------------
        // Mostrar bienvenida
        // ----------------------------------------------

        mostrarToast(
            "Bienvenido " +
            respuesta.username
        );

        // ----------------------------------------------
        // Redirigir a tienda
        // ----------------------------------------------

        setTimeout(() => {

            window.location.href =
                "../pages/tienda.html";

        }, 1000);

    } catch (error) {

        console.error(
            "Error procesando login con Google:",
            error
        );

        mostrarToast(
            "No se pudo completar el inicio de sesión con Google."
        );

        // Limpiamos el hash de la URL.
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }
}

// ======================================================
// VALIDACIONES
// ======================================================

function inicializarValidaciones() {

    username.addEventListener(
        "input",
        () => limpiarError(username)
    );

    password.addEventListener(
        "input",
        () => limpiarError(password)
    );
}

// ======================================================
// LOGIN TRADICIONAL
// ======================================================

async function enviarFormulario(event) {

    event.preventDefault();

    // ----------------------------------------------
    // Limpiar errores anteriores
    // ----------------------------------------------

    limpiarError(username);
    limpiarError(password);

    // ----------------------------------------------
    // Validar usuario
    // ----------------------------------------------

    if (esCampoVacio(username.value)) {

        mostrarError(
            username,
            "Ingrese su usuario."
        );

        username.focus();

        return;
    }

    if (
        !validarLongitud(
            username.value,
            3,
            50
        )
    ) {

        mostrarError(
            username,
            "Debe tener entre 3 y 50 caracteres."
        );

        username.focus();

        return;
    }

    // ----------------------------------------------
    // Validar contraseña
    // ----------------------------------------------

    if (esCampoVacio(password.value)) {

        mostrarError(
            password,
            "Ingrese su contraseña."
        );

        password.focus();

        return;
    }

    // ----------------------------------------------
    // Login
    // ----------------------------------------------

    try {

        mostrarSpinner();

        const respuesta =
            await login({
                username:
                    username.value.trim(),

                password:
                    password.value
            });

        // ------------------------------------------
        // Guardar sesión
        // ------------------------------------------

        cerrarSesion();

        guardarToken(
            respuesta.token
        );

        guardarUsuario(
            respuesta.username
        );

        guardarRol(
            respuesta.role
        );

        // ------------------------------------------
        // Notificar
        // ------------------------------------------

        mostrarToast(
            "Bienvenido " +
            respuesta.username
        );

        // ------------------------------------------
        // Redirigir
        // ------------------------------------------

        setTimeout(() => {

            window.location.href =
                "../pages/tienda.html";

        }, 1000);

    } catch (error) {

        console.error(error);

        mostrarToast(
            error.message ??
            "Usuario o contraseña incorrectos."
        );

    } finally {

        ocultarSpinner();
    }
}

// ======================================================
// ARRANQUE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarLogin
)