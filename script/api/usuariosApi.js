// ======================================================
// usuariosApi.js
//
// Comunicación con los endpoints de usuarios.
//
// Este módulo se encarga exclusivamente de comunicarse
// con el backend.
//
// La lógica de presentación y administración pertenece
// a adminUsuarios.js.
//
// Los endpoints están protegidos en el backend y requieren
// rol ADMIN.
// ======================================================

import { apiClient } from "./apiClient.js";

// ======================================================
// OBTENER USUARIOS
//
// Obtiene todos los usuarios registrados.
//
// Endpoint:
// GET /usuarios
//
// Requiere:
// ROLE_ADMIN
// ======================================================

export async function obtenerUsuarios() {

    const response =
        await apiClient("/usuarios");

    return response;
}

// ======================================================
// OBTENER CANTIDAD DE USUARIOS
//
// Obtiene la cantidad total de usuarios registrados.
//
// Endpoint:
// GET /usuarios/count
//
// Requiere:
// ROLE_ADMIN
//
// Este método será utilizado por el dashboard.
// ======================================================

export async function obtenerCantidadUsuarios() {

    const response =
        await apiClient("/usuarios/count");

    return response;
}