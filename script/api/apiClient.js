// ======================================================
// apiClient.js
// Cliente HTTP reutilizable para comunicarse con la API.
// Centraliza todas las peticiones fetch y el manejo de errores.
// ======================================================

import { API_URL } from "../utils/constants.js";
import { obtenerToken } from "../utils/storage.js";

/**
 * Realiza una petición HTTP al backend.
 *
 * @param {string} endpoint Ruta de la API (ej: "/productos")
 * @param {Object} options Configuración de fetch
 * @returns {Promise<any>} Datos contenidos en ApiResponse.data
 */
export async function apiClient(endpoint, options = {}) {

    const token = obtenerToken();

    // Headers por defecto.
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    // Si existe un JWT lo enviamos automáticamente.
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    let body = null;

    try {
        body = await response.json();
    } catch (error) {
        body = null;
    }

    // Si el backend respondió con error.
    if (!response.ok) {

        const mensaje =
            body?.message ||
            "Ocurrió un error inesperado.";

        const error = new Error(mensaje);

        error.status = response.status;

        error.data = body;

        throw error;
    }

    // Nuestra API siempre responde con ApiResponse.
    return body.data;
}