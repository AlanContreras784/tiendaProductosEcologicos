// ======================================================
// productoCard.js
// Componente reutilizable para representar un producto.
// ======================================================

/**
 * Genera el HTML de una tarjeta de producto.
 *
 * @param {Object} producto Producto recibido desde la API.
 * @returns {string} HTML de la tarjeta.
 */
export function crearProductoCard(producto) {

    return `

<article class="producto">

    <figure class="producto-imagen">

        <img
            src="${producto.imagenUrl}"
            alt="${producto.nombre}">

    </figure>

    <section class="producto-contenido">

        <span class="producto-categoria">

            ${producto.categoria.nombre}

        </span>

        <h3>

            ${producto.nombre}

        </h3>

        <p class="producto-precio">

            $${producto.precio.toFixed(2)}

        </p>

    </section>

    <footer class="producto-footer">

        <button
            class="btn-detalle"
            data-id="${producto.id}">

            Ver descripción

        </button>

        <button
            class="btn-agregar"
            data-id="${producto.id}">

            Agregar al carrito

        </button>

    </footer>

</article>

`;

}
