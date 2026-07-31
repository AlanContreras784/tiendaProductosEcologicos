// ======================================================
// storage.js
// Utilidades para acceder al localStorage.
// ======================================================

import {
    TOKEN_KEY,
    USER_KEY,
    ROLE_KEY,
    CARRITO_KEY,
} from "./constants.js";
/**
 * Guarda el JWT.
 */
export function guardarToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}
/**
 * Devuelve el JWT almacenado.
 */
export function obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
}
/**
 * Elimina el JWT.
 */
export function eliminarToken() {
    localStorage.removeItem(TOKEN_KEY);
}
/**
 * Guarda el nombre del usuario.
 */
export function guardarUsuario(username) {
    localStorage.setItem(USER_KEY, username);
}
/**
 * Obtiene el usuario logueado.
 */
export function obtenerUsuario() {
    return localStorage.getItem(USER_KEY);
}
/**
 * Elimina el usuario.
 */
export function eliminarUsuario() {
    localStorage.removeItem(USER_KEY);
}
/**
 * Guarda el rol.
 */
export function guardarRol(role) {
    localStorage.setItem(ROLE_KEY, role);
}
/**
 * Obtiene el rol.
 */
export function obtenerRol() {
    return localStorage.getItem(ROLE_KEY);
}
/**
 * Elimina el rol.
 */
export function eliminarRol() {
    localStorage.removeItem(ROLE_KEY);
}
export function eliminarCarrito() {
    localStorage.removeItem(CARRITO_KEY);
}
/**
 * Elimina toda la información de autenticación.
 */
export function cerrarSesion() {
    eliminarToken();
    eliminarUsuario();
    eliminarRol();
    eliminarCarrito();
}
/**
 * Indica si existe una sesión iniciada.
 */
export function usuarioLogueado() {
    return !!obtenerToken();
}
/**
 * Devuelve toda la información de la sesión.
 */
export function obtenerSesion() {
    return {
        token: obtenerToken(),
        usuario: obtenerUsuario(),
        rol: obtenerRol()
    };
}