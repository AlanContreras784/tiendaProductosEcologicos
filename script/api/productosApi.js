import { apiClient } from "./apiClient.js";

/**
 * Obtiene todos los productos.
 */
export function obtenerProductos() {

    return apiClient("/productos");

}

/**
 * Obtiene un producto por ID.
 */
export function obtenerProducto(id) {

    return apiClient(`/productos/${id}`);

}

/**
 * Busca productos por nombre.
 */
export function buscarProductos(nombre) {

    return apiClient(`/productos/buscar?nombre=${encodeURIComponent(nombre)}`);

}