document.addEventListener('DOMContentLoaded', () =>{
    const botonesAgregar = document.querySelectorAll('.carrito');

    botonesAgregar.forEach((boton,indice)=>{
        boton.addEventListener('click',(e)=>{
            e.preventDefault();
            const nombre = boton.dataset.nombre;
            const precio = parseFloat(boton.dataset.precio);
            const imagenUrl = boton.dataset.imagenUrl;
            const id = `home-${indice}`;

           // agregarAlCarrito({id,nombre,precio,imagenUrl});

        })
    })
} )

// function agregarAlCarrito(producto) {
//     let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

//     const indiceExistente = carrito.findIndex(item => item.id === producto.id);

//     if (indiceExistente !== -1) {
//         carrito[indiceExistente].cantidad++;
//     } else {
//         carrito.push({
//             id: producto.id,
//             nombre: producto.nombre,
//             precio: producto.precio,
//             imagenUrl: producto.imagenUrl,
//             cantidad: 1
//         });
//     }

//     localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
//     mostrarToast(`${producto.nombre} agregado al carrito!`);
// }

