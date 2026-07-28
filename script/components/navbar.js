// ======================================================
// navbar.js
// Componente reutilizable del encabezado.
// Genera el menú según el usuario autenticado.
// ======================================================

import {
    estaAutenticado,
    usuarioActual,
    esAdministrador
} from "../utils/auth.js";

import {
    cerrarSesion
} from "../utils/storage.js";

import {
    obtenerResumen
} from "../api/carritoApi.js";

/**
 * Construye el navbar.
 */
export async function cargarNavbar() {

    const header = document.getElementById("header");

    if (!header) return;

    let cantidad = 0;

    // Solo consultamos el carrito si existe una sesión.
    if (estaAutenticado()) {

        try {

            const resumen = await obtenerResumen();

            cantidad = resumen.cantidadProductos;

        } catch (error) {

            console.error(error);

        }

    }

    header.innerHTML = `

<header class="navbar-principal">

    <nav class="navbar" aria-label="Navegación principal">

        <a href="index.html" class="logo">
            EcoProductos
        </a>

        <ul class="menu">

            <li>

                <a href="index.html">

                    Inicio

                </a>

            </li>

            <li>

                <a href="tienda.html">

                    Tienda

                </a>

            </li>

            <li>

                <a href="contacto.html">

                    Contacto

                </a>

            </li>

            ${
                esAdministrador()

                ?

                `<li>

                    <a href="admin.html">

                        Administración

                    </a>

                </li>`

                :

                ""
            }

        </ul>

        <form class="buscador">

            <input
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar productos">

        </form>

        <div class="acciones">

            <a href="carrito.html" class="btn-carrito">

                🛒

                <span id="badgeCarrito">

                    ${cantidad}

                </span>

            </a>

            ${
                estaAutenticado()

                ?

                `

                <span class="usuario">

                    Hola ${usuarioActual()}

                </span>

                <button id="btnLogout">

                    Cerrar sesión

                </button>

                `

                :

                `

                <a href="login.html">

                    Ingresar

                </a>

                <a href="registro.html">

                    Registrarse

                </a>

                `
            }

        </div>

    </nav>

</header>

`;

    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {

        btnLogout.addEventListener("click", () => {

            cerrarSesion();

            window.location.href = "index.html";

        });

    }

}