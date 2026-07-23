function mostrarToast(mensaje){
    const toast = document.getElementById('toast');
    const toastMensaje = document.getElementById('toastMensaje');

    toastMensaje.textContent = mensaje;
    toast.classList.add('visible');
    setTimeout(ocultarToast,4500);
}

function ocultarToast(){
    document.getElementById('toast').classList.remove('visible');
}

document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('btnCerrarToast').addEventListener('click',ocultarToast)
})

function modalConfirm(message) {
    return new Promise((resolve) => {

        const modal = document.getElementById("modal-confirm");
        const msg = document.getElementById("modal-message");
        const btnYes = document.getElementById("modal-yes");
        const btnNo = document.getElementById("modal-no");

        msg.textContent = message;
        modal.classList.remove("hidden");

        btnYes.onclick = () => {
            modal.classList.add("hidden");
            resolve(true);
        };

        btnNo.onclick = () => {
            modal.classList.add("hidden");
            resolve(false);
        };
    });
}