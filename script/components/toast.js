// ======================================================
// toast.js
// Sistema global de notificaciones
// ======================================================
export function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    const texto = document.getElementById("toastMensaje");
    if (!toast || !texto) {
        console.warn("Toast no encontrado");
        return;
    }
    texto.textContent = mensaje;
    toast.classList.add("mostrar");
    setTimeout(() => {
        toast.classList.remove("mostrar");
    },3000);
}

document.addEventListener("DOMContentLoaded",()=>{
    const btnCerrar =
        document.getElementById("btnCerrarToast");
    if(btnCerrar){
        btnCerrar.addEventListener("click",()=>{
            document
            .getElementById("toast")
            .classList.remove("mostrar");
        });
    }
});