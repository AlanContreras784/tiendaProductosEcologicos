// ======================================================
// admin.js
//
// Controlador del Panel de Administración.
//
// Responsabilidades:
// - Verificar permisos de administrador.
// - Inicializar el panel.
// - Cargar dashboard.
// - Cargar categorías.
// - Cargar productos.
// - Gestionar CRUD.
// ======================================================
import { protegerPaginaAdmin } from "../components/navbar.js";
import { obtenerProductos, obtenerProducto,actualizarProducto } from "../api/productosApi.js";
import { obtenerCategorias } from "../api/categoriasApi.js";
import { mostrarSpinner, ocultarSpinner } from "../components/spinner.js";
import { mostrarToast } from "../components/toast.js";
// ======================================================
// Elementos del DOM
// ======================================================
const totalProductos = document.getElementById("totalProductos");
const totalCategorias = document.getElementById("totalCategorias");
const totalUsuarios = document.getElementById("totalUsuarios");
const tablaProductos = document.getElementById("tablaProductos");
// ======================================================
// capturar los controles del formulario
// ======================================================
const productoId = document.getElementById("productoId");

const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");
const categoria = document.getElementById("categoria");
const imagenUrl = document.getElementById("imagenUrl");
const descripcion = document.getElementById("descripcion");

const formulario = document.getElementById("formProducto");
const formTitulo = document.getElementById("formTitulo");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
// ======================================================
// Inicialización
// ======================================================
async function iniciarAdmin() {
    if (!protegerPaginaAdmin()) return;
    console.log("Panel de administración inicializado.");
    await cargarCategorias();
    await cargarDashboard();
    // Botón para cancelar la edición
    btnCancelarEdicion?.addEventListener( "click", cancelarEdicion );
    formulario?.addEventListener( "submit", guardarProducto );
}
// ======================================================
// Dashboard
// ======================================================
async function cargarDashboard() {
    try {
        const productos = await obtenerProductos();
        totalProductos.textContent = productos.length;
        renderizarTabla(productos);
    }
    catch (error) {
        console.error(error);
    }
}
// ======================================================
// Editar un Producto
// ======================================================
async function editarProducto(event) {

    try {

        const id =
            event.currentTarget.dataset.id;
        const producto =
            await obtenerProducto(id);
        productoId.value = producto.id;
        nombre.value = producto.nombre;
        precio.value = producto.precio;
        stock.value = producto.stock;
        categoria.value = producto.categoria.id;
        imagenUrl.value = producto.imagenUrl;
        descripcion.value = producto.descripcion;
        formTitulo.textContent = "Editar producto";
        btnGuardar.textContent = "Guardar cambios";
        btnCancelarEdicion.style.display = "inline-block";
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    catch (error) {
        console.error(
            "Error al cargar producto:",
            error
        );
        mostrarToast(
            "No se pudo cargar el producto."
        );
    }
}
// ======================================================
// Cancelar Edición
// ======================================================
function cancelarEdicion() {
    formulario.reset();
    productoId.value = "";
    formTitulo.textContent = "Nuevo producto";
    btnGuardar.textContent = "Crear producto";
    btnCancelarEdicion.style.display = "none";
}

// ======================================================
// Renderiza la tabla de productos.
// ======================================================

function renderizarTabla(productos) {
    if (!tablaProductos) return;
    if (productos.length === 0) {
        tablaProductos.innerHTML = `
            <tr>
                <td colspan="6" class="admin-cargando">
                    No hay productos registrados.
                </td>
            </tr>
        `;
        return;
    }
    tablaProductos.innerHTML = productos.map(producto => `
        <tr>
            <td>
                <img
                    src="${producto.imagenUrl}"
                    alt="${producto.nombre}"
                    width="60">
            </td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>
                <button
                    class="btn-editar"
                    data-id="${producto.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button
                    class="btn-eliminar"
                    data-id="${producto.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
    document
    .querySelectorAll(".btn-editar")
    .forEach(boton => {

        boton.addEventListener(
            "click",
            editarProducto
        );

    });
}

// ======================================================
// Carga las categorías en el selector del formulario.
// ======================================================
async function cargarCategorias() {
    if (!categoria) return;
    try {
        const categorias = await obtenerCategorias();
        categoria.innerHTML = `
            <option value="">
                Seleccioná una categoría
            </option>
        `;
        categorias.forEach(cat => {
            const option =
                document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.nombre;
            categoria.appendChild(option);
        });
    }
    catch (error) {
        console.error(
            "Error al cargar categorías:",
            error
        );
    }
}
async function guardarProducto(event) {
    event.preventDefault();
    // Por ahora solamente permitimos actualizar.
    // La creación la implementaremos después.
    if (!productoId.value) {

        mostrarToast(
            "La creación de productos la implementaremos después."
        );

        return;
    }
    try {

        const datos = {
            nombre: nombre.value.trim(),
            precio: Number(precio.value),
            descripcion: descripcion.value.trim(),
            stock: Number(stock.value),
            imagenUrl: imagenUrl.value.trim(),
            categoriaId: Number(categoria.value)
        };
        console.log(
            "Datos enviados al backend:",
            datos
        );
        mostrarSpinner();
        await actualizarProducto(
            productoId.value,
            datos
        );
        mostrarToast(
            "Producto actualizado correctamente."
        );
        cancelarEdicion();
        await cargarDashboard();
    }
    catch (error) {
        console.error(
            "Error al actualizar producto:",
            error
        );
        mostrarToast(
            error.message ??
            "No se pudo actualizar el producto."
        );
    }
    finally {
        ocultarSpinner();
    }
}
// ======================================================
// Arranque
// ======================================================
document.addEventListener(
    "DOMContentLoaded",
    iniciarAdmin
);