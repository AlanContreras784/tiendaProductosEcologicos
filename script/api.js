// // ======================================================
// // api.js
// // Centraliza todas las llamadas al backend Spring Boot
// // ======================================================

// const API_URL = "http://localhost:8080";
// /**
//  * Método genérico para realizar peticiones HTTP.
//  * Adjunta el status HTTP al Error para que quien llame
//  * pueda distinguir, por ejemplo, un 404 (no existe) de un 500 (error real).
//  */
// async function apiFetch(endpoint, options = {}) {
//     const response = await fetch(`${API_URL}${endpoint}`, {
//         headers: {
//             "Content-Type": "application/json"
//         },
//         ...options
//     });
//     if (!response.ok) {
//         const mensaje = await response.text();
//         const error = new Error(mensaje || "Error al comunicarse con el servidor.");
//         error.status = response.status;
//         throw error;
//     }
//     // Si la respuesta no tiene contenido (204 No Content)
//     if (response.status === 204) {
//         return null;
//     }
//     return await response.json();
// }

// //////////////////////////////////////////////////////////
// // PRODUCTOS
// //////////////////////////////////////////////////////////

// /**
//  * Obtiene todos los productos.
//  */
// async function obtenerProductos() {
//     return await apiFetch("/productos");
// }

// //////////////////////////////////////////////////////////
// // CARRITO
// //////////////////////////////////////////////////////////

// /**
//  * Crea un carrito nuevo.
//  */
// async function crearCarrito() {
//     return await apiFetch("/carritos", {
//         method: "POST"
//     });
// }
// /**
//  * Obtiene un carrito por id.
//  */
// async function obtenerCarrito(carritoId) {
//     return await apiFetch(`/carritos/${carritoId}`);
// }
// /**
//  * Agrega una unidad de un producto al carrito.
//  */
// async function agregarProducto(carritoId, productoId) {
//     return await apiFetch(
//         `/carritos/${carritoId}/productos/${productoId}`,
//         {
//             method: "POST"
//         }
//     );
// }
// /**
//  * Descuenta una unidad del carrito.
//  */
// async function descontarProducto(carritoId, productoId) {
//     return await apiFetch(
//         `/carritos/${carritoId}/productos/${productoId}/descontar`,
//         {
//             method: "PUT"
//         }
//     );
// }
// /**
//  * Elimina completamente un producto del carrito.
//  */
// async function eliminarProducto(carritoId, productoId) {
//     return await apiFetch(
//         `/carritos/${carritoId}/productos/${productoId}`,
//         {
//             method: "DELETE"
//         }
//     );
// }
// /**
//  * Vacía completamente el carrito.
//  */
// async function vaciarCarrito(carritoId) {
//     return await apiFetch(
//         `/carritos/${carritoId}/vaciar`,
//         {
//             method: "DELETE"
//         }
//     );
// }

// //////////////////////////////////////////////////////////
// // UTILIDADES
// //////////////////////////////////////////////////////////

// /**
//  * Devuelve el carrito guardado en localStorage.
//  * Si el carrito no existe (404), crea uno nuevo.
//  * Si la falla es otra (500, red caída, etc.), NO borra el carrito guardado:
//  * se informa el error real en vez de ocultarlo creando uno nuevo silenciosamente.
//  */
// async function obtenerCarritoId() {
//     let carritoId = localStorage.getItem("carritoId");
//     if (carritoId) {
//         try {
//             await obtenerCarrito(carritoId);
//             return carritoId;
//         } catch (error) {
//             if (error.status === 404) {
//                 console.warn("El carrito ya no existe. Se creará uno nuevo.");
//                 localStorage.removeItem("carritoId");
//             } else {
//                 // Error real del servidor (500) u otro problema: no lo ocultamos
//                 // recreando el carrito, porque el dato roto seguiría existiendo.
//                 console.error("Error al obtener el carrito:", error.message);
//                 throw error;
//             }
//         }
//     }

//     const carrito = await crearCarrito();
//     localStorage.setItem("carritoId", carrito.id);
//     return carrito.id;
// }

// //////////////////////////////////////////////////////////
// // ACTUALIZACIÓN DEL BADGE
// //////////////////////////////////////////////////////////

