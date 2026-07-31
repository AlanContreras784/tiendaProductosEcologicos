// ======================================================
// spinner.js
// Controla indicador de carga.
// ======================================================


export function mostrarSpinner(){

    const spinner =
        document.getElementById("spinner");

    if(spinner){
        spinner.style.display = "block";
    }

}



export function ocultarSpinner(){

    const spinner =
        document.getElementById("spinner");

    if(spinner){
        spinner.style.display = "none";
    }

}