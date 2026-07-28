// =======================================================
// tienda.js
// Maneja toda la lógica de la tienda:
// - Renderizado semántico de productos
// - Buscador por nombre
// - Filtro por categoría
// - Ordenamiento
// - Paginación
// Utiliza api.js para comunicarse con Spring Boot
// =======================================================

class Tienda {
    constructor() {
        this.contenedor = document.querySelector(".productos-container");

        this.productos = [];          // todos los productos originales (del backend)
        this.productosFiltrados = []; // resultado luego de buscar/filtrar/ordenar

        // Estado de la UI
        this.terminoBusqueda = "";
        this.categoriaActual = "";
        this.ordenActual = "";
        this.paginaActual = 1;
        this.productosPorPagina = 8;
    }

    /**
     * Inicializa la tienda: carga productos, arma el toolbar
     * (buscador + filtro + orden) y renderiza la primera página.
     */
    async iniciar() {
        try {
            // No pedimos/creamos el carrito acá: eso requiere sesión
            // iniciada en el backend, y browsear la tienda no debería
            // exigir login. El carrito se obtiene recién al agregar
            // un producto (ver agregarAlCarrito), cuando ya sabemos
            // que el usuario está logueado.
            this.productos = await obtenerProductos();
            this.renderizarToolbar();
            this.aplicarFiltros();
        } catch (error) {
            console.error(error);
            this.contenedor.innerHTML =
                `<p class="mensaje-error">Error al cargar productos.</p>`;
        }
    }

    // ===================================================
    // TOOLBAR: buscador + filtro por categoría + orden
    // ===================================================

    /**
     * Extrae las categorías únicas presentes en los productos.
     */
    obtenerCategorias() {
        const categorias = this.productos
            .map(producto => producto.categoria?.nombre)
            .filter(Boolean);
        return [...new Set(categorias)].sort();
    }

    /**
     * Inserta el toolbar antes del contenedor de productos
     * y conecta los eventos de búsqueda, filtro y orden.
     */
    renderizarToolbar() {
        const opcionesCategoria = this.obtenerCategorias()
            .map(categoria => `<option value="${categoria}">${categoria}</option>`)
            .join("");

        const toolbarHTML = `
            <div class="tienda-toolbar">
                <input
                    type="search"
                    id="buscadorProductos"
                    placeholder="Buscar producto por nombre..."
                    aria-label="Buscar producto por nombre"
                >
                <select id="filtroCategoria" aria-label="Filtrar por categoría">
                    <option value="">Todas las categorías</option>
                    ${opcionesCategoria}
                </select>
                <select id="ordenProductos" aria-label="Ordenar productos">
                    <option value="">Ordenar por</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="nombre-asc">Nombre: A-Z</option>
                    <option value="nombre-desc">Nombre: Z-A</option>
                </select>
            </div>
        `;

        this.contenedor.insertAdjacentHTML("beforebegin", toolbarHTML);

        document.getElementById("buscadorProductos")
            .addEventListener("input", (e) => {
                this.terminoBusqueda = e.target.value.trim().toLowerCase();
                this.paginaActual = 1;
                this.aplicarFiltros();
            });

        document.getElementById("filtroCategoria")
            .addEventListener("change", (e) => {
                this.categoriaActual = e.target.value;
                this.paginaActual = 1;
                this.aplicarFiltros();
            });

        document.getElementById("ordenProductos")
            .addEventListener("change", (e) => {
                this.ordenActual = e.target.value;
                this.aplicarFiltros();
            });
    }

    // ===================================================
    // BÚSQUEDA, FILTRO Y ORDEN
    // ===================================================

    /**
     * Aplica búsqueda + filtro + orden sobre this.productos
     * y dispara el renderizado de la página actual.
     */
    aplicarFiltros() {
        let resultado = [...this.productos];

        if (this.terminoBusqueda) {
            resultado = resultado.filter(producto =>
                producto.nombre.toLowerCase().includes(this.terminoBusqueda)
            );
        }

        if (this.categoriaActual) {
            resultado = resultado.filter(producto =>
                producto.categoria?.nombre === this.categoriaActual
            );
        }

        resultado = this.ordenarProductos(resultado);

        this.productosFiltrados = resultado;
        this.renderizarPagina();
    }

    ordenarProductos(lista) {
        switch (this.ordenActual) {
            case "precio-asc":
                return lista.sort((a, b) => a.precio - b.precio);
            case "precio-desc":
                return lista.sort((a, b) => b.precio - a.precio);
            case "nombre-asc":
                return lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
            case "nombre-desc":
                return lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
            default:
                return lista;
        }
    }

    // ===================================================
    // PAGINACIÓN
    // ===================================================

    obtenerTotalPaginas() {
        return Math.max(
            1,
            Math.ceil(this.productosFiltrados.length / this.productosPorPagina)
        );
    }

    obtenerProductosDePagina() {
        const inicio = (this.paginaActual - 1) * this.productosPorPagina;
        return this.productosFiltrados.slice(inicio, inicio + this.productosPorPagina);
    }

