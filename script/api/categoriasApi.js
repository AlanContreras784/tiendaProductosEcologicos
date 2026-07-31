// ======================================================
// categoriasApi.js
// Comunicación con endpoints de categorías
// ======================================================

import { apiClient } from "./apiClient.js";


// Obtiene todas las categorías
export async function obtenerCategorias() {

    return await apiClient("/categorias");

}