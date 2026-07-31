// ======================================================
// paginator.js
// Componente reutilizable de paginación.
// Puede utilizarse para productos, categorías, usuarios,
// pedidos o cualquier colección.
// ======================================================

export class Paginator {

    /**
     * @param {Object} options
     * @param {HTMLElement} options.container Contenedor del paginador.
     * @param {number} options.itemsPerPage Cantidad de elementos por página.
     * @param {Function} options.onPageChange Callback al cambiar de página.
     */
    constructor({
        container,
        itemsPerPage = 8,
        onPageChange
    }) {

        this.container = container;

        this.itemsPerPage = itemsPerPage;

        this.onPageChange = onPageChange;

        this.currentPage = 1;

        this.totalItems = 0;

    }

    /**
     * Establece la cantidad total de elementos.
     */
    setTotalItems(totalItems) {

        this.totalItems = totalItems;

        this.currentPage = 1;

        this.render();
           
        if (this.onPageChange) {

            this.onPageChange(
                this.startIndex,
                this.endIndex,
                this.currentPage
            );
        }

    }

    /**
     * Cantidad total de páginas.
     */
    get totalPages() {

        return Math.max(
            1,
            Math.ceil(this.totalItems / this.itemsPerPage)
        );

    }

    /**
     * Devuelve el índice inicial.
     */
    get startIndex() {

        return (this.currentPage - 1) * this.itemsPerPage;

    }

    /**
     * Devuelve el índice final.
     */
    get endIndex() {

        return this.startIndex + this.itemsPerPage;

    }

    /**
     * Cambia de página.
     */
    goToPage(page) {

        if (page < 1) return;

        if (page > this.totalPages) return;

        this.currentPage = page;

        this.render();

        this.onPageChange(
            this.startIndex,
            this.endIndex,
            this.currentPage
        );

    }

    /**
     * Dibuja el paginador.
     */
    render() {

        if (!this.container) return;

        this.container.innerHTML = "";

        const nav = document.createElement("nav");

        nav.className = "tienda-paginacion";

        nav.setAttribute(
            "aria-label",
            "Paginación"
        );

        // ===============================
        // Botón anterior
        // ===============================

        const anterior =
            this.crearBoton(
                "Anterior",
                this.currentPage - 1,
                this.currentPage === 1
            );

        nav.appendChild(anterior);

        // ===============================
        // Números
        // ===============================

        for (let i = 1; i <= this.totalPages; i++) {

            const boton =
                this.crearBoton(
                    i,
                    i,
                    false
                );

            if (i === this.currentPage) {

                boton.classList.add("activa");

                boton.setAttribute(
                    "aria-current",
                    "page"
                );

            }

            nav.appendChild(boton);

        }

        // ===============================
        // Botón siguiente
        // ===============================

        const siguiente =
            this.crearBoton(
                "Siguiente",
                this.currentPage + 1,
                this.currentPage === this.totalPages
            );

        nav.appendChild(siguiente);

        this.container.appendChild(nav);

    }

    /**
     * Crea un botón de paginación.
     */
    crearBoton(texto, pagina, disabled) {

        const button =
            document.createElement("button");

        button.textContent = texto;

        button.disabled = disabled;

        button.addEventListener("click", () => {

            this.goToPage(pagina);

        });

        return button;

    }

}