// ======================================================
// carrito.js
// Controlador de la página del carrito.
//
// Responsabilidades:
// - Cargar el carrito del usuario.
// - Mostrar los productos.
// - Mostrar el resumen.
// - Eliminar productos.
// - Descontar unidades.
// - Vaciar el carrito.
// - Actualizar el badge del navbar.
//
// No contiene:
// - fetch directo.
// - lógica JWT.
// ======================================================
import {
    obtenerCarrito,
    obtenerResumen,
    descontarProducto,
    eliminarProducto,
    vaciarCarrito
} from "../api/carritoApi.js";
import {
    cargarBadgeNavbar
} from "../components/navbar.js";
import {
    mostrarToast
} from "../components/toast.js";
import {
    mostrarSpinner,
    ocultarSpinner
} from "../components/spinner.js";
// ======================================================
// Estado interno
// ======================================================
let carrito = null;
let resumen = null;
// ======================================================
// Elementos del DOM
// ======================================================

const elementos = {
    tablaProductos:
        document.getElementById("tablaCarrito"),
    subtotal:
        document.getElementById("subtotal"),
    envio:
        document.getElementById("envio"),
    total:
        document.getElementById("total"),
    botonVaciar:
        document.getElementById("btnVaciarCarrito")
};

// ======================================================
// Inicialización
// ======================================================

async function iniciarCarrito() {
    try {
        mostrarSpinner();
        await actualizarVista();
        inicializarEventos();
    } catch (error) {
        console.error(error);
        mostrarToast(
            "No se pudo cargar el carrito."
        );
    } finally {
        ocultarSpinner();
    }
}
// ======================================================
// Actualiza toda la vista.
// ======================================================
async function actualizarVista() {

    carrito = await obtenerCarrito();

    resumen = await obtenerResumen();

    renderizarProductos();

    await cargarBadgeNavbar();

}
// ======================================================
// Renderiza la tabla del carrito.
// ======================================================
function renderizarProductos() {

    const tbody = document.getElementById("tabla_carrito");

    if (!tbody) return;

    tbody.innerHTML = "";

    // Si el carrito no existe o no tiene productos
    if (!carrito || !carrito.productos || carrito.productos.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    No hay productos en el carrito.
                </td>
            </tr>
        `;

        return;
    }

    carrito.productos.forEach(item => {

        const subtotal =
            item.cantidad * item.producto.precio;

        tbody.insertAdjacentHTML(
            "beforeend",
            crearFilaProducto(item, subtotal)
        );

    });

}
// ======================================================
// Genera el HTML de una fila del carrito.
// ======================================================
function crearFilaProducto(item, subtotal) {

    return `
        <tr>
            <td>
                <button
                    class="remove-btn"
                    data-id="${item.producto.id}"
                    title="Eliminar">
                    <i class="far fa-times-circle"></i>
                </button>
            </td>
            <td>
                <img
                    src="${item.producto.imagenUrl}"
                    alt="${item.producto.nombre}">
            </td>
            <td>
                ${item.producto.nombre}
            </td>
            <td>
                $${item.producto.precio.toFixed(2)}
            </td>
            <td>
                <input
                    type="number"
                    value="${item.cantidad}"
                    readonly>
            </td>
            <td>
                $${subtotal.toFixed(2)}
            </td>
        </tr>
    `;
}

document.addEventListener(
    "DOMContentLoaded",
    iniciarCarrito
);