// Paso 1 — Seleccionar los elementos
document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.getElementById('formularioContacto');
    const tuNombre = document.getElementById('tuNombre');
    const tuCorreo = document.getElementById('tuCorreo');
    const asunto = document.getElementById('asunto');
    const tuMensaje = document.getElementById('tuMensaje');

});

// Paso 2 — Función mostrarEstadoCampo

const mostrarEstadoCampo = (input, esValido, mensaje = '') => {
    const padre = input.parentNode;
    const textoError = padre.querySelector('.texto-error');
    if (esValido) {
        padre.classList.remove('error');
        textoError.innerText = '';
    } else {
        padre.classList.add('error');
        textoError.innerText = mensaje;
    }
};

// Paso 3 — Interceptar el submit y validar
const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
};

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    let formularioValido = true;

    if (tuNombre.value.trim() === '') {
        mostrarEstadoCampo(tuNombre, false, 'Por favor, ingresá tu nombre.');
        formularioValido = false;
    } else {
        mostrarEstadoCampo(tuNombre, true);
    }

    if (tuCorreo.value.trim() === '') {
        mostrarEstadoCampo(tuCorreo, false, 'El correo electrónico es obligatorio.');
        formularioValido = false;
    } else if (!esCorreoValido(tuCorreo.value.trim())) {
        mostrarEstadoCampo(tuCorreo, false, 'Ingresá un correo electrónico válido.');
        formularioValido = false;
    } else {
        mostrarEstadoCampo(tuCorreo, true);
    }

    if (asunto.value.trim() === '') {
        mostrarEstadoCampo(asunto, false, 'Por favor, ingresá un asunto.');
        formularioValido = false;
    } else {
        mostrarEstadoCampo(asunto, true);
    }

    if (tuMensaje.value.trim() === '') {
        mostrarEstadoCampo(tuMensaje, false, 'Por favor, ingresá tu mensaje.');
        formularioValido = false;
    } else {
        mostrarEstadoCampo(tuMensaje, true);
    }

    if (formularioValido) {
        formulario.submit();
    }
});