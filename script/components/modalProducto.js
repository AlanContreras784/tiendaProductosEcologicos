// ======================================================
// modalProducto.js
//
// Componente reutilizable para mostrar el detalle
// de un producto dentro de un modal.
//
// Responsabilidades:
// - Abrir el modal.
// - Cargar la información del producto.
// - Cerrar el modal.
// - Controlar cierre mediante botón.
// - Controlar cierre haciendo click fuera.
// - Controlar cierre mediante tecla ESC.
// - Devolver el producto actualmente mostrado.
// - Configurar la acción "Agregar al carrito".
//
// No contiene:
// - fetch.
// - lógica JWT.
// - comunicación directa con la API.
// ======================================================

// ======================================================
// Estado interno del componente
// ======================================================
let productoActual = null;
// ======================================================
// Elementos del DOM
// ======================================================
const elementos = {
    overlay: document.getElementById("overlayModal"),
    imagen: document.getElementById("modalImagen"),
    categoria: document.getElementById("modalCategoria"),
    titulo: document.getElementById("modalTitulo"),
    descripcion: document.getElementById("modalDescripcion"),
    stock: document.getElementById("modalStock"),
    precio: document.getElementById("modalPrecio"),
    botonAgregar: document.getElementById("modalAgregar"),
    botonCerrar: document.getElementById("btnCerrarModal")
};
// ======================================================
// Abre el modal cargando la información del producto.
// ======================================================
export function abrirModalProducto(producto) {
    if (!producto || !elementos.overlay) {
        return;
    }
    // Guardamos el producto actualmente mostrado.
    productoActual = producto;
    // ------------------------------
    // Imagen
    // ------------------------------
    if (elementos.imagen) {
        elementos.imagen.src =
            producto.imagenUrl || "";
        elementos.imagen.alt =
            producto.nombre || "Producto";
    }
    // ------------------------------
    // Categoría
    // ------------------------------
    if (elementos.categoria) {
        elementos.categoria.textContent =
            producto.categoria?.nombre ?? "";
    }
    // ------------------------------
    // Nombre
    // ------------------------------
    if (elementos.titulo) {
        elementos.titulo.textContent =
            producto.nombre ?? "";
    }
    // ------------------------------
    // Descripción
    // ------------------------------
    if (elementos.descripcion) {
        elementos.descripcion.textContent =
            producto.descripcion ?? "Sin descripción disponible.";
    }
    // ------------------------------
    // Stock
    // ------------------------------
    if (elementos.stock) {
        elementos.stock.textContent =
            `${producto.stock ?? 0} unidades`;
    }
    // ------------------------------
    // Precio
    // ------------------------------
    if (elementos.precio) {
        elementos.precio.textContent =
            `$${Number(producto.precio ?? 0).toFixed(2)}`;
    }
    // ------------------------------
    // Mostrar modal
    // ------------------------------
    elementos.overlay.classList.add("visible");
    elementos.overlay.setAttribute("aria-hidden", "false");
    // Evita que la página continúe desplazándose
    // mientras el modal está abierto.
    document.body.classList.add("modal-abierto");
}
// ======================================================
// Cierra el modal.
// ======================================================
export function cerrarModalProducto() {
    if (!elementos.overlay) {
        return;
    }
    elementos.overlay.classList.remove("visible");
    elementos.overlay.setAttribute("aria-hidden", "true");
    // Permite nuevamente el scroll de la página.
    document.body.classList.remove("modal-abierto");
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
    if (!elementos.botonAgregar) {
        return;
    }
    elementos.botonAgregar.onclick = async () => {
        if (!productoActual) {
            return;
        }
        await callback(productoActual);
    };
}
// ======================================================
// Inicializa los eventos del modal.
// ======================================================
export function inicializarModalProducto() {
    if (!elementos.overlay) {
        return;
    }
    // ------------------------------
    // Botón cerrar
    // ------------------------------
    if (elementos.botonCerrar) {
        elementos.botonCerrar.addEventListener(
            "click",
            cerrarModalProducto
        );
    }
    // ------------------------------
    // Click fuera del modal
    // ------------------------------
    elementos.overlay.addEventListener("click",
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
            if (event.key === "Escape" && elementos.overlay.classList.contains("visible")) {
                cerrarModalProducto();
            }
        }
    );
}