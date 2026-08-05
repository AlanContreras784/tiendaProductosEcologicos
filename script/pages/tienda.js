// ======================================================
// tienda.js
// Controlador de la página tienda.
//
// Responsabilidades:
// - Cargar productos desde la API.
// - Cargar categorías.
// - Aplicar filtros.
// - Buscar productos.
// - Renderizar cards.
// - Manejar paginación.
// - Agregar productos al carrito.
//
// No contiene:
// - fetch directo.
// - lógica JWT.
// - HTML de productos.
// ======================================================
import { obtenerProductos, buscarProductos } from "../api/productosApi.js";
import { cargarBadgeNavbar, usuarioLogueado } from "../components/navbar.js";
import { obtenerCategorias } from "../api/categoriasApi.js";
import { agregarProducto } from "../api/carritoApi.js";
import { crearProductoCard } from "../components/productoCard.js";
import { Paginator } from "../components/paginator.js";
import { mostrarToast } from "../components/toast.js";
import { mostrarSpinner, ocultarSpinner } from "../components/spinner.js";
import { abrirModalProducto, inicializarModalProducto, configurarAgregarCarrito } from "../components/modalProducto.js";
// ======================================================
// Estado interno de la página
// ======================================================
let productos = [];
let productosFiltrados = [];
let categoriaSeleccionada = "";
let textoBusqueda = "";
let paginator;
// ======================================================
// Elementos del DOM
// ======================================================
const elementos = {
    listaProductos:
        document.getElementById("listaProductos"),
    filtroCategoria:
        document.getElementById("filtroCategoria"),
    buscador:
        document.getElementById("buscadorProductos"),
    paginador:
        document.getElementById("paginador")
};
// ======================================================
// Inicialización
// ======================================================
async function iniciarTienda() {
    console.log("Iniciando tienda");
    console.log(
        "Lista productos:",
        elementos.listaProductos
    );
    try {
        mostrarSpinner();
        inicializarEventos();
        inicializarModalProducto();
        const botonModal =
            document.getElementById(
                "modalAgregarCarrito"
            );
        configurarAgregarCarrito(async (producto) => {
            try {
                await agregarProducto(producto.id);
                mostrarToast(
                    "Producto agregado al carrito"
                );
                await cargarBadgeNavbar();
            } catch (error) {

                console.error(error);

                mostrarToast(
                    "No se pudo agregar el producto"
                );
            }
        });
        await cargarCategorias();
        await cargarProductos();
        inicializarPaginador();
    } catch (error) {
        console.error(
            "Error iniciando tienda:",
            error
        );
        mostrarToast(
            "No se pudieron cargar los productos"
        );
    } finally {
        ocultarSpinner();
    }
}
// ======================================================
// Cargar productos
// ======================================================
async function cargarProductos() {
    productos = await obtenerProductos();
    console.log("Productos recibidos:", productos);
    productosFiltrados = [...productos];
    renderizarProductos();
}
// ======================================================
// Cargar categorías
// ======================================================
async function cargarCategorias() {
    if (!elementos.filtroCategoria)
        return;
    const categorias =
        await obtenerCategorias();
    elementos.filtroCategoria.innerHTML =
        `
        <option value="">
            Todas las categorías
        </option>
        `;
    categorias.forEach(categoria => {
        const option =
            document.createElement("option");
        option.value =
            categoria.id;
        option.textContent =
            categoria.nombre;
        elementos.filtroCategoria
            .appendChild(option);
    });
}
// ======================================================
// Inicializar paginador
// ======================================================
function inicializarPaginador() {
    if (!elementos.paginador)
        return;
    paginator =
        new Paginator({
            container:
                elementos.paginador,
            itemsPerPage:
                8,
            onPageChange:
                (inicio, fin) => {
                    mostrarProductosPagina(
                        inicio,
                        fin
                    );
                }
        });
    paginator.setTotalItems(
        productosFiltrados.length
    );
}
// ======================================================
// Render productos
// ======================================================
function renderizarProductos() {
    if (!elementos.listaProductos) return;
    elementos.listaProductos.innerHTML = "";
    if (paginator) {
        paginator.setTotalItems(productosFiltrados.length);
    }
    mostrarProductosPagina(0, productosFiltrados.length);
}
// ======================================================
// Mostrar productos de una página
// ======================================================
function mostrarProductosPagina( inicio, fin ) {
        if (!elementos.listaProductos)
            return;
        const productosPagina =
            productosFiltrados.slice(
                inicio,
                fin
            );
        elementos.listaProductos.innerHTML =
            productosPagina
                .map(producto =>
                    crearProductoCard(producto)
                )
                .join("");
}
// ======================================================
// Aplicar filtros
// ======================================================
function aplicarFiltros() {
    productosFiltrados =
        productos.filter(producto => {
            const coincideNombre =
                producto.nombre
                    .toLowerCase()
                    .includes(
                        textoBusqueda
                            .toLowerCase()
                    );
            const coincideCategoria =
                categoriaSeleccionada === ""
                ||
                producto.categoria.id ==
                categoriaSeleccionada;
            return (
                coincideNombre
                &&
                coincideCategoria
            );
        });
    renderizarProductos();
}
// ======================================================
// Eventos
// ======================================================

function inicializarEventos() {
    // ------------------------------
    // Buscador
    // ------------------------------
    if (elementos.buscador) {
        elementos.buscador
            .addEventListener(
                "input",
                async (e) => {
                    textoBusqueda =
                        e.target.value.trim();
                    if (
                        textoBusqueda.length > 0
                    ) {
                        productosFiltrados =
                            await buscarProductos(
                                textoBusqueda
                            );
                    } else {
                        productosFiltrados =
                            [...productos];
                    }
                    aplicarFiltros();
                }
            );
    }
    // ------------------------------
    // Filtro categoría
    // ------------------------------
    if (elementos.filtroCategoria) {
        elementos.filtroCategoria
            .addEventListener(
                "change",
                (e) => {
                    categoriaSeleccionada =
                        e.target.value;
                    aplicarFiltros();
                }
            );
    }
    // ------------------------------
    // Botones productos
    // Delegación de eventos
    // ------------------------------

    if (elementos.listaProductos) {
        elementos.listaProductos
            .addEventListener(
                "click",
                manejarClickProducto
            );
    }
}
// ======================================================
// Eventos de productos
// ======================================================
async function manejarClickProducto(e) {
    const boton =
        e.target.closest("button");
    if (!boton)
        return;
    const idProducto =
        boton.dataset.id;
    if (!idProducto)
        return;
    // ------------------------------
    // Agregar al carrito
    // ------------------------------
    if (
        boton.classList.contains(
            "btn-agregar"
        )
    ) {
        try {
            await agregarProducto(
                idProducto
            );
            mostrarToast(
                "Producto agregado al carrito"
            );
            if (
                typeof cargarBadgeNavbar ===
                "function"
            ) {
                await cargarBadgeNavbar();
            }
        } catch (error) {
            console.error(error);
            mostrarToast(
                "No se pudo agregar el producto"
            );
        }
    }
    // ------------------------------
    // Ver detalle
    // ------------------------------
    if (
        boton.classList.contains(
            "btn-detalle"
        )
    ) {
        const producto =
            productos.find(
                p => p.id == idProducto
            );
        if (!producto) return;
        abrirModalProducto(producto);
    }
}
// ======================================================
// Arranque
// ======================================================

//iniciarTienda();
document.addEventListener(
    "DOMContentLoaded",
    iniciarTienda
);