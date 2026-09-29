// ======================================================
// checkout.js
// Controlador de la página de checkout.
//
// Responsabilidades:
// - Cargar el carrito del usuario.
// - Mostrar productos del carrito.
// - Mostrar cantidades y precios.
// - Mostrar subtotal, envío y total.
// - Validar datos de envío.
// - Gestionar navegación del checkout.
//
// No contiene:
// - fetch directo.
// - lógica JWT.
// - comunicación HTTP directa.
// ======================================================

import {
    obtenerCarrito,
    obtenerResumen
} from "../api/carritoApi.js";

import {
    mostrarToast
} from "../components/toast.js";

import {
    mostrarSpinner,
    ocultarSpinner
} from "../components/spinner.js";

import {
    esCampoVacio,
    esEmailValido,
    esTextoValido,
    mostrarError,
    limpiarError
} from "../utils/validator.js";

// ======================================================
// Estado interno
// ======================================================

let carrito = null;
let resumen = null;

// ======================================================
// Elementos DOM
// ======================================================

const elementos = {
    formulario:
        document.getElementById("checkoutForm"),

    productos:
        document.getElementById("checkoutProductos"),

    subtotal:
        document.getElementById("checkoutSubtotal"),

    envio:
        document.getElementById("checkoutEnvio"),

    total:
        document.getElementById("checkoutTotal"),

    botonContinuar:
        document.getElementById("btnContinuarPago"),

    botonVolverCarrito:
        document.getElementById("btnVolverCarrito"),

    botonVolverTienda:
        document.getElementById("btnVolverTienda")
};

// ======================================================
// Inicialización
// ======================================================

async function iniciarCheckout() {
    try {
        mostrarSpinner();

        await cargarDatosCheckout();

        inicializarEventos();

    } catch (error) {

        console.error(error);

        mostrarToast(
            "No se pudo cargar el checkout."
        );

    } finally {

        ocultarSpinner();
    }
}

// ======================================================
// Carga los datos necesarios para el checkout.
// ======================================================

async function cargarDatosCheckout() {

    carrito = await obtenerCarrito();

    resumen = await obtenerResumen();

    renderizarProductos();

    renderizarResumen();
}

// ======================================================
// Renderiza los productos del carrito.
// ======================================================