    /**
     * Renderiza los productos de la página actual y la barra de paginación.
     */
    renderizarPagina() {
        this.renderizarProductos(this.obtenerProductosDePagina());
        this.renderizarPaginacion();
    }

    renderizarPaginacion() {
        const existente = document.querySelector(".tienda-paginacion");
        if (existente) existente.remove();

        if (this.productosFiltrados.length === 0) return;

        const totalPaginas = this.obtenerTotalPaginas();

        let botones = "";
        for (let i = 1; i <= totalPaginas; i++) {
            botones += `
                <button
                    class="pagina-btn ${i === this.paginaActual ? "activa" : ""}"
                    data-pagina="${i}"
                >${i}</button>
            `;
        }

        const paginacionHTML = `
            <nav class="tienda-paginacion" aria-label="Paginación de productos">
                <button id="paginaAnterior" ${this.paginaActual === 1 ? "disabled" : ""}>
                    ‹ Anterior
                </button>
                ${botones}
                <button id="paginaSiguiente" ${this.paginaActual === totalPaginas ? "disabled" : ""}>
                    Siguiente ›
                </button>
            </nav>
        `;

        this.contenedor.insertAdjacentHTML("afterend", paginacionHTML);

        document.getElementById("paginaAnterior")
            .addEventListener("click", () => this.cambiarPagina(this.paginaActual - 1));

        document.getElementById("paginaSiguiente")
            .addEventListener("click", () => this.cambiarPagina(this.paginaActual + 1));

        document.querySelectorAll(".pagina-btn").forEach(boton => {
            boton.addEventListener("click", () =>
                this.cambiarPagina(Number(boton.dataset.pagina))
            );
        });
    }

    cambiarPagina(numero) {
        const totalPaginas = this.obtenerTotalPaginas();
        if (numero < 1 || numero > totalPaginas) return;

        this.paginaActual = numero;
        this.renderizarPagina();
        this.contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // ===================================================
    // RENDERIZADO SEMÁNTICO DE PRODUCTOS
    // ===================================================

    /**
     * Dibuja las cards de la lista recibida usando
     * article/figure/figcaption/footer.
     */
    renderizarProductos(lista) {
        if (lista.length === 0) {
            this.contenedor.innerHTML =
                `<p class="mensaje-vacio">No se encontraron productos.</p>`;
            return;
        }

        const html = lista.map(producto => `
            <article class="producto" data-id="${producto.id}">
                <figure>
                    <img src="${producto.imagenUrl}" alt="${producto.nombre}">
                    <figcaption class="producto-descripcion">
                        <span>${producto.categoria?.nombre ?? ""}</span>
                        <h5>${producto.nombre}</h5>
                        <h4>$${producto.precio.toFixed(2)}</h4>
                    </figcaption>
                </figure>
                <footer>
                    <a class="ver-descripcion" id="btn-ver-${producto.id}">
                        Ver descripción
                    </a>
                    <a class="carrito" id="btn-agregar-${producto.id}">
                        <i class="fal fa-shopping-cart"></i> Agregar
                    </a>
                </footer>
            </article>
        `).join("");

        this.contenedor.innerHTML = html;
        this.adjuntarEventos(lista);
    }

    /**
     * Asigna los eventos a los botones de la página actual.
     */
    adjuntarEventos(lista) {
        lista.forEach(producto => {
            const btnAgregar = document.getElementById(`btn-agregar-${producto.id}`);
            if (btnAgregar) {
                btnAgregar.addEventListener("click", () => {
                    this.agregarAlCarrito(producto);
                });
            }

            const btnVer = document.getElementById(`btn-ver-${producto.id}`);
            if (btnVer) {
                btnVer.addEventListener("click", () => {
                    this.abrirModal(producto);
                });
            }
        });
    }

    // ===================================================
    // CARRITO (integrado con JWT vía api.js)
    // ===================================================

    /**
     * Agrega un producto al carrito. Si no hay sesión iniciada,
     * redirige a login en vez de intentar contra el backend.
     */
    async agregarAlCarrito(producto) {
        if (!usuarioLogueado()) {
            mostrarToast("Iniciá sesión para agregar productos al carrito.");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
            return;
        }

        try {
            const carritoId = await obtenerCarritoId();
            await agregarProducto(carritoId, producto.id);
            await cargarBadgeNavbar();
            mostrarToast(`${producto.nombre} agregado al carrito.`);
        } catch (error) {
            console.error(error);
            // Si era 401/403, apiFetch (api.js) ya se encargó de
            // limpiar el token y redirigir a login. Acá solo cubrimos
            // el resto de los errores (ej. producto sin stock).
            if (error.status !== 401 && error.status !== 403) {
                mostrarToast(error.message);
            }
        }
    }

    /**
     * Muestra el modal con el detalle del producto.
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


// =======================================================
// Inicialización de la aplicación
// =======================================================

document.addEventListener("DOMContentLoaded", async () => {
    await cargarBadgeNavbar();
    const tienda = new Tienda();
    await tienda.iniciar();

    // Botón cerrar modal
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