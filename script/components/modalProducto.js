// ======================================================
// modalProducto.js
// Componente reutilizable para mostrar el detalle
// de un producto dentro de un modal.
//
// Responsabilidades:
// - Abrir el modal.
// - Cargar la información del producto.
// - Cerrar el modal.
// - Devolver el producto actualmente mostrado.
// ======================================================

// ======================================================
// Estado interno del componente
// ======================================================

let productoActual = null;

// ======================================================
// Elementos del DOM
// ======================================================

const elementos = {

    overlay:
        document.getElementById("overlayModal"),

    imagen:
        document.getElementById("modalImagen"),

    categoria:
        document.getElementById("modalCategoria"),

    titulo:
        document.getElementById("modalTitulo"),

    descripcion:
        document.getElementById("modalDescripcion"),

    stock:
        document.getElementById("modalStock"),

    precio:
        document.getElementById("modalPrecio"),

    botonAgregar:
        document.getElementById("modalAgregarCarrito"),

    botonCerrar:
        document.getElementById("btnCerrarModal")

};

// ======================================================
// Abre el modal cargando la información del producto.
// ======================================================

export function abrirModalProducto(producto) {

    productoActual = producto;

    elementos.imagen.src =
        producto.imagenUrl;

    elementos.imagen.alt =
        producto.nombre;

    elementos.categoria.textContent =
        producto.categoria?.nombre ?? "";

    elementos.titulo.textContent =
        producto.nombre;

    elementos.descripcion.textContent =
        producto.descripcion;

    elementos.stock.textContent =
        `${producto.stock} unidades`;

    elementos.precio.textContent =
        `$${producto.precio.toFixed(2)}`;

    elementos.overlay.classList.add("visible");

    elementos.overlay.setAttribute(
        "aria-hidden",
        "false"
    );

}

// ======================================================
// Cierra el modal.
// ======================================================

export function cerrarModalProducto() {

    elementos.overlay.classList.remove("visible");

    elementos.overlay.setAttribute(
        "aria-hidden",
        "true"
    );

}

// ======================================================
// Devuelve el producto mostrado actualmente.
// ======================================================

export function obtenerProductoActual() {

    return productoActual;

}

// ======================================================
// Permite configurar la acción del botón
// "Agregar al carrito" desde tienda.js.
// ======================================================

export function configurarAgregarCarrito(callback) {

    if (!elementos.botonAgregar) return;

    elementos.botonAgregar.onclick = callback;

}

// ======================================================
// Inicializa los eventos del modal.
// ======================================================

export function inicializarModalProducto() {

    if (!elementos.overlay) return;

    // ------------------------------
    // Botón cerrar
    // ------------------------------

    elementos.botonCerrar.addEventListener(
        "click",
        cerrarModalProducto
    );

    // ------------------------------
    // Click fuera del modal
    // ------------------------------

    elementos.overlay.addEventListener(
        "click",
        (event) => {

            if (event.target === elementos.overlay) {

                cerrarModalProducto();

            }

        }
    );

    // ------------------------------
    // Tecla ESC
    // ------------------------------

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                elementos.overlay.classList.contains("visible")
            ) {

                cerrarModalProducto();

            }

        }
    );

}