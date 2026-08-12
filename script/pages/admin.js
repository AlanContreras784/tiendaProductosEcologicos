// ======================================================
// admin.js
//
// Controlador principal del Centro de Administración.
//
// Responsabilidades:
// - Proteger la página para usuarios ADMIN.
// - Inicializar el dashboard.
// - Escuchar los clics en las tarjetas.
// - Cargar dinámicamente los módulos:
//      Productos
//      Categorías
//      Usuarios
//
// Cada módulo administra su propio formulario,
// tabla y lógica.
//
// Esto permite mantener una arquitectura modular,
// similar al concepto de componentes y vistas
// utilizado en aplicaciones modernas.
// ======================================================

import { protegerPaginaAdmin } from "../components/navbar.js";
import { obtenerProductos } from "../api/productosApi.js";
import { obtenerCategorias } from "../api/categoriasApi.js";
import { obtenerCantidadUsuarios, obtenerUsuarios } from "../api/usuariosApi.js";
import { obtenerUsuario } from "../utils/storage.js";

// ======================================================
// Elementos del Dashboard
// ======================================================

const totalProductos = document.getElementById("totalProductos");
const totalCategorias = document.getElementById("totalCategorias");
const totalUsuarios = document.getElementById("totalUsuarios");
const cardProductos = document.getElementById("cardProductos");
const cardCategorias = document.getElementById("cardCategorias");
const cardUsuarios = document.getElementById("cardUsuarios");

// ======================================================
// Contenedor donde se cargan los módulos dinámicamente
// ======================================================

const adminContenido = document.getElementById("adminContenido");

// ======================================================
// Inicialización
// ======================================================

async function iniciarAdmin() {

    // Verifica que el usuario tenga permisos ADMIN.
    if (!protegerPaginaAdmin()) {
        return;
    }
    await cargarDashboard();
    inicializarEventos();
}

// ======================================================
// Eventos del Dashboard
// ======================================================

function inicializarEventos() {

    cardProductos?.addEventListener( "click", cargarModuloProductos);
    cardCategorias?.addEventListener( "click", cargarModuloCategorias);
    cardUsuarios?.addEventListener( "click", cargarModuloUsuarios);
}

// ======================================================
// Carga información del Dashboard
// ======================================================

async function cargarDashboard() {

    try {
        const [
            productos,
            categorias,
            cantidadUsuarios
        ] = await Promise.all([
            obtenerProductos(),
            obtenerCategorias(),
            obtenerCantidadUsuarios()
        ]);
        totalProductos.textContent =  productos.length;
        totalCategorias.textContent = categorias.length;
        totalUsuarios.textContent = cantidadUsuarios;
    }
    catch (error) {
        console.error(
            "Error al cargar dashboard:",
            error
        );
        totalUsuarios.textContent = "0";
    }
}

// ======================================================
// MÓDULO PRODUCTOS
// ======================================================

async function cargarModuloProductos() {

    try {
        const modulo = await import("../admin/adminProductos.js");

        adminContenido.innerHTML = "";

        await modulo.iniciarAdminProductos(
            adminContenido
        );

    }
    catch (error) {
        console.error(
            "Error al cargar módulo productos:",
            error
        );
    }
}

// ======================================================
// MÓDULO CATEGORÍAS
// ======================================================

async function cargarModuloCategorias() {

    try {
        const modulo =
            await import("../admin/adminCategorias.js");

        adminContenido.innerHTML = "";

        await modulo.iniciarAdminCategorias(
            adminContenido
        );
    }
    catch (error) {
        console.error(
            "Error al cargar módulo categorías:",
            error
        );
    }
}

// ======================================================
// MÓDULO USUARIOS
// ======================================================

async function cargarModuloUsuarios() {

    try {
        const modulo =
            await import("../admin/adminUsuarios.js");

        adminContenido.innerHTML = "";

        modulo.iniciarAdminUsuarios(
            adminContenido
        );
    }
    catch (error) {
        console.error(
            "Error al cargar módulo usuarios:",
            error
        );
    }
}

// ======================================================
// Arranque
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarAdmin
);