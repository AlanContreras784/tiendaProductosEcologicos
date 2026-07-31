import { apiClient } from "./apiClient.js";

/**
 * Obtiene todos los productos.
 */
export async function obtenerProductos() {
    return await apiClient("/productos");
}

/**
 * Obtiene un producto por ID.
 */
export async function obtenerProducto(id) {
    return await apiClient(`/productos/${id}`);
}

/**
 * Busca productos por nombre.
 */
export async function buscarProductos(nombre) {
    return await apiClient(
        `/productos/buscar?nombre=${encodeURIComponent(nombre)}`
    );
}