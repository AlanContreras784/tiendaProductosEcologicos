// ======================================================
// adminCategorias.js
//
// Módulo encargado exclusivamente de la gestión de
// categorías dentro del Panel de Administración.
//
// Responsabilidades:
// - Cargar categorías.
// - Renderizar la tabla.
// - Crear categorías.
// - Editar categorías.
// - Eliminar categorías.
// - Validar el formulario.
// - Limpiar el formulario.
// - Actualizar el contador del dashboard.
//
// Este módulo NO controla la navegación entre secciones.
// Esa responsabilidad pertenece a admin.js.
// ======================================================

import {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from "../api/categoriasApi.js";

import {
    confirmarAccion
} from "../components/modalConfirmacion.js";

import {
    mostrarToast
} from "../components/toast.js";

import {
    mostrarSpinner,
    ocultarSpinner
} from "../components/spinner.js";

import {
    esCampoVacio,
    validarLongitud,
    mostrarError,
    limpiarError
} from "../utils/validator.js";


// ======================================================
// ELEMENTOS DEL DASHBOARD
// ======================================================

const totalCategorias =
    document.getElementById("totalCategorias");


// ======================================================
// ELEMENTOS DEL MÓDULO
//
// Se declaran con let porque el HTML del módulo se crea
// dinámicamente dentro de adminContenido.
//
// Primero se renderiza la vista.
// Después se obtienen los elementos del DOM.
// ======================================================

let formulario;

let categoriaId;

let categoriaNombre;

let categoriaDescripcion;

let categoriaFormTitulo;

let btnGuardarCategoria;

let btnLimpiarCategoria;

let btnCancelarCategoria;

let tablaCategorias;

// ======================================================
// TABLA
// ======================================================

// const tablaCategorias =
//     document.getElementById("tablaCategorias");


// ======================================================
// INICIALIZAR MÓDULO DE CATEGORÍAS
//
// Recibe el contenedor desde admin.js.
//
// Flujo:
// 1. Inserta la vista.
// 2. Obtiene los elementos DOM.
// 3. Registra eventos.
// 4. Inicializa validaciones.
// 5. Carga las categorías.
// ======================================================

export async function iniciarAdminCategorias(contenedor) {

    // --------------------------------------------------
    // Insertar la vista del módulo.
    // --------------------------------------------------

    contenedor.innerHTML =
        obtenerVistaCategorias();


    // --------------------------------------------------
    // Obtener elementos después de crear el HTML.
    // --------------------------------------------------

    obtenerElementosDOM();


    // --------------------------------------------------
    // Registrar eventos.
    // --------------------------------------------------

    formulario.addEventListener(
        "submit",
        guardarCategoria
    );

    btnLimpiarCategoria.addEventListener(
        "click",
        limpiarFormularioCategoria
    );

    btnCancelarCategoria.addEventListener(
        "click",
        cancelarEdicionCategoria
    );


    // --------------------------------------------------
    // Inicializar validaciones.
    // --------------------------------------------------

    inicializarValidacionesCategoria();


    // --------------------------------------------------
    // Cargar categorías.
    // --------------------------------------------------

    await cargarCategorias();
}

// ======================================================
// OBTENER ELEMENTOS DEL DOM
//
// Se ejecuta después de insertar la vista dinámica.
// En este momento todos los elementos ya existen.
// ======================================================

function obtenerElementosDOM() {

    formulario =
        document.getElementById("formCategoria");

    categoriaId =
        document.getElementById("categoriaId");

    categoriaNombre =
        document.getElementById("categoriaNombre");

    categoriaDescripcion =
        document.getElementById(
            "categoriaDescripcion"
        );

    categoriaFormTitulo =
        document.getElementById(
            "categoriaFormTitulo"
        );

    btnGuardarCategoria =
        document.getElementById(
            "btnGuardarCategoria"
        );

    btnLimpiarCategoria =
        document.getElementById(
            "btnLimpiarCategoria"
        );

    btnCancelarCategoria =
        document.getElementById(
            "btnCancelarCategoria"
        );

    tablaCategorias =
        document.getElementById(
            "tablaCategorias"
        );
}

// ======================================================
// VISTA DE CATEGORÍAS
//
// Devuelve el HTML correspondiente a la gestión de
// categorías.
//
// El contenido se inserta dinámicamente dentro de
// adminContenido.
// ======================================================

function obtenerVistaCategorias() {

    return `
        <!-- ==========================================
             FORMULARIO DE CATEGORÍAS
        =========================================== -->

        <section class="admin-categorias-section">

            <div class="admin-seccion-header">

                <div>

                    <h3>
                        Gestión de categorías
                    </h3>

                    <p>
                        Creá, editá y administrá las
                        categorías disponibles en la tienda.
                    </p>

                </div>

            </div>


            <div class="categoria-form-section">

                <h4 id="categoriaFormTitulo">
                    Nueva categoría
                </h4>


                <form
                    id="formCategoria"
                    class="categoria-form"
                    novalidate
                >

                    <!-- ID oculto para edición -->

                    <input
                        type="hidden"
                        id="categoriaId"
                    >


                    <!-- Nombre -->

                    <div class="campo">

                        <label for="categoriaNombre">
                            Nombre
                        </label>

                        <input
                            type="text"
                            id="categoriaNombre"
                            placeholder="Ej: Productos reutilizables"
                        >

                        <small
                            id="categoriaNombre-error"
                            class="texto-error"
                        ></small>

                    </div>


                    <!-- Descripción -->

                    <div class="campo campo-full">

                        <label for="categoriaDescripcion">
                            Descripción
                        </label>

                        <textarea
                            id="categoriaDescripcion"
                            rows="3"
                            placeholder="Describí los productos que pertenecen a esta categoría"
                        ></textarea>

                        <small
                            id="categoriaDescripcion-error"
                            class="texto-error"
                        ></small>

                    </div>


                    <!-- Acciones -->

                    <div class="campo-acciones">

                        <button
                            type="submit"
                            id="btnGuardarCategoria"
                            class="btn-primario"
                        >
                            Crear categoría
                        </button>


                        <button
                            type="button"
                            id="btnLimpiarCategoria"
                            class="btn-secundario"
                        >
                            Limpiar formulario
                        </button>


                        <button
                            type="button"
                            id="btnCancelarCategoria"
                            class="btn-secundario"
                            style="display:none;"
                        >
                            Cancelar edición
                        </button>

                    </div>

                </form>

            </div>


            <!-- ==========================================
                 TABLA DE CATEGORÍAS
            =========================================== -->

            <section class="admin-tabla-section">

                <h4>
                    Categorías existentes
                </h4>


                <div class="admin-tabla-wrapper">

                    <table class="admin-tabla">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Nombre</th>

                                <th>Descripción</th>

                                <th>Acciones</th>

                            </tr>

                        </thead>


                        <tbody id="tablaCategorias">

                            <tr>

                                <td
                                    colspan="4"
                                    class="admin-cargando"
                                >
                                    Cargando categorías...
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </section>

        </section>
    `;
}

// ======================================================
// CARGAR CATEGORÍAS
//
// Obtiene las categorías desde la API, actualiza el
// contador del dashboard y renderiza la tabla.
// ======================================================

export async function cargarCategorias() {

    try {

        const categorias =
            await obtenerCategorias();


        // Actualizar contador del dashboard.

        if (totalCategorias) {

            totalCategorias.textContent =
                categorias.length;
        }


        // Renderizar tabla.

        renderizarTablaCategorias(
            categorias
        );

    }
    catch (error) {

        console.error(
            "Error al cargar categorías:",
            error
        );


        if (tablaCategorias) {

            tablaCategorias.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="admin-cargando"
                    >
                        No se pudieron cargar las categorías.
                    </td>
                </tr>
            `;
        }

        mostrarToast(
            "No se pudieron cargar las categorías."
        );
    }
}


// ======================================================
// RENDERIZAR TABLA DE CATEGORÍAS
//
// Genera las filas de la tabla y agrega los botones
// para editar y eliminar.
// ======================================================

export function renderizarTablaCategorias(
    categorias
) {

    if (!tablaCategorias) return;


    // --------------------------------------------------
    // Caso: no existen categorías.
    // --------------------------------------------------

    if (categorias.length === 0) {

        tablaCategorias.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="admin-cargando"
                >
                    No hay categorías registradas.
                </td>
            </tr>
        `;

        return;
    }


    // --------------------------------------------------
    // Generar filas.
    // --------------------------------------------------

    tablaCategorias.innerHTML =
        categorias.map(categoria => `

            <tr>

                <td>
                    ${categoria.id}
                </td>

                <td>
                    ${categoria.nombre}
                </td>

                <td>
                    ${categoria.descripcion}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-editar"
                        data-id="${categoria.id}"
                        aria-label="Editar categoría"
                        title="Editar categoría"
                    >
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button
                        type="button"
                        class="btn-eliminar"
                        data-id="${categoria.id}"
                        aria-label="Eliminar categoría"
                        title="Eliminar categoría"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>

            </tr>

        `).join("");


    // --------------------------------------------------
    // Eventos de edición.
    // --------------------------------------------------

    tablaCategorias
        .querySelectorAll(".btn-editar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                editarCategoria
            );
        });


    // --------------------------------------------------
    // Eventos de eliminación.
    // --------------------------------------------------

    tablaCategorias
        .querySelectorAll(".btn-eliminar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const id =
                        boton.dataset.id;

                    eliminarCategoriaAdmin(
                        id
                    );
                }
            );
        });
}


