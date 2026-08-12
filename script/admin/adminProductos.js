// ======================================================
// adminProductos.js
//
// Módulo encargado exclusivamente de la gestión de
// productos dentro del Panel de Administración.
//
// Responsabilidades:
// - Cargar productos.
// - Renderizar la tabla de productos.
// - Cargar categorías en el selector.
// - Crear productos.
// - Editar productos.
// - Eliminar productos.
// - Validar el formulario.
// - Limpiar el formulario.
// - Actualizar el contador de productos.
//
// Este módulo NO controla la navegación entre secciones.
// Esa responsabilidad pertenece a admin.js.
// ======================================================

import {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../api/productosApi.js";

import {
    obtenerCategorias
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
    esNumeroPositivo,
    mostrarError,
    limpiarError
} from "../utils/validator.js";


// ======================================================
// ELEMENTOS DEL DASHBOARD
// ======================================================


const totalProductos =
    document.getElementById("totalProductos");

// ======================================================
// ELEMENTOS DEL DOM
//
// Los elementos se declaran con let porque el HTML de este
// módulo se crea dinámicamente dentro de adminContenido.
//
// Primero se inserta el HTML.
// Después se obtienen las referencias del DOM.
// ======================================================

let tablaProductos;

let productoId;

let nombre;

let precio;

let stock;

let categoria;

let imagenUrl;

let descripcion;

let formulario;

let formTitulo;

let btnGuardar;

let btnLimpiarFormulario;

let btnCancelarEdicion;

// ======================================================
// INICIALIZAR MÓDULO DE PRODUCTOS
//
// Esta es la función pública que será llamada desde
// admin.js cuando el usuario haga click en la tarjeta
// "Productos" del dashboard.
//
// Se utiliza una bandera para evitar registrar los mismos
// eventos más de una vez.
// ======================================================

// ======================================================
// INICIALIZAR MÓDULO DE PRODUCTOS
//
// Recibe el contenedor dinámico desde admin.js.
//
// Flujo:
// 1. Inserta el HTML del módulo.
// 2. Obtiene los elementos del formulario.
// 3. Registra los eventos.
// 4. Inicializa validaciones.
// 5. Carga categorías.
// 6. Carga productos.
// ======================================================

export async function iniciarAdminProductos(contenedor) {

    // --------------------------------------------------
    // Insertar la vista del módulo dentro del panel.
    // --------------------------------------------------

    contenedor.innerHTML = obtenerVistaProductos();


    // --------------------------------------------------
    // Obtener elementos después de crear el HTML.
    // --------------------------------------------------

    obtenerElementosDOM();


    // --------------------------------------------------
    // Registrar eventos.
    // --------------------------------------------------

    formulario.addEventListener(
        "submit",
        guardarProducto
    );

    btnLimpiarFormulario.addEventListener(
        "click",
        limpiarFormulario
    );

    btnCancelarEdicion.addEventListener(
        "click",
        cancelarEdicion
    );


    // --------------------------------------------------
    // Inicializar validaciones.
    // --------------------------------------------------

    inicializarValidaciones();


    // --------------------------------------------------
    // Cargar datos iniciales.
    // --------------------------------------------------

    await cargarCategorias();

    await cargarProductos();
}

// ======================================================
// OBTENER ELEMENTOS DEL DOM
//
// Se ejecuta después de insertar la vista dinámica.
// De esta forma todos los elementos ya existen.
// ======================================================

function obtenerElementosDOM() {

    tablaProductos =
        document.getElementById("tablaProductos");

    productoId =
        document.getElementById("productoId");

    nombre =
        document.getElementById("nombre");

    precio =
        document.getElementById("precio");

    stock =
        document.getElementById("stock");

    categoria =
        document.getElementById("categoria");

    imagenUrl =
        document.getElementById("imagenUrl");

    descripcion =
        document.getElementById("descripcion");

    formulario =
        document.getElementById("formProducto");

    formTitulo =
        document.getElementById("formTitulo");

    btnGuardar =
        document.getElementById("btnGuardar");

    btnLimpiarFormulario =
        document.getElementById(
            "btnLimpiarFormulario"
        );

    btnCancelarEdicion =
        document.getElementById(
            "btnCancelarEdicion"
        );
}

// ======================================================
// VISTA DE PRODUCTOS
//
// Devuelve el HTML correspondiente a la gestión de
// productos.
//
// Este HTML se inserta dinámicamente dentro del
// contenedor adminContenido.
// ======================================================

function obtenerVistaProductos() {

    return `
        <!-- ==========================================
             FORMULARIO DE PRODUCTOS
        =========================================== -->

        <section class="admin-form-section">

            <h3 id="formTitulo">
                Nuevo producto
            </h3>

            <form
                id="formProducto"
                class="admin-form"
                novalidate
            >

                <input
                    type="hidden"
                    id="productoId"
                >


                <!-- Nombre -->

                <div class="campo">

                    <label for="nombre">
                        Nombre
                    </label>

                    <input
                        type="text"
                        id="nombre"
                    >

                    <small
                        id="nombre-error"
                        class="texto-error"
                    ></small>

                </div>


                <!-- Precio -->

                <div class="campo">

                    <label for="precio">
                        Precio
                    </label>

                    <input
                        type="number"
                        id="precio"
                        min="0"
                        step="0.01"
                    >

                    <small
                        id="precio-error"
                        class="texto-error"
                    ></small>

                </div>


                <!-- Categoría -->

                <div class="campo">

                    <label for="categoria">
                        Categoría
                    </label>

                    <select
                        id="categoria"
                    >
                        <option value="">
                            Seleccioná una categoría
                        </option>
                    </select>

                    <small
                        id="categoria-error"
                        class="texto-error"
                    ></small>

                </div>


                <!-- Stock -->

                <div class="campo">

                    <label for="stock">
                        Stock
                    </label>

                    <input
                        type="number"
                        id="stock"
                        min="0"
                        step="1"
                    >

                    <small
                        id="stock-error"
                        class="texto-error"
                    ></small>

                </div>


                <!-- Imagen -->

                <div class="campo campo-full">

                    <label for="imagenUrl">
                        URL de imagen
                    </label>

                    <input
                        type="text"
                        id="imagenUrl"
                        placeholder="https://..."
                    >

                    <small
                        id="imagenUrl-error"
                        class="texto-error"
                    ></small>

                </div>


                <!-- Descripción -->

                <div class="campo campo-full">

                    <label for="descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="descripcion"
                        rows="3"
                    ></textarea>

                    <small
                        id="descripcion-error"
                        class="texto-error"
                    ></small>

                </div>


                <!-- Acciones -->

                <div class="campo-acciones">

                    <button
                        type="submit"
                        id="btnGuardar"
                        class="btn-primario"
                    >
                        Crear producto
                    </button>


                    <button
                        type="button"
                        id="btnLimpiarFormulario"
                        class="btn-secundario"
                    >
                        Limpiar formulario
                    </button>


                    <button
                        type="button"
                        id="btnCancelarEdicion"
                        class="btn-secundario"
                        style="display:none;"
                    >
                        Cancelar edición
                    </button>

                </div>

            </form>

        </section>


        <!-- ==========================================
             TABLA DE PRODUCTOS
        =========================================== -->

        <section class="admin-tabla-section">

            <h3>
                Productos existentes
            </h3>

            <div class="admin-tabla-wrapper">

                <table class="admin-tabla">

                    <thead>

                        <tr>

                            <th>Imagen</th>

                            <th>Nombre</th>

                            <th>Categoría</th>

                            <th>Precio</th>

                            <th>Stock</th>

                            <th>Acciones</th>

                        </tr>

                    </thead>


                    <tbody id="tablaProductos">

                        <tr>

                            <td
                                colspan="6"
                                class="admin-cargando"
                            >
                                Cargando productos...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>
    `;
}

// ======================================================
// CARGAR PRODUCTOS
//
// Obtiene los productos desde la API, actualiza el
// contador del dashboard y renderiza la tabla.
// ======================================================

export async function cargarProductos() {

    try {

        const productos =
            await obtenerProductos();

        if (totalProductos) {

            totalProductos.textContent =
                productos.length;
        }

        renderizarTabla(productos);

    }
    catch (error) {

        console.error(
            "Error al cargar productos:",
            error
        );

        if (tablaProductos) {

            tablaProductos.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="admin-cargando"
                    >
                        No se pudieron cargar los productos.
                    </td>
                </tr>
            `;
        }
    }
}


// ======================================================
// CARGAR CATEGORÍAS
//
// Obtiene las categorías disponibles y las agrega al
// selector del formulario de productos.
// ======================================================

async function cargarCategorias() {

    if (!categoria) return;

    try {

        const categorias =
            await obtenerCategorias();

        categoria.innerHTML = `
            <option value="">
                Seleccioná una categoría
            </option>
        `;

        categorias.forEach(cat => {

            const option =
                document.createElement("option");

            option.value =
                cat.id;

            option.textContent =
                cat.nombre;

            categoria.appendChild(option);
        });

    }
    catch (error) {

        console.error(
            "Error al cargar categorías:",
            error
        );

        mostrarToast(
            "No se pudieron cargar las categorías."
        );
    }
}


// ======================================================
// RENDERIZAR TABLA
//
// Recibe la lista de productos y genera las filas de la
// tabla junto con sus botones de editar y eliminar.
// ======================================================

export function renderizarTabla(productos) {

    if (!tablaProductos) return;


    // --------------------------------------------------
    // Caso: no existen productos.
    // --------------------------------------------------

    if (productos.length === 0) {

        tablaProductos.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="admin-cargando"
                >
                    No hay productos registrados.
                </td>
            </tr>
        `;

        return;
    }


    // --------------------------------------------------
    // Generar filas.
    // --------------------------------------------------

    tablaProductos.innerHTML =
        productos.map(producto => `

            <tr>

                <td>
                    <img
                        src="${producto.imagenUrl}"
                        alt="${producto.nombre}"
                        width="60"
                    >
                </td>

                <td>
                    ${producto.nombre}
                </td>

                <td>
                    ${producto.categoria?.nombre ?? "-"}
                </td>

                <td>
                    $${producto.precio}
                </td>

                <td>
                    ${producto.stock}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-editar"
                        data-id="${producto.id}"
                        aria-label="Editar producto"
                        title="Editar producto"
                    >
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>


                    <button
                        type="button"
                        class="btn-eliminar"
                        data-id="${producto.id}"
                        aria-label="Eliminar producto"
                        title="Eliminar producto"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>

            </tr>

        `).join("");


    // --------------------------------------------------
    // Eventos de edición.
    // --------------------------------------------------

    document
        .querySelectorAll(".btn-editar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                editarProducto
            );
        });


    // --------------------------------------------------
    // Eventos de eliminación.
    // --------------------------------------------------

    document
        .querySelectorAll(".btn-eliminar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const id =
                        boton.dataset.id;

                    eliminarProductoAdmin(id);
                }
            );
        });
}


