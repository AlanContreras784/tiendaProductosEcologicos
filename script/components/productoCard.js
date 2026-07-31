// ======================================================
// productoCard.js
// Card reutilizable respetando diseño original.
// ======================================================

export function crearProductoCard(producto) {

    return `

    <article class="producto">

        <figure>
            <img
                src="${producto.imagenUrl}"
                alt="${producto.nombre}">
        </figure>


        <div class="producto-descripcion">

            <span>
                ${producto.categoria?.nombre ?? "Sin categoría"}
            </span>


            <h5>
                ${producto.nombre}
            </h5>


            <h4>
                $${producto.precio.toFixed(2)}
            </h4>

        </div>


        <footer>

            <button
                class="ver-descripcion btn-detalle"
                data-id="${producto.id}">
                
                Ver descripción

            </button>


            <button
                class="carrito btn-agregar"
                data-id="${producto.id}">
                
                <i class="fa-solid fa-cart-shopping"></i>
                Agregar

            </button>


        </footer>


    </article>

    `;
}