// ======================================================
// EDITAR CATEGORÍA
//
// Obtiene una categoría por ID y carga sus datos dentro
// del formulario.
// ======================================================

async function editarCategoria(event) {

    try {

        const id =
            event.currentTarget.dataset.id;


        const categoria =
            await obtenerCategoria(id);


        // --------------------------------------------------
        // Cargar datos.
        // --------------------------------------------------

        categoriaId.value =
            categoria.id;

        categoriaNombre.value =
            categoria.nombre;

        categoriaDescripcion.value =
            categoria.descripcion;


        // --------------------------------------------------
        // Activar modo edición.
        // --------------------------------------------------

        categoriaFormTitulo.textContent =
            "Editar categoría";

        btnGuardarCategoria.textContent =
            "Guardar cambios";

        btnCancelarCategoria.style.display =
            "inline-block";


        // --------------------------------------------------
        // Limpiar errores anteriores.
        // --------------------------------------------------

        limpiarErroresCategoria();


        // --------------------------------------------------
        // Llevar al usuario al formulario.
        // --------------------------------------------------

        formulario?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
    catch (error) {

        console.error(
            "Error al cargar categoría:",
            error
        );

        mostrarToast(
            "No se pudo cargar la categoría."
        );
    }
}


// ======================================================
// VALIDAR FORMULARIO DE CATEGORÍA
//
// Devuelve true si todos los campos son válidos.
// ======================================================

function validarFormularioCategoria() {

    limpiarErroresCategoria();


    // --------------------------------------------------
    // Nombre
    // --------------------------------------------------

    if (
        esCampoVacio(
            categoriaNombre.value
        )
    ) {

        mostrarError(
            categoriaNombre,
            "Ingrese el nombre de la categoría."
        );

        categoriaNombre.focus();

        return false;
    }


    if (
        !validarLongitud(
            categoriaNombre.value,
            3,
            100
        )
    ) {

        mostrarError(
            categoriaNombre,
            "El nombre debe tener entre 3 y 100 caracteres."
        );

        categoriaNombre.focus();

        return false;
    }


    // --------------------------------------------------
    // Descripción
    // --------------------------------------------------

    if (
        esCampoVacio(
            categoriaDescripcion.value
        )
    ) {

        mostrarError(
            categoriaDescripcion,
            "Ingrese una descripción."
        );

        categoriaDescripcion.focus();

        return false;
    }


    if (
        !validarLongitud(
            categoriaDescripcion.value,
            5,
            500
        )
    ) {

        mostrarError(
            categoriaDescripcion,
            "La descripción debe tener entre 5 y 500 caracteres."
        );

        categoriaDescripcion.focus();

        return false;
    }


    return true;
}


// ======================================================
// GUARDAR CATEGORÍA
//
// Si categoriaId tiene valor:
//     actualiza la categoría.
//
// Si está vacío:
//     crea una categoría nueva.
// ======================================================

async function guardarCategoria(event) {

    event.preventDefault();


    // --------------------------------------------------
    // Validar antes de enviar.
    // --------------------------------------------------

    if (
        !validarFormularioCategoria()
    ) {

        return;
    }


    try {

        const datos = {

            nombre:
                categoriaNombre.value.trim(),

            descripcion:
                categoriaDescripcion.value.trim()
        };


        mostrarSpinner();


        // --------------------------------------------------
        // Actualizar categoría.
        // --------------------------------------------------

        if (categoriaId.value) {

            await actualizarCategoria(
                categoriaId.value,
                datos
            );

            mostrarToast(
                "Categoría actualizada correctamente."
            );
        }


        // --------------------------------------------------
        // Crear categoría.
        // --------------------------------------------------

        else {

            await crearCategoria(
                datos
            );

            mostrarToast(
                "Categoría creada correctamente."
            );
        }


        // --------------------------------------------------
        // Volver al estado inicial.
        // --------------------------------------------------

        cancelarEdicionCategoria();


        // --------------------------------------------------
        // Actualizar tabla y contador.
        // --------------------------------------------------

        await cargarCategorias();

    }
    catch (error) {

        console.error(
            "Error al guardar categoría:",
            error
        );

        mostrarToast(
            error.message ??
            "No se pudo guardar la categoría."
        );
    }
    finally {

        ocultarSpinner();
    }
}


// ======================================================
// ELIMINAR CATEGORÍA
//
// Solicita confirmación antes de eliminar.
// ======================================================

async function eliminarCategoriaAdmin(id) {

    const confirmar =
        await confirmarAccion(
            "¿Estás seguro de que querés eliminar esta categoría?"
        );


    if (!confirmar) {

        return;
    }


    try {

        mostrarSpinner();


        await eliminarCategoria(
            id
        );


        mostrarToast(
            "Categoría eliminada correctamente."
        );


        // --------------------------------------------------
        // Actualizar tabla y contador.
        // --------------------------------------------------

        await cargarCategorias();

    }
    catch (error) {

        console.error(
            "Error al eliminar categoría:",
            error
        );

        mostrarToast(
            error.message ??
            "No se pudo eliminar la categoría."
        );
    }
    finally {

        ocultarSpinner();
    }
}


// ======================================================
// LIMPIAR FORMULARIO
//
// Limpia campos, errores y devuelve el formulario al
// modo creación.
// ======================================================

function limpiarFormularioCategoria() {

    formulario?.reset();


    categoriaId.value = "";


    categoriaFormTitulo.textContent =
        "Nueva categoría";


    btnGuardarCategoria.textContent =
        "Crear categoría";


    btnCancelarCategoria.style.display =
        "none";


    limpiarErroresCategoria();
}


// ======================================================
// CANCELAR EDICIÓN
//
// Actualmente utiliza la misma lógica que limpiar el
// formulario, pero se mantiene separada por claridad.
// ======================================================

function cancelarEdicionCategoria() {

    limpiarFormularioCategoria();
}


// ======================================================
// LIMPIAR ERRORES
//
// Elimina todos los mensajes de validación visual.
// ======================================================

function limpiarErroresCategoria() {

    [
        categoriaNombre,
        categoriaDescripcion
    ].forEach(campo => {

        if (!campo) return;

        limpiarError(campo);
    });
}


// ======================================================
// INICIALIZAR VALIDACIONES
//
// Cuando el usuario modifica un campo, se elimina el
// mensaje de error correspondiente.
// ======================================================

function inicializarValidacionesCategoria() {

    [
        categoriaNombre,
        categoriaDescripcion
    ].forEach(campo => {

        if (!campo) return;


        campo.addEventListener(
            "input",
            () => {

                limpiarError(
                    campo
                );
            }
        );
    });
}