function renderizarProductos() {

    const contenedor =
        elementos.productos;

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (
        !carrito ||
        !carrito.productos ||
        carrito.productos.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="checkout-vacio">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>No hay productos en el carrito.</p>
            </div>
        `;

        return;
    }

    carrito.productos.forEach(
        function (item) {

            const producto =
                item.producto;

            const cantidad =
                Number(item.cantidad);

            const precio =
                Number(producto.precio);

            const subtotal =
                cantidad * precio;

            contenedor.insertAdjacentHTML(
                "beforeend",
                crearProductoCheckout(
                    producto,
                    cantidad,
                    subtotal
                )
            );
        }
    );
}

// ======================================================
// Crea el HTML de un producto del checkout.
// ======================================================

function crearProductoCheckout(
    producto,
    cantidad,
    subtotal
) {

    return `
        <div class="checkout-producto">

            <img
                src="${producto.imagenUrl}"
                alt="${producto.nombre}"
            >

            <div class="checkout-producto-info">

                <h4>
                    ${producto.nombre}
                </h4>

                <p>
                    Cantidad: ${cantidad}
                </p>

            </div>

            <div class="checkout-producto-precio">

                $${subtotal.toFixed(2)}

            </div>

        </div>
    `;
}

// ======================================================
// Renderiza el resumen económico del carrito.
// ======================================================

function renderizarResumen() {

    if (!resumen) {
        return;
    }

    const subtotal =
        Number(resumen.subtotal);

    const envio =
        Number(resumen.envio);

    const total =
        Number(resumen.total);

    elementos.subtotal.textContent =
        `$${subtotal.toFixed(2)}`;

    elementos.envio.textContent =
        `$${envio.toFixed(2)}`;

    elementos.total.textContent =
        `$${total.toFixed(2)}`;
}

// ======================================================
// Inicializa los eventos del checkout.
// ======================================================

function inicializarEventos() {

    if (elementos.formulario) {

        elementos.formulario.addEventListener(
            "submit",
            manejarEnvioFormulario
        );
    }

    if (elementos.botonContinuar) {

        elementos.botonContinuar.addEventListener(
            "click",
            continuarAlPago
        );
    }

    if (elementos.botonVolverCarrito) {

        elementos.botonVolverCarrito.addEventListener(
            "click",
            volverAlCarrito
        );
    }

    if (elementos.botonVolverTienda) {

        elementos.botonVolverTienda.addEventListener(
            "click",
            volverATienda
        );
    }

    inicializarValidacionCampos();
}

// ======================================================
// Inicializa la limpieza de errores al modificar campos.
// ======================================================

function inicializarValidacionCampos() {

    if (!elementos.formulario) {
        return;
    }

    const campos =
        elementos.formulario.querySelectorAll(
            "input"
        );

    campos.forEach(
        function (campo) {

            campo.addEventListener(
                "input",
                function () {

                    limpiarError(campo);
                }
            );
        }
    );
}

// ======================================================
// Maneja el envío del formulario.
// ======================================================

function manejarEnvioFormulario(event) {

    event.preventDefault();

    continuarAlPago();
}

// ======================================================
// Valida todos los datos de envío.
// ======================================================

function validarFormulario() {

    if (!elementos.formulario) {
        return false;
    }

    let formularioValido = true;

    const nombre =
        document.getElementById("nombre");

    const apellido =
        document.getElementById("apellido");

    const email =
        document.getElementById("email");

    const telefono =
        document.getElementById("telefono");

    const direccion =
        document.getElementById("direccion");

    const ciudad =
        document.getElementById("ciudad");

    const provincia =
        document.getElementById("provincia");

    const codigoPostal =
        document.getElementById("codigoPostal");

    // ==================================================
    // Nombre
    // ==================================================

    if (esCampoVacio(nombre.value)) {

        mostrarError(
            nombre,
            "Ingresá tu nombre."
        );

        formularioValido = false;

    } else if (
        !esTextoValido(nombre.value)
    ) {

        mostrarError(
            nombre,
            "Ingresá un nombre válido."
        );

        formularioValido = false;

    } else {

        limpiarError(nombre);
    }

    // ==================================================
    // Apellido
    // ==================================================

    if (esCampoVacio(apellido.value)) {

        mostrarError(
            apellido,
            "Ingresá tu apellido."
        );

        formularioValido = false;

    } else if (
        !esTextoValido(apellido.value)
    ) {

        mostrarError(
            apellido,
            "Ingresá un apellido válido."
        );

        formularioValido = false;

    } else {

        limpiarError(apellido);
    }

    // ==================================================
    // Email
    // ==================================================

    if (esCampoVacio(email.value)) {

        mostrarError(
            email,
            "Ingresá tu email."
        );

        formularioValido = false;

    } else if (
        !esEmailValido(email.value)
    ) {

        mostrarError(
            email,
            "Ingresá un email válido."
        );

        formularioValido = false;

    } else {

        limpiarError(email);
    }

    // ==================================================
    // Teléfono
    // ==================================================

    if (esCampoVacio(telefono.value)) {

        mostrarError(
            telefono,
            "Ingresá tu teléfono."
        );

        formularioValido = false;

    } else if (
        !validarTelefono(telefono.value)
    ) {

        mostrarError(
            telefono,
            "Ingresá un teléfono válido."
        );

        formularioValido = false;

    } else {

        limpiarError(telefono);
    }

    // ==================================================
    // Dirección
    // ==================================================

    if (esCampoVacio(direccion.value)) {

        mostrarError(
            direccion,
            "Ingresá tu dirección."
        );

        formularioValido = false;

    } else {

        limpiarError(direccion);
    }

    // ==================================================
    // Ciudad
    // ==================================================

    if (esCampoVacio(ciudad.value)) {

        mostrarError(
            ciudad,
            "Ingresá tu ciudad."
        );

        formularioValido = false;

    } else if (
        !esTextoValido(ciudad.value)
    ) {

        mostrarError(
            ciudad,
            "Ingresá una ciudad válida."
        );

        formularioValido = false;

    } else {

        limpiarError(ciudad);
    }

    // ==================================================
    // Provincia
    // ==================================================

    if (esCampoVacio(provincia.value)) {

        mostrarError(
            provincia,
            "Ingresá tu provincia."
        );

        formularioValido = false;

    } else if (
        !esTextoValido(provincia.value)
    ) {

        mostrarError(
            provincia,
            "Ingresá una provincia válida."
        );

        formularioValido = false;

    } else {

        limpiarError(provincia);
    }

    // ==================================================
    // Código postal
    // ==================================================

    if (esCampoVacio(codigoPostal.value)) {

        mostrarError(
            codigoPostal,
            "Ingresá tu código postal."
        );

        formularioValido = false;

    } else if (
        !validarCodigoPostal(
            codigoPostal.value
        )
    ) {

        mostrarError(
            codigoPostal,
            "Ingresá un código postal válido."
        );

        formularioValido = false;

    } else {

        limpiarError(codigoPostal);
    }

    return formularioValido;
}

// ======================================================
// Valida el formato del teléfono.
// ======================================================

function validarTelefono(telefono) {

    const telefonoLimpio =
        telefono
            .trim()
            .replace(/[\s()-]/g, "");

    return /^\+?\d{8,15}$/.test(
        telefonoLimpio
    );
}

// ======================================================
// Valida el formato del código postal.
// ======================================================

function validarCodigoPostal(codigoPostal) {

    const codigo =
        codigoPostal
            .trim()
            .toUpperCase();

    return /^[A-Z]?\d{4,8}[A-Z]{0,3}$/.test(
        codigo
    );
}

// ======================================================
// Continúa hacia el proceso de pago.
// ======================================================

function continuarAlPago() {

    if (!validarFormulario()) {

        mostrarToast(
            "Revisá los datos de envío."
        );

        return;
    }

    if (
        !carrito ||
        !carrito.productos ||
        carrito.productos.length === 0
    ) {

        mostrarToast(
            "El carrito está vacío."
        );

        return;
    }

    mostrarToast(
        "Datos validados correctamente."
    );

    console.log(
        "Datos de checkout validados."
    );
}

// ======================================================
// Vuelve a la página del carrito.
// ======================================================

function volverAlCarrito() {

    window.location.href =
        "carrito.html";
}

// ======================================================
// Vuelve a la tienda.
// ======================================================

function volverATienda() {

    window.location.href =
        "tienda.html";
}

// ======================================================
// Inicia la página cuando el DOM está disponible.
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarCheckout
);