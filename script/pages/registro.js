// ======================================================
// registro.js
//
// Controlador de registro de usuarios.
//
// Responsabilidades:
//
// - Validar formulario.
// - Validar email.
// - Enviar datos al backend.
// - Informar el resultado del registro.
// - Redirigir al login después del registro.
//
// IMPORTANTE:
//
// El registro NO inicia sesión automáticamente.
//
// El backend crea el usuario deshabilitado hasta que
// confirme su dirección de correo electrónico.
// ======================================================

import { registrar } from "../api/authApi.js";

import {
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
    esEmailValido,
    esPasswordValida,
    mostrarError,
    limpiarError
} from "../utils/validator.js";


// ======================================================
// ELEMENTOS DOM
// ======================================================

const formulario =
    document.getElementById("registroForm");

const username =
    document.getElementById("username");

const nombre =
    document.getElementById("nombre");

const apellido =
    document.getElementById("apellido");

const email =
    document.getElementById("email");

const password =
    document.getElementById("password");


// ======================================================
// INICIALIZACIÓN
// ======================================================

function iniciarRegistro() {

    if (!formulario) return;

    inicializarValidaciones();

    formulario.addEventListener(
        "submit",
        enviarRegistro
    );
}


// ======================================================
// LIMPIAR ERRORES AL ESCRIBIR
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

    email.addEventListener(
        "input",
        () => limpiarError(email)
    );

    password.addEventListener(
        "input",
        () => limpiarError(password)
    );
}


// ======================================================
// ENVIAR FORMULARIO
// ======================================================

async function enviarRegistro(event) {

    event.preventDefault();


    // ==================================================
    // LIMPIAR ERRORES ANTERIORES
    // ==================================================

    limpiarError(username);
    limpiarError(nombre);
    limpiarError(apellido);
    limpiarError(email);
    limpiarError(password);


    // ==================================================
    // VALIDAR USUARIO
    // ==================================================

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


    // ==================================================
    // VALIDAR NOMBRE
    // ==================================================

    if (esCampoVacio(nombre.value)) {

        mostrarError(
            nombre,
            "Ingrese su nombre."
        );

        nombre.focus();

        return;
    }


    // ==================================================
    // VALIDAR APELLIDO
    // ==================================================

    if (esCampoVacio(apellido.value)) {

        mostrarError(
            apellido,
            "Ingrese su apellido."
        );

        apellido.focus();

        return;
    }


    // ==================================================
    // VALIDAR EMAIL
    // ==================================================

    if (esCampoVacio(email.value)) {

        mostrarError(
            email,
            "Ingrese su correo electrónico."
        );

        email.focus();

        return;
    }


    if (!esEmailValido(email.value)) {

        mostrarError(
            email,
            "Ingrese un correo electrónico válido."
        );

        email.focus();

        return;
    }


    // ==================================================
    // VALIDAR CONTRASEÑA
    // ==================================================

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


    // ==================================================
    // ENVIAR REGISTRO AL BACKEND
    // ==================================================

    try {

        mostrarSpinner();


        const respuesta =
            await registrar({

                username:
                    username.value.trim(),

                nombre:
                    nombre.value.trim(),

                apellido:
                    apellido.value.trim(),

                email:
                    email.value.trim(),

                password:
                    password.value

            });


        // ==================================================
        // LIMPIAR SESIÓN ANTERIOR
        // ==================================================

        /*
         * El registro no genera JWT.
         *
         * Por lo tanto, no guardamos token,
         * usuario ni rol.
         *
         * También eliminamos cualquier sesión
         * anterior que pudiera existir.
         */

        cerrarSesion();


        // ==================================================
        // MENSAJE DE REGISTRO
        // ==================================================

        /*
         * apiClient devuelve solamente:
         *
         * response.data
         *
         * Por eso no necesariamente tenemos
         * respuesta.message disponible aquí.
         *
         * Utilizamos un mensaje fijo acorde al
         * nuevo flujo de confirmación por email.
         */

        mostrarToast(
            "Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta."
        );


        // ==================================================
        // REDIRECCIÓN AL LOGIN
        // ==================================================

        /*
         * El usuario todavía no puede iniciar sesión
         * hasta confirmar su correo electrónico.
         */

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1500);


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


// ======================================================
// DOM READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarRegistro
);