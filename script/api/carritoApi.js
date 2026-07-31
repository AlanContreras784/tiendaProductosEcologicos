import { apiClient } from "./apiClient.js";

/**
 * Obtiene el carrito del usuario autenticado.
 */
export async function obtenerCarrito() {
    const carrito = await apiClient(
        "/carritos/mi-carrito"
    );
    return Array.isArray(carrito)
        ? carrito[0]
        : carrito;
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

