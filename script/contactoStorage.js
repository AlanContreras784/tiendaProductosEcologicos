

// --------------------------------------------- // 

// Paso 1 : Recuperar los datos de DOM
//referenciamos los campos del formulario

const campoNombre = document.getElementById('tuNombre');
const campoCorreo = document.getElementById('tuCorreo');
const campoAsunto = document.getElementById('asunto');
const campoMensaje = document.getElementById('tuMensaje');
const formulario = document.getElementById('formularioContacto');

// Paso 2 : Cargar datos guardados al abrir la página

document.addEventListener('DOMContentLoaded', () => {
    // localStorage : nombre y correo persisten ente visitas
    campoNombre.value = localStorage.getItem('contacto_nombre' || '');
    campoCorreo.value = localStorage.getItem('contacto_correo' || '');
    // sessionStorage : asunto y mensaje  solo duran esta sesion
    campoAsunto.value = sessionStorage.getItem('contacto_asunto' || '');
    campoMensaje.value = sessionStorage.getItem('contacto_mensaje' || '');

})

// Paso 3 Guardar mientras el usuario escribe

//localStorage guardamos nombre y correo en cada tecla que el usuario presiona
campoNombre.addEventListener('input', () => {
    localStorage.setItem('contacto_nombre', campoNombre.value);
});

campoCorreo.addEventListener('input', () => {
    localStorage.setItem('contacto_correo', campoCorreo.value);
});

//sessionStorage guardamos asunto y mensaje en cada tecla que el usuario presiona
campoAsunto.addEventListener('input', () => {
    sessionStorage.setItem('contacto_asunto', campoAsunto.value);
});

campoMensaje.addEventListener('input', () => {
    sessionStorage.setItem('contacto_mensaje', campoMensaje.value);
});


// Paso 4 Limpiar datos al enviar el formulario
formulario.addEventListener('submit', () => {
    // Limpiar localStorage
    localStorage.removeItem('contacto_nombre');
    localStorage.removeItem('contacto_correo');
    // Limpiar sessionStorage
    sessionStorage.removeItem('contacto_asunto');
    sessionStorage.removeItem('contacto_mensaje');
});