// ======================================================
// categoriasApi.js
//
// Comunicación con los endpoints de categorías.
//
// Responsabilidades:
// - Obtener todas las categorías.
// - Obtener una categoría por ID.
// - Crear una categoría.
// - Actualizar una categoría.
// - Eliminar una categoría.
// ======================================================
import { apiClient } from "./apiClient.js";
// ======================================================
// Obtiene todas las categorías.
// ======================================================
export async function obtenerCategorias() {
    return await apiClient("/categorias");
}
// ======================================================
// Obtiene una categoría por ID.
// ======================================================
export async function obtenerCategoria(id) {
    return await apiClient(
        `/categorias/${id}`
    );
}
// ======================================================
// Crea una nueva categoría.
// ======================================================
export async function crearCategoria(categoria) {
    return await apiClient(
        "/categorias",
        {
            method: "POST",
            body: JSON.stringify(categoria)
        }
    );
}
// ======================================================
// Actualiza una categoría existente.
// ======================================================
export async function actualizarCategoria( id, categoria) {
    return await apiClient(
        `/categorias/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(categoria)
        }
    );
}
// ======================================================
// Elimina una categoría.
// ======================================================
export async function eliminarCategoria(id) {
    return await apiClient(
        `/categorias/${id}`,
        {
            method: "DELETE"
        }
    );
}