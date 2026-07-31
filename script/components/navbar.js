// ======================================================
// navbar.js
// Gestiona el navbar de toda la aplicación:
// - Estado de sesión (Iniciar Sesión / Cerrar Sesión)
// - Nombre de usuario y rol, decodificados del JWT
// - Menú de administrador (solo visible para rol ADMIN)
// - Badge del carrito, sincronizado entre desktop y mobile
// - Menú hamburguesa mobile
// - Protección de páginas (integración con JWT)
//
// IMPORTANTE: cargar este script DESPUÉS de api.js en el HTML.
// api.js depende de rutaLogin() (definida acá) para redirigir
// cuando el token vence, así que navbar.js debe estar incluido
// en TODAS las páginas que usan api.js.
// ======================================================

/**
 * Decodifica el payload de un JWT (sin validar la firma).
 * Se usa solo para mostrar datos en la UI (nombre, rol);
 * la validación real de permisos siempre la hace el backend.
 */
import { obtenerResumen } from "../api/carritoApi.js";
import { mostrarToast } from "./toast.js";

import {
    obtenerToken,
    obtenerUsuario,
    obtenerRol,
    cerrarSesion as limpiarSesion,
    usuarioLogueado
} from "../utils/storage.js";

/**
 * Devuelve el nombre del usuario almacenado.
 */
function obtenerNombreUsuario() {
    return obtenerUsuario() ?? "";
}
/**
 * Devuelve el rol almacenado.
 */
function obtenerRolUsuario() {
    return obtenerRol() ?? "";
}

function esAdmin() {
    return obtenerRolUsuario().toString().toUpperCase().includes("ADMIN");
}

/**
 * Devuelve la ruta correcta a login.html según si la página
 * actual está en la raíz o dentro de /pages/.
 * login.html vive en pages/login.html.
 */
function rutaLogin() {
    return window.location.pathname.includes("/pages/")
        ? "login.html"
        : "pages/login.html";
}

/**
 * Devuelve la ruta correcta a index.html según si la página
 * actual está en la raíz o dentro de /pages/.
 */
function rutaHome() {
    return window.location.pathname.includes("/pages/")
        ? "../index.html"
        : "index.html";
}

function cerrarSesion() {
    limpiarSesion();
    window.location.href = rutaLogin();
}

// ======================================================
// ESTADO DE SESIÓN EN EL NAVBAR
// ======================================================

/**
 * Alterna "Iniciar Sesión" / "Cerrar Sesión" y muestra el
 * nombre de usuario cuando hay sesión activa.
 *
 * Requiere en el HTML:
 *   <a id="loginLink">Iniciar Sesión</a>
 *   <a id="logoutLink">Cerrar Sesión</a>
 *   <span id="navUsuario"></span>  (opcional)
 */
function cargarEstadoSesion() {
    const loginLink = document.getElementById("loginLink");
    const logoutLink = document.getElementById("logoutLink");
    const spanUsuario = document.getElementById("navUsuario");

    const logueado = usuarioLogueado();

    if (loginLink) loginLink.style.display = logueado ? "none" : "inline-block";
    if (logoutLink) logoutLink.style.display = logueado ? "inline-block" : "none";

    if (spanUsuario) {
        spanUsuario.textContent = logueado ? `Hola, ${obtenerNombreUsuario()}` : "";
    }
}

/**
 * Muestra u oculta las opciones de administrador.
 * Requiere: <li id="menuAdmin">...</li>
 */
function cargarMenuAdmin() {
    const menu = document.getElementById("menuAdmin");
    if (!menu) return;
    menu.style.display = usuarioLogueado() && esAdmin() ? "block" : "none";
}

// ======================================================
// BADGE DEL CARRITO (desktop + mobile sincronizados)
// ======================================================

/**
 * Actualiza TODOS los badges del carrito presentes en la página
 * (desktop y mobile repiten el badge, así que actualizamos por
 * clase para cubrir ambos a la vez).
 * Requiere: elementos con class="cart-badge"
 */
function actualizarBadgesCarrito(cantidad) {
    document.querySelectorAll(".cart-badge").forEach(badge => {
        badge.textContent = cantidad;
        badge.style.display = cantidad > 0 ? "inline-block" : "none";
    });
}

async function cargarBadgeNavbar() {
    if (!usuarioLogueado()) {
        actualizarBadgesCarrito(0);
        return;
    }
    try {
        const resumen = await obtenerResumen();
        actualizarBadgesCarrito( resumen.cantidadProductos );
    }
    catch (error) {
        console.error(error);
        actualizarBadgesCarrito(0);
    }
}
// ======================================================
// MENÚ HAMBURGUESA (mobile)
// ======================================================

function iniciarMenuMobile() {
    const bar = document.getElementById("bar");
    const close = document.getElementById("close");
    const navbar = document.getElementById("navbar");

    if (!bar || !close || !navbar) return;

    bar.addEventListener("click", () => navbar.classList.add("active"));
    close.addEventListener("click", () => navbar.classList.remove("active"));
}

// ======================================================
// PROTECCIÓN DE PÁGINAS (integración con JWT)
// ======================================================

/**
 * Protege una página que requiere sesión iniciada (ej. carrito.html).
 * Llamar al principio del script de esa página:
 *
 *   document.addEventListener("DOMContentLoaded", () => {
 *       if (!protegerPagina()) return;
 *       // ... resto de la lógica de la página
 *   });
 */
function protegerPagina() {
    if (usuarioLogueado()) return true;

    if (typeof mostrarToast === "function") {
        mostrarToast("Iniciá sesión para acceder a esta sección.");
    }
    setTimeout(() => {
        window.location.href = rutaLogin();
    }, 1200);
    return false;
}

/**
 * Protege una página exclusiva para administradores (ej. admin.html).
 * Si no hay sesión, redirige a login. Si hay sesión pero el rol
 * no es ADMIN, redirige al home.
 */
function protegerPaginaAdmin() {
    if (!protegerPagina()) return false;

    if (!esAdmin()) {
        if (typeof mostrarToast === "function") {
            mostrarToast("No tenés permisos para acceder a esta sección.");
        }
        setTimeout(() => {
            window.location.href = rutaHome();
        }, 1200);
        return false;
    }
    return true;
}

// ======================================================
// INICIALIZACIÓN
// ======================================================

async function iniciarNavbar() {
    cargarEstadoSesion();
    cargarMenuAdmin();
    await cargarBadgeNavbar();
    iniciarMenuMobile();

    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
}



document.addEventListener("DOMContentLoaded", iniciarNavbar);
export {
    cargarBadgeNavbar,
    usuarioLogueado,
    rutaLogin
};