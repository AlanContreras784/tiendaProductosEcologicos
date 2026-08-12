import { apiClient } from "./apiClient.js";

// ======================================================
// Obtiene todos los productos.
// ======================================================
export async function obtenerProductos() {
    return await apiClient("/productos");
}

// ======================================================
// Obtiene un producto por ID.
 // ======================================================
export async function obtenerProducto(id) {
    return await apiClient(`/productos/${id}`);
}
// ======================================================
// Busca productos por nombre.
// ======================================================
export async function buscarProductos(nombre) {
    return await apiClient(
        `/productos/nombre/${encodeURIComponent(nombre)}`
    );
}
// ======================================================
// Crea un producto.
// ======================================================
export async function crearProducto(producto) {
    return await apiClient(
        "/productos",
        {
            method: "POST",
            body: JSON.stringify(producto)
        }
    );
}
// ======================================================
// Actualiza un producto.
// ======================================================
export async function actualizarProducto(id, producto) {
    return await apiClient(
        `/productos/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(producto)
        }
    );
}
// ======================================================
// Elimina un producto.
// ======================================================
export async function eliminarProducto(id) {
    return await apiClient(
        `/productos/${id}`,
        {
            method: "DELETE"
        }
    );
}