// ======================================================
// EDITAR PRODUCTO
//
// Obtiene los datos del producto seleccionado y carga
// su información dentro del formulario.
// ======================================================

async function editarProducto(event) {

    try {

        const id =
            event.currentTarget.dataset.id;

        const producto =
            await obtenerProducto(id);


        // --------------------------------------------------
        // Cargar datos en el formulario.
        // --------------------------------------------------

        productoId.value =
            producto.id;

        nombre.value =
            producto.nombre;

        precio.value =
            producto.precio;

        stock.value =
            producto.stock;

        categoria.value =
            producto.categoria?.id ?? "";

        imagenUrl.value =
            producto.imagenUrl;

        descripcion.value =
            producto.descripcion;


        // --------------------------------------------------
        // Cambiar interfaz a modo edición.
        // --------------------------------------------------

        formTitulo.textContent =
            "Editar producto";

        btnGuardar.textContent =
            "Guardar cambios";

        btnCancelarEdicion.style.display =
            "inline-block";


        // --------------------------------------------------
        // Limpiar posibles errores anteriores.
        // --------------------------------------------------

        limpiarErroresFormulario();


        // --------------------------------------------------
        // Llevar al usuario hacia el formulario.
        // --------------------------------------------------

        formulario?.scrollIntoView({
            behavior: "smooth",
            block: "start"
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
// VALIDAR FORMULARIO
//
// Devuelve true si todos los campos son válidos.
// Devuelve false cuando encuentra algún error.
// ======================================================

function validarFormularioProducto() {

    limpiarErroresFormulario();


    // --------------------------------------------------
    // Nombre
    // --------------------------------------------------

    if (esCampoVacio(nombre.value)) {

        mostrarError(
            nombre,
            "Ingrese el nombre del producto."
        );

        nombre.focus();

        return false;
    }


    if (
        !validarLongitud(
            nombre.value,
            3,
            100
        )
    ) {

        mostrarError(
            nombre,
            "El nombre debe tener entre 3 y 100 caracteres."
        );

        nombre.focus();

        return false;
    }


    // --------------------------------------------------
    // Precio
    // --------------------------------------------------

    if (esCampoVacio(precio.value)) {

        mostrarError(
            precio,
            "Ingrese el precio del producto."
        );

        precio.focus();

        return false;
    }


    if (!esNumeroPositivo(precio.value)) {

        mostrarError(
            precio,
            "El precio debe ser mayor que cero."
        );

        precio.focus();

        return false;
    }


    // --------------------------------------------------
    // Categoría
    // --------------------------------------------------

    if (esCampoVacio(categoria.value)) {

        mostrarError(
            categoria,
            "Seleccione una categoría."
        );

        categoria.focus();

        return false;
    }


    // --------------------------------------------------
    // Stock
    // --------------------------------------------------

    if (esCampoVacio(stock.value)) {

        mostrarError(
            stock,
            "Ingrese la cantidad disponible."
        );

        stock.focus();

        return false;
    }


    if (Number(stock.value) < 0) {

        mostrarError(
            stock,
            "El stock no puede ser negativo."
        );

        stock.focus();

        return false;
    }


    // --------------------------------------------------
    // Imagen
    // --------------------------------------------------

    if (esCampoVacio(imagenUrl.value)) {

        mostrarError(
            imagenUrl,
            "Ingrese la URL de la imagen."
        );

        imagenUrl.focus();

        return false;
    }


    // --------------------------------------------------
    // Descripción
    // --------------------------------------------------

    if (esCampoVacio(descripcion.value)) {

        mostrarError(
            descripcion,
            "Ingrese una descripción."
        );

        descripcion.focus();

        return false;
    }


    if (
        !validarLongitud(
            descripcion.value,
            10,
            1000
        )
    ) {

        mostrarError(
            descripcion,
            "La descripción debe tener entre 10 y 1000 caracteres."
        );

        descripcion.focus();

        return false;
    }


    return true;
}


// ======================================================
// GUARDAR PRODUCTO
//
// Si productoId tiene un valor:
//     actualiza el producto.
//
// Si productoId está vacío:
//     crea un producto nuevo.
// ======================================================

async function guardarProducto(event) {

    event.preventDefault();


    // --------------------------------------------------
    // Validar antes de enviar.
    // --------------------------------------------------

    if (!validarFormularioProducto()) {

        return;
    }


    try {

        const datos = {

            nombre:
                nombre.value.trim(),

            precio:
                Number(precio.value),

            descripcion:
                descripcion.value.trim(),

            stock:
                Number(stock.value),

            imagenUrl:
                imagenUrl.value.trim(),

            categoriaId:
                Number(categoria.value)
        };


        console.log(
            "Datos del producto:",
            datos
        );


        mostrarSpinner();


        // --------------------------------------------------
        // Actualizar producto.
        // --------------------------------------------------

        if (productoId.value) {

            await actualizarProducto(
                productoId.value,
                datos
            );

            mostrarToast(
                "Producto actualizado correctamente."
            );
        }


        // --------------------------------------------------
        // Crear producto.
        // --------------------------------------------------

        else {

            await crearProducto(datos);

            mostrarToast(
                "Producto creado correctamente."
            );
        }


        // --------------------------------------------------
        // Volver al estado inicial.
        // --------------------------------------------------

        cancelarEdicion();


        // --------------------------------------------------
        // Actualizar tabla y contador.
        // --------------------------------------------------

        await cargarProductos();

    }
    catch (error) {

        console.error(
            "Error al guardar producto:",
            error
        );

        mostrarToast(
            error.message ??
            "No se pudo guardar el producto."
        );
    }
    finally {

        ocultarSpinner();
    }
}


// ======================================================
// ELIMINAR PRODUCTO
//
// Solicita confirmación antes de realizar la eliminación.
// ======================================================

async function eliminarProductoAdmin(id) {

    const confirmar =
        await confirmarAccion(
            "¿Estás seguro de que querés eliminar este producto?"
        );


    // --------------------------------------------------
    // El usuario canceló.
    // --------------------------------------------------

    if (!confirmar) {

        return;
    }


    try {

        mostrarSpinner();

        await eliminarProducto(id);


        mostrarToast(
            "Producto eliminado correctamente."
        );


        // --------------------------------------------------
        // Actualizar tabla y contador.
        // --------------------------------------------------

        await cargarProductos();

    }
    catch (error) {

        console.error(
            "Error al eliminar producto:",
            error
        );

        mostrarToast(
            error.message ??
            "No se pudo eliminar el producto."
        );
    }
    finally {

        ocultarSpinner();
    }
}


// ======================================================
// LIMPIAR FORMULARIO
//
// Limpia los campos, errores y vuelve el formulario al
// estado inicial de creación.
// ======================================================

function limpiarFormulario() {

    formulario?.reset();

    productoId.value = "";

    formTitulo.textContent =
        "Nuevo producto";

    btnGuardar.textContent =
        "Crear producto";

    btnCancelarEdicion.style.display =
        "none";

    limpiarErroresFormulario();
}


// ======================================================
// CANCELAR EDICIÓN
//
// Actualmente utiliza la misma lógica que limpiar el
// formulario, pero se mantiene separada para que cada
// acción tenga una responsabilidad clara.
// ======================================================

function cancelarEdicion() {

    limpiarFormulario();
}


// ======================================================
// LIMPIAR ERRORES DEL FORMULARIO
//
// Elimina todos los mensajes visuales de validación.
// ======================================================

function limpiarErroresFormulario() {

    [
        nombre,
        precio,
        categoria,
        stock,
        imagenUrl,
        descripcion
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

function inicializarValidaciones() {

    const campos = [

        nombre,
        precio,
        categoria,
        stock,
        imagenUrl,
        descripcion
    ];


    campos.forEach(campo => {

        if (!campo) return;


        const evento =
            campo.tagName === "SELECT"
                ? "change"
                : "input";


        campo.addEventListener(
            evento,
            () => limpiarError(campo)
        );
    });
}
