
document.addEventListener('DOMContentLoaded', () => {
    // capturamos los elementos
    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const navbar = document.getElementById('navbar');
    

    // agregar la clase
    bar.addEventListener('click',()=>{
        navbar.classList.add('active');
    });

    // quitar la clase
    close.addEventListener('click',()=>{
        navbar.classList.remove('active');
    });


})