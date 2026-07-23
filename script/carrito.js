// ======================================================
// carrito.js
// Maneja toda la lógica del carrito
// ======================================================

class Carrito {
    constructor() {
        this.tabla = document.querySelector("#tabla_carrito");
        this.productos = [];
        this.carritoId = null;
    }

    /**
     * Inicializa el carrito.
     */
    async iniciar() {
        try {
            this.carritoId = await obtenerCarritoId();
            await this.cargar();
        }
        catch (error) {
            console.error(error);
            this.tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:30px;">
                    Error al cargar el carrito.
                </td>
            </tr>
        `;
        }
    }

    /**
     * Obtiene el carrito desde Spring Boot.
     */
    async cargar() {
        const carrito = await obtenerCarrito(this.carritoId);
        this.productos = carrito.productos;
        await this.renderizar();
        const resumen = await obtenerResumenCarrito(this.carritoId);
        actualizarResumen(resumen);
    }
    /**
     * Dibuja el carrito.
     */
    
    async renderizar() {
        this.tabla.innerHTML = "";
        if (this.productos.length === 0) {
            this.tabla.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:30px;">
                        Tu carrito está vacío.
                    </td>
                </tr>`;
        } else {
            this.productos.forEach(cp => {
                this.tabla.innerHTML += this.crearFila(cp);
            });
        }
        this.eventos();
    }

    /**
 * Crea una fila de la tabla.
 */
    crearFila(cp) {
        const producto = cp.producto;
        const subtotal = (producto.precio * cp.cantidad).toFixed(2);
        return `
            <tr>
                <td>
                    <button class="remove-btn" data-id="${producto.id}">
                        <i class="far fa-times-circle"></i>
                    </button>
                </td>
                <td>
                    <img src="${producto.imagenUrl}" alt="${producto.nombre}" style="height:80px; width:auto; object-fit:contain;">
                </td>
                <td> ${producto.nombre} </td>
                <td> $${producto.precio.toFixed(2)} </td>
                <td>
                    <button class="btn-restar" data-id="${producto.id}"> - </button>
                    <span style="padding:0 15px;"> ${cp.cantidad} </span>
                    <button class="btn-sumar" data-id="${producto.id}"> + </button>
                </td>
                <td> $${subtotal} </td>
            </tr>
        `;
    }

    /**
 * Actualiza el resumen y el badge.
 */
    async actualizarVista() {
        const resumen = await obtenerResumenCarrito(this.carritoId);
        actualizarResumen(resumen);
    }

    /**
     * Asigna los eventos de los botones.
     */
    eventos() {
        // =====================
        // Botón +
        // =====================
        document.querySelectorAll(".btn-sumar").forEach(boton => {
            boton.onclick = () => {
                this.sumar(
                    Number(boton.dataset.id)
                );
            };
        });
        // =====================
        // Botón -
        // =====================
        document.querySelectorAll(".btn-restar").forEach(boton => {
            boton.onclick = () => {
                this.restar(
                    Number(boton.dataset.id)
                );
            };
        });
        // =====================
        // Botón Eliminar
        // =====================
        document.querySelectorAll(".remove-btn").forEach(boton => {
            boton.onclick = () => {
                this.eliminar(
                    Number(boton.dataset.id)
                );
            };
        });
    }


    /**
 * Agrega una unidad al producto.
 */
    async sumar(productoId) {
        try {
            await agregarProducto(this.carritoId, productoId);
            const item = this.productos.find(p => p.producto.id === productoId);
            if (item) {
                item.cantidad += 1;
            } else {
                // Si no existe, lo agregamos como nuevo
                this.productos.push({
                    producto: { id: productoId },
                    cantidad: 1
                });
            }
           await  this.renderizar();
           await this.actualizarVista();
        }
        catch (error) {
            console.error(error);
            //alert(error.message);
            mostrarToast(error.message);
        }
    }

    /**
     * Resta una unidad al producto.
     */
    async restar(productoId) {
        try {
            await descontarProducto(this.carritoId, productoId);
            const index = this.productos.findIndex(
                p => p.producto.id === productoId
            );
            if (index !== -1) {
                this.productos[index].cantidad -= 1;
                if (this.productos[index].cantidad <= 0) {
                    this.productos.splice(index, 1);
                }
            }
            await  this.renderizar();
            await this.actualizarVista();
        }
        catch (error) {
            console.error(error);
            mostrarToast(error.message);
        }
    }
    /**
     * Elimina completamente el producto del carrito.
     */
    async eliminar(productoId) {
        //const confirmar = confirm("¿Desea eliminar este producto?");
        const confirmar = await modalConfirm("¿Desea eliminar este producto?");
        if (!confirmar) return;
        try {
            await eliminarProducto(this.carritoId, productoId);
            this.productos = this.productos.filter(
                p => p.producto.id !== productoId
            );
            await  this.renderizar();
            await this.actualizarVista();
        }
        catch (error) {
            console.error(error);
            mostrarToast(error.message);
        }
    }
    /**
     * Vacía completamente el carrito.
     */
    async vaciar() {
        //const confirmar = confirm("¿Desea vaciar el carrito?");
        const confirmar = await modalConfirm("¿Desea vaciar el carrito?");
        if (!confirmar) return;
        try {
            await vaciarCarrito(this.carritoId);
            this.productos = [];
            await  this.renderizar();
            await this.actualizarVista();
        }
        catch (error) {
            console.error(error);
            mostrarToast(error.message);
        }
    }

} // ===== Fin de la clase Carrito =====

//|====================================================
//| Función para actualizar el resumen del carrito
//|====================================================
function actualizarResumen(resumen) {
    document.querySelectorAll("#total").forEach(elemento => {
        elemento.textContent = `$${resumen.total.toFixed(2)}`;
    });
    actualizarBadge(resumen.cantidadProductos);
}

// ======================================================
// Inicialización
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {
    await cargarBadgeCarrito();
    const carrito = new Carrito();
    await carrito.iniciar();
    // Botón Vaciar carrito (si existe)
    const btnVaciar = document.getElementById("btn-vaciar");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            carrito.vaciar();
        });
    }
    
});