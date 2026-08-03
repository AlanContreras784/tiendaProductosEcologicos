// ======================================================
// validator.js
// Utilidades reutilizables para validar formularios.
//
// Responsabilidades:
// - Validar campos obligatorios.
// - Validar emails.
// - Validar contraseñas.
// - Validar longitud.
// - Validar números.
// - Mostrar una única fuente de verdad para las
//   validaciones del frontend.
// ======================================================

// ======================================================
// Verifica si un valor está vacío.
// ======================================================
export function esCampoVacio(valor) {
    return valor.trim() === "";
}
// ======================================================
// Verifica longitud mínima y máxima.
// ======================================================
export function validarLongitud(
    valor,
    minimo,
    maximo
) {
    const longitud = valor.trim().length;
    return (
        longitud >= minimo &&
        longitud <= maximo
    );
}
// ======================================================
// Valida un email.
// ======================================================
export function esEmailValido(email) {
    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}
// ======================================================
// Valida una contraseña.
//
// Reglas:
// - mínimo 8 caracteres
// - una mayúscula
// - una minúscula
// - un número
// ======================================================
export function esPasswordValida(password) {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}
// ======================================================
// Valida texto simple.
//
// Solo letras, números, espacios y acentos.
// ======================================================
export function esTextoValido(texto) {
    const regex =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/;
    return regex.test(texto.trim());
}
// ======================================================
// Valida un número positivo.
// ======================================================
export function esNumeroPositivo(valor) {
    return Number(valor) > 0;
}
// ======================================================
// Muestra un mensaje de error debajo del input.
// ======================================================

export function mostrarError(input, mensaje) {

    const error = document.getElementById(
        `${input.id}-error`
    );

    if (!error) return;

    input.classList.remove("input-success");
    input.classList.add("input-error");

    error.textContent = mensaje;

}
// ======================================================
// Limpia el error de un input.
// ======================================================
export function limpiarError(input) {
    const error = document.getElementById(
        `${input.id}-error`
    );
    if (!error) return;
    input.classList.remove("input-error");
    input.classList.add("input-success");
    error.textContent = "";
}