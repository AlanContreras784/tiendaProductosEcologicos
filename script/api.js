// ======================================================
// api.js
// Centraliza todas las llamadas al backend Spring Boot + JWT
// ======================================================

const API_URL = "http://localhost:8080";

// ======================================================
// PETICIÓN GENERAL
// ======================================================
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };
    // Si existe token lo enviamos al backend
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    // Integración con JWT: si había un token y el backend lo rechazó
    // (vencido, inválido o sin permisos), cerramos la sesión acá mismo,
    // en un único lugar, para que ningún llamador tenga que repetir
    // esta lógica en cada página.
    if (response.status === 401 || response.status === 403) {
        manejarSesionExpirada(token);
    }

    if (!response.ok) {
        let mensaje = "Error al comunicarse con el servidor.";
        try {
            const data = await response.json();
            mensaje = data.message || data.error || mensaje;
        } catch {
            mensaje = await response.text();
        }
        const error = new Error(mensaje);
        error.status = response.status;
        throw error;
    }
    if (response.status === 204) {
        return null;
    }
    return await response.json();
}

/**
 * Si HABÍA un token guardado y el backend respondió 401/403,
 * lo tratamos como sesión vencida/inválida: limpiamos todo lo
 * relacionado a la sesión y redirigimos a login con un aviso.
 *
 * Si NO había token, no hacemos nada acá: dejamos que el
 * llamador decida (por ejemplo, tienda.js ya evita llamar a
 * agregarProducto si el usuario no iba a estar logueado).
 *
 * Depende de rutaLogin() y mostrarToast(), definidas en
 * navbar.js y toast.js respectivamente. Por eso navbar.js debe
 * estar incluido en TODAS las páginas que usan api.js.
 */
function manejarSesionExpirada(tokenPrevio) {
    if (!tokenPrevio) return;

    localStorage.removeItem("token");
    localStorage.removeItem("carritoId");

    if (typeof mostrarToast === "function") {
        mostrarToast("Tu sesión expiró. Volvé a iniciar sesión.");
    }

    const destino = typeof rutaLogin === "function" ? rutaLogin() : "login.html";
    setTimeout(() => {
        window.location.href = destino;
    }, 1500);
}

// ======================================================
// AUTENTICACIÓN JWT
// ======================================================
async function login(username, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            username,
            password
        })
    });
    localStorage.setItem("token", data.token);
    return data;
}

async function registrarUsuario(usuario) {
    const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(usuario)
    });
    localStorage.setItem("token", data.token);
    return data;
}

// NOTA: usuarioLogueado() y cerrarSesion() se movieron a navbar.js,
// que es quien decide la ruta correcta de login según la página
// (raíz vs /pages/). Cargá siempre navbar.js junto con api.js.

// ======================================================
// PRODUCTOS
// ======================================================
async function obtenerProductos() {
    return await apiFetch("/productos");
}
async function crearProducto(producto) {
    return await apiFetch("/productos", {
        method: "POST",
        body: JSON.stringify(producto)
    });
}
async function editarProducto(id, producto) {
    return await apiFetch(`/productos/${id}`, {
        method: "PUT",
        body: JSON.stringify(producto)
    });
}
async function eliminarProducto(id) {
    return await apiFetch(`/productos/${id}`, {
        method: "DELETE"
    });
}

// ======================================================
// CARRITO
// ======================================================
async function crearCarrito() {
    return await apiFetch("/carritos", {
        method: "POST"
    });
}
async function obtenerCarrito(carritoId) {
    return await apiFetch(`/carritos/${carritoId}`);
}
async function agregarProducto(carritoId, productoId) {
    return await apiFetch(
        `/carritos/${carritoId}/productos/${productoId}`,
        {
            method: "POST"
        }
    );
}
async function descontarProducto(carritoId, productoId) {
    return await apiFetch(
        `/carritos/${carritoId}/productos/${productoId}/descontar`,
        {
            method: "PUT"
        }
    );
}
async function eliminarProductoCarrito(carritoId, productoId) {
    return await apiFetch(
        `/carritos/${carritoId}/productos/${productoId}`,
        {
            method: "DELETE"
        }
    );
}
async function vaciarCarrito(carritoId) {
    return await apiFetch(
        `/carritos/${carritoId}/vaciar`,
        {
            method: "DELETE"
        }
    );
}

// ======================================================
// UTILIDADES CARRITO
// ======================================================
async function obtenerCarritoId() {
    let carritoId = localStorage.getItem("carritoId");
    if (carritoId) {
        try {
            await obtenerCarrito(carritoId);
            return carritoId;
        } catch (error) {
            if (error.status === 404) {
                localStorage.removeItem("carritoId");
            } else {
                throw error;
            }
        }
    }
    const carrito = await crearCarrito();
    localStorage.setItem(
        "carritoId",
        carrito.id
    );
    return carrito.id;
}

async function obtenerResumenCarrito(carritoId) {
    return await apiFetch(
        `/carritos/${carritoId}/resumen`
    );
}

// NOTA: actualizarBadge()/cargarBadgeCarrito() se movieron a
// navbar.js como actualizarBadgesCarrito()/cargarBadgeNavbar(),
// que además sincronizan el badge en desktop y mobile a la vez.