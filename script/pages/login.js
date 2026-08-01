// ======================================================
// login.js
// Controlador de la página de inicio de sesión.
//
// Responsabilidades:
// - Validar el formulario.
// - Enviar credenciales al backend.
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
// ======================================================
// Elementos del DOM
// ======================================================

const formulario = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
// ======================================================
// Inicialización
// ======================================================
function iniciarLogin() {
    if (!formulario) return;
    formulario.addEventListener(
        "submit",
        enviarFormulario
    );
}
// ======================================================
// Enviar formulario
// ======================================================
async function enviarFormulario(event) {
    event.preventDefault();
    if (
        !username.value.trim() ||
        !password.value.trim()
    ) {
        mostrarToast(
            "Complete usuario y contraseña."
        );
        return;
    }
    try {
        mostrarSpinner();
        const respuesta =
            await login({ username: username.value.trim(), password: password.value });
            // ------------------------------
            // Guardar la sesión del usuario
            // ------------------------------

            cerrarSesion();
            guardarToken( respuesta.token );
            guardarUsuario( respuesta.username );
            guardarRol( respuesta.role );
            // ------------------------------
            // Notificar y redirigir
            // ------------------------------

            mostrarToast( "Bienvenido " + respuesta.username );
            setTimeout(() => { window.location.href = "../pages/tienda.html" }, 1000);
        }
        catch (error) {
            console.error(error);
            mostrarToast(
                error.message ??
                "Usuario o contraseña incorrectos."
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
    iniciarLogin
);