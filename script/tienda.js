// =======================================================
// tienda.js
// Maneja toda la lógica de la tienda
// Utiliza api.js para comunicarse con Spring Boot
// =======================================================

class Tienda {
    constructor() {
        this.contenedor = document.querySelector(".productos-container");
        this.productos = [];
    }

    /**
     * Inicializa la tienda.
     */
    async iniciar() {
        try {
            // asegura que exista un carrito
            await obtenerCarritoId();
            // obtiene productos desde Spring
            this.productos = await obtenerProductos();
            // dibuja las cards
            this.renderizarProductos();
            // agrega eventos
            this.adjuntarEventos();
        }
        catch (error) {
            console.error(error);
            this.contenedor.innerHTML =
            `<h2>Error al cargar productos.</h2>`;
        }
    }

    /**
     * Dibuja todas las cards.
     */
    renderizarProductos() {
        const html = this.productos.map(producto => `
            <div class="producto">
                <img src="${producto.imagenUrl}" alt="${producto.nombre}">
                <div class="producto-descripcion">
                    <span>${producto.categoria.nombre}</span>
                    <h5> ${producto.nombre} </h5>
                    <h4> $${producto.precio.toFixed(2)} </h4>
                </div>
                <a class="ver-descripcion" id="btn-ver-${producto.id}"> Ver descripción
                </a>
                <a class="carrito" id="btn-agregar-${producto.id}">
                    <i class="fal fa-shopping-cart"></i> Agregar
                </a>
            </div>
        `).join("");
        this.contenedor.innerHTML = html;
    }
        /**
     * Asigna los eventos a los botones.
     */
    adjuntarEventos() {
        this.productos.forEach(producto => {
            // Botón Agregar
            const btnAgregar =
                document.getElementById(`btn-agregar-${producto.id}`);
            if (btnAgregar) {
                btnAgregar.addEventListener("click", () => {
                    this.agregarAlCarrito(producto);
                });
            }
            // Botón Ver descripción
            const btnVer =
                document.getElementById(`btn-ver-${producto.id}`);
            if (btnVer) {
                btnVer.addEventListener("click", () => {
                    this.abrirModal(producto);
                });
            }
        });
    }

    /**
     * Agrega un producto al carrito.
     */
    async agregarAlCarrito(producto) {
        try {
            const carritoId = await obtenerCarritoId();
            await agregarProducto(carritoId, producto.id);
            await cargarBadgeCarrito();
            mostrarToast(`${producto.nombre} agregado al carrito.`);
        } catch (error) {
            console.error(error);
            mostrarToast(error.message);
        }
    }

    /**
     * Muestra el modal.
     */
    abrirModal(producto) {
        document.getElementById("modalImagen").src = producto.imagenUrl;
        document.getElementById("modalImagen").alt = producto.nombre;
        document.getElementById("modalTitulo").textContent = producto.nombre;
        document.getElementById("modalDescripcion").textContent = producto.descripcion;
        document.getElementById("modalPrecio").textContent = `$${producto.precio.toFixed(2)}`;
        document.getElementById("overlayModal").classList.add("visible");
    }
    /**
     * Oculta el modal.
     */
    cerrarModal() {
        document.getElementById("overlayModal").classList.remove("visible");
    }
} // ===== Fin de la clase Tienda =====


// ======================================================
// Inicialización de la aplicación
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {
    await cargarBadgeCarrito();
    const tienda = new Tienda();
    await tienda.iniciar();

    // Botón cerrar
    document.getElementById("btnCerrarModal").addEventListener("click", () => {
            tienda.cerrarModal();
        });

    // Cerrar haciendo click fuera del modal
    document.getElementById("overlayModal").addEventListener("click", (e) => {
            if (e.target.id === "overlayModal") {
                tienda.cerrarModal();
            }
        });
});