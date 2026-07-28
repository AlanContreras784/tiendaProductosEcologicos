import { apiClient } from "./apiClient.js";

/**
 * Obtiene el carrito del usuario autenticado.
 */
export function obtenerCarrito() {

    return apiClient("/carritos/mi-carrito");

}

/**
 * Agrega un producto al carrito.
 */
export function agregarProducto(idProducto) {

    return apiClient(`/carritos/productos/${idProducto}`, {

        method: "POST"

    });

}

/**
 * Descuenta una unidad.
 */
export function descontarProducto(idProducto) {

    return apiClient(`/carritos/productos/${idProducto}/descontar`, {

        method: "PUT"

    });

}

/**
 * Elimina completamente un producto.
 */
export function eliminarProducto(idProducto) {

    return apiClient(`/carritos/productos/${idProducto}`, {

        method: "DELETE"

    });

}

/**
 * Vacía el carrito.
 */
export function vaciarCarrito() {

    return apiClient("/carritos/mi-carrito/vaciar", {

        method: "DELETE"

    });

}

/**
 * Obtiene el resumen del carrito.
 */
export function obtenerResumen() {

    return apiClient("/carritos/mi-carrito/resumen");

}