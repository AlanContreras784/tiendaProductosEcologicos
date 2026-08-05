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


