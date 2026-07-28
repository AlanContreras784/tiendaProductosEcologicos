// ======================================================
// auth.js
// Utilidades relacionadas con autenticación.
// ======================================================

import {
    obtenerRol,
    obtenerToken,
    obtenerUsuario
} from "./storage.js";

/**
 * Indica si existe un usuario autenticado.
 */
export function estaAutenticado() {

    return obtenerToken() !== null;

}

/**
 * Devuelve el nombre del usuario logueado.
 */
export function usuarioActual() {

    return obtenerUsuario();

}

/**
 * Devuelve el rol del usuario.
 */
export function rolActual() {

    return obtenerRol();

}

/**
 * Indica si el usuario autenticado es administrador.
 */
export function esAdministrador() {

    return obtenerRol() === "ADMIN";

}