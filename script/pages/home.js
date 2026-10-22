// ======================================================
// home.js
// Controlador de la página principal.
//
// Responsabilidades:
// - Inicializar la Home.
// - Cargar productos destacados desde la API.
// - Renderizar las cards.
// - Gestionar agregar al carrito.
// - Gestionar el detalle del producto.
// ======================================================

import { obtenerProductosDestacados } from "../api/productosApi.js";
import { crearProductoCard } from "../components/productoCard.js";
import { agregarProducto } from "../api/carritoApi.js";
import { cargarBadgeNavbar } from "../components/navbar.js";
import { mostrarToast } from "../components/toast.js";
import {
    abrirModalProducto,
    inicializarModalProducto
} from "../components/modalDetalles.js";

// ======================================================
// Estado interno de la página
// ======================================================

// Guarda los productos destacados obtenidos desde el backend.
// Se reutiliza para mostrar el detalle sin volver a consultar la API.
let productosDestacados = [];

let temporizadoresCarga = [];

const mensajesCargaHome = [
    {
        demora: 0,
        mensaje: "Cargando productos destacados...",
        detalle: "Estamos preparando nuestra selección."
    },
    {
        demora: 5000,
        mensaje: "Buscando tus productos favoritos...",
        detalle: "Un momento, ya casi están listos."
    },
    {
        demora: 10000,
        mensaje: "Preparando algo especial para vos...",
        detalle: "Gracias por esperar."
    }
];


// ======================================================
// Elementos del DOM
// ======================================================

const elementos = {
    productosDestacados:
        document.getElementById("productos-destacados")
};

// ======================================================
// Inicialización
// ======================================================

async function iniciarHome() {

    console.log("Home inicializada.");
    iniciarMensajesCargaHome();

    try {
        // Inicializa el modal de detalle.
        inicializarModalProducto();

        // Inicializa los eventos de las cards.
        inicializarEventos();

         // PRUEBA TEMPORAL: simula una carga lenta de 8 segundos.
        //await new Promise(resolve => setTimeout(resolve, 11000));
        // Carga los productos destacados.
        await cargarProductosDestacados();

    } catch (error) {

        console.error(
            "Error iniciando Home:",
            error
        );

        mostrarToast(
            "No se pudieron cargar los productos destacados"
        );

    }finally {
        detenerMensajesCargaHome();
    }
}

// ======================================================
// Cargar productos destacados
// ======================================================

async function cargarProductosDestacados() {

    if (!elementos.productosDestacados) {

        console.warn(
            "No se encontró el contenedor de productos destacados."
        );

        return;
    }

    // Consulta al backend.
    productosDestacados =
        await obtenerProductosDestacados();

    console.log(
        "Productos destacados recibidos:",
        productosDestacados
    );

    // Si no existen productos destacados.
    if (
        !productosDestacados ||
        productosDestacados.length === 0
    ) {

        elementos.productosDestacados.innerHTML = `
            <p class="mensaje-sin-productos">
                Actualmente no hay productos destacados.
            </p>
        `;

        return;
    }

    // Genera las cards utilizando el componente reutilizable.
    elementos.productosDestacados.innerHTML =
        productosDestacados
            .map(producto =>
                crearProductoCard(producto)
            )
            .join("");
}

// ======================================================
// Inicializar eventos
// ======================================================

function inicializarEventos() {

    if (!elementos.productosDestacados) {
        return;
    }

    // Delegación de eventos:
    // permite manejar los botones de todas las cards.
    elementos.productosDestacados
        .addEventListener(
            "click",
            manejarClickProducto
        );
}

// ======================================================
// Eventos de productos
// ======================================================

async function manejarClickProducto(e) {

    const boton =
        e.target.closest("button");

    if (!boton) {
        return;
    }

    const idProducto =
        boton.dataset.id;

    if (!idProducto) {
        return;
    }

    // ==================================================
    // Agregar al carrito
    // ==================================================

    if (
        boton.classList.contains("btn-agregar")
    ) {

        try {

            await agregarProducto(idProducto);

            mostrarToast(
                "Producto agregado al carrito"
            );

            // Actualiza el contador del carrito.
            await cargarBadgeNavbar();

        } catch (error) {

            console.error(
                "Error agregando producto:",
                error
            );

            mostrarToast(
                "No se pudo agregar el producto"
            );
        }

        return;
    }

    // ==================================================
    // Ver detalle
    // ==================================================

    if (
        boton.classList.contains("btn-detalle")
    ) {

        // Busca el producto en la lista que ya tenemos.
        // No hacemos otra petición al backend.
        const producto =
            productosDestacados.find(
                producto =>
                    producto.id == idProducto
            );

        if (!producto) {
            return;
        }

        abrirModalProducto(producto);
    }
}


// ======================================================
// Limpia los temporizadores activos del loader de Home.
// ======================================================
function limpiarTemporizadoresCarga() {
    temporizadoresCarga.forEach((temporizador) => {
        clearTimeout(temporizador);
    });

    temporizadoresCarga = [];
}

// ======================================================
// Actualiza el mensaje visible del loader de Home.
// ======================================================
function actualizarMensajeCargaHome(indice) {
    const mensaje = document.querySelector(
        ".loader-productos-destacados p"
    );

    const detalle = document.querySelector(
        ".loader-productos-destacados > span"
    );

    const contenido = mensajesCargaHome[indice];

    if (!contenido) return;

    if (mensaje) {
        mensaje.textContent = contenido.mensaje;
    }

    if (detalle) {
        detalle.textContent = contenido.detalle;
    }
}

// ======================================================
// Inicia la secuencia de mensajes del loader de Home.
// ======================================================
function iniciarMensajesCargaHome() {
    limpiarTemporizadoresCarga();

    actualizarMensajeCargaHome(0);

    mensajesCargaHome.slice(1).forEach((contenido, indice) => {
        const temporizador = setTimeout(() => {
            actualizarMensajeCargaHome(indice + 1);
        }, contenido.demora);

        temporizadoresCarga.push(temporizador);
    });
}

// ======================================================
// Detiene la secuencia de mensajes del loader de Home.
// ======================================================
function detenerMensajesCargaHome() {
    limpiarTemporizadoresCarga();
}
// ======================================================
// Arranque
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarHome
);