// function actualizarBadge(cantidad) {

//     const badge = document.getElementById("cart-badge");

//     if (!badge) return;

//     // Cantidad anterior
//     const cantidadAnterior = Number(badge.textContent || 0);

//     badge.textContent = cantidad;

//     badge.style.display =
//         cantidad > 0
//             ? "inline-block"
//             : "none";

//     // Solo animar si cambió la cantidad
//     if (cantidad !== cantidadAnterior) {

//         badge.classList.remove("badge-bounce");

//         // Reinicia la animación
//         void badge.offsetWidth;

//         badge.classList.add("badge-bounce");

//     }

// }

// //////////////////////////////////////////////////////////
// // BADGE DEL CARRITO
// //////////////////////////////////////////////////////////

// async function cargarBadgeCarrito() {
//     const badge = document.getElementById("cart-badge");
//     if (!badge) return;
//     const carritoId = localStorage.getItem("carritoId");
//     if (!carritoId) {
//         badge.style.display = "none";
//         return;
//     }
//     try {
//         const resumen = await obtenerResumenCarrito(carritoId);
//         badge.textContent = resumen.cantidadProductos;
//         badge.style.display =
//             resumen.cantidadProductos > 0
//                 ? "inline-block"
//                 : "none";
//     } catch (error) {
//         if (error.status === 404) {
//             // El carrito guardado ya no existe: limpiamos para que
//             // la próxima carga de la tienda cree uno nuevo.
//             localStorage.removeItem("carritoId");
//         } else {
//             console.error("Error al cargar el resumen del carrito:", error.message);
//         }
//         badge.style.display = "none";
//     }
// }



// //////////////////////////////////////////////////////////
// // OBTENER RESUMEN DEL CARRITO
// //////////////////////////////////////////////////////////

// async function obtenerResumenCarrito(carritoId) {
//     return await apiFetch(`/carritos/${carritoId}/resumen`);
// }


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
// =====================================================
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
function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
function usuarioLogueado() {
    return localStorage.getItem("token") !== null;
}
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
        method:"POST"
    });
}
async function obtenerCarrito(carritoId) {
    return await apiFetch(`/carritos/${carritoId}`);
}
async function agregarProducto(carritoId, productoId) {
    return await apiFetch(
        `/carritos/${carritoId}/productos/${productoId}`,
        {
            method:"POST"
        }
    );
}
async function descontarProducto(carritoId, productoId) {
    return await apiFetch(
        `/carritos/${carritoId}/productos/${productoId}/descontar`,
        {
            method:"PUT"
        }
    );
}
async function eliminarProductoCarrito(carritoId, productoId) {
    return await apiFetch(
        `/carritos/${carritoId}/productos/${productoId}`,
        {
            method:"DELETE"
        }
    );
}
async function vaciarCarrito(carritoId) {
    return await apiFetch(
        `/carritos/${carritoId}/vaciar`,
        {
            method:"DELETE"
        }
    );
}
// ======================================================
// UTILIDADES CARRITO
// ======================================================
async function obtenerCarritoId() {
    let carritoId = localStorage.getItem("carritoId");
    if(carritoId){
        try {
            await obtenerCarrito(carritoId);
            return carritoId;
        } catch(error){
            if(error.status === 404){
                localStorage.removeItem("carritoId");
            }else{
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

async function obtenerResumenCarrito(carritoId){
    return await apiFetch(
        `/carritos/${carritoId}/resumen`
    );
}

// ======================================================
// BADGE CARRITO
// ======================================================
function actualizarBadge(cantidad){
    const badge =
        document.getElementById("cart-badge");
    if(!badge) return;
    badge.textContent = cantidad;
    badge.style.display =
        cantidad > 0
        ? "inline-block"
        : "none";
}

async function cargarBadgeCarrito(){
    const badge =
        document.getElementById("cart-badge");

    if(!badge) return;
    const carritoId =
        localStorage.getItem("carritoId");
    if(!carritoId){
        badge.style.display="none";
        return;
    }
    try{
        const resumen =
            await obtenerResumenCarrito(carritoId);
        actualizarBadge(
            resumen.cantidadProductos
        );

    }catch(error){
        console.error(error.message);
    }
}