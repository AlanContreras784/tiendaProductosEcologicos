// ======================================================
// carrito.js
// Controlador de la página del carrito.
//
// Responsabilidades:
// - Cargar el carrito del usuario.
// - Mostrar productos.
// - Mostrar resumen.
// - Agregar unidades.
// - Descontar unidades.
// - Eliminar productos.
// - Vaciar carrito.
// - Actualizar badge navbar.
//
// No contiene:
// - fetch directo.
// - lógica JWT.
// ======================================================
import {
    obtenerCarrito,
    obtenerResumen,
    agregarProducto,
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
import {
    confirmarAccion
} from "../components/modalConfirmacion.js";
// ======================================================
// Estado interno
// ======================================================
let carrito = null;
let resumen = null;
// ======================================================
// Elementos DOM
// ======================================================
const elementos = {
    tablaProductos:
        document.getElementById("tabla_carrito"),
    subtotal:
        document.getElementById("subtotalImporte"),
    envio:
        document.getElementById("envioImporte"),
    total:
        document.getElementById("totalImporte"),
    botonVaciar:
        document.getElementById("btn-vaciar")

};
// ======================================================
// Inicialización
// ======================================================
async function iniciarCarrito(){
    try{
        mostrarSpinner();
        await actualizarVista();
        inicializarEventos();
    }
    catch(error){
        console.error(error);
        mostrarToast(
            "No se pudo cargar el carrito."
        );
    }
    finally{
        ocultarSpinner();
    }
}
// ======================================================
// Actualiza toda la vista
// ======================================================
async function actualizarVista(){
    carrito = await obtenerCarrito();
    resumen = await obtenerResumen();
    renderizarProductos();
    renderizarResumen();
    await cargarBadgeNavbar();
}
// ======================================================
// Render resumen
// ======================================================
function renderizarResumen(){
    if(!resumen) return;
    elementos.subtotal.textContent =
        `$${Number(resumen.subtotal).toFixed(2)}`;
    elementos.envio.textContent =
        `$${Number(resumen.envio).toFixed(2)}`;
    elementos.total.textContent =
        `$${Number(resumen.total).toFixed(2)}`;
}
// ======================================================
// Render productos
// ======================================================
function renderizarProductos(){
    const tbody =
        elementos.tablaProductos;
    if(!tbody) return;
    tbody.innerHTML = "";
    if(
        !carrito ||
        !carrito.productos ||
        carrito.productos.length === 0
    ){
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
            item.cantidad *
            item.producto.precio;
        tbody.insertAdjacentHTML(
            "beforeend",
            crearFilaProducto(
                item,
                subtotal
            )
        );
    });
}
// ======================================================
// Crear fila producto
// ======================================================

function crearFilaProducto( item, subtotal) {
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
                <div class="quantity-controls">
                    <button
                        class="btn-restar"
                        data-id="${item.producto.id}"
                        ${item.cantidad === 1 ? "disabled" : ""}>
                        -
                    </button>
                    <input
                        type="number"
                        name="cantProducto"
                        value="${item.cantidad}"
                        readonly>
                    <button
                        class="btn-sumar"
                        data-id="${item.producto.id}">
                        +
                    </button>
                </div>
            </td>
            <td>
                $${subtotal.toFixed(2)}
            </td>
        </tr>
    `;
}
// ======================================================
// Eventos
// ======================================================
function inicializarEventos(){
    if(elementos.tablaProductos){
        elementos.tablaProductos.addEventListener(
            "click",
            manejarAccionesTabla
        );
    }
    if(elementos.botonVaciar){
        elementos.botonVaciar.addEventListener(
            "click",
            vaciarTodo
        );
    }
}
// ======================================================
// Delegación eventos tabla
// ======================================================
async function manejarAccionesTabla(e){
    const boton =
        e.target.closest("button");
    if(!boton) return;
    const idProducto =
        boton.dataset.id;
    if(!idProducto) return;
    if(
        boton.classList.contains(
            "remove-btn"
        )
    ){
        await eliminar(idProducto);
    }
    if(
        boton.classList.contains(
            "btn-restar"
        )
    ){
        await descontar(idProducto);
    }
    if(
        boton.classList.contains(
            "btn-sumar"
        )
    ){
        await sumar(idProducto);
    }
}
// ======================================================
// Sumar unidad
// ======================================================
async function sumar(idProducto){
    try{
        mostrarSpinner();
        await agregarProducto(idProducto);
        mostrarToast(
            "Cantidad actualizada"
        );
        await actualizarVista();
    }
    catch(error){
        console.error(error);
        mostrarToast(
            "No se pudo agregar"
        );
    }
    finally{
        ocultarSpinner();
    }
}
// ======================================================
// Descontar unidad
// ======================================================
async function descontar(idProducto){
    try{
        mostrarSpinner();
        await descontarProducto(idProducto);
        mostrarToast(
            "Cantidad actualizada"
        );
        await actualizarVista();
    }
    catch(error){
        console.error(error);
        mostrarToast(
            "No se pudo actualizar"
        );
    }
    finally{
        ocultarSpinner();
    }
}
// ======================================================
// Eliminar producto
// ======================================================
async function eliminar(idProducto){
    try{
        mostrarSpinner();
        await eliminarProducto(idProducto);
        mostrarToast(
            "Producto eliminado"
        );
        await actualizarVista();
    }
    catch(error){
        console.error(error);
        mostrarToast(
            "No se pudo eliminar"
        );
    }
    finally{
        ocultarSpinner();
    }
}
// ======================================================
// Vaciar carrito
// ======================================================
async function vaciarTodo(){
    const confirmado = await confirmarAccion(
        "¿Vaciar el carrito?"
    );

    if(!confirmado){
        return;
    }
    try{
        mostrarSpinner();
        await vaciarCarrito();
        mostrarToast(
            "Carrito vacío"
        );
        await actualizarVista();
    }
    catch(error){
        console.error(error);
        mostrarToast(
            "No se pudo vaciar"
        );
    }
    finally{
        ocultarSpinner();
    }
}

document.addEventListener(
    "DOMContentLoaded",
    iniciarCarrito
);