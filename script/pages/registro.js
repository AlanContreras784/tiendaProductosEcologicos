// ======================================================
// registro.js
//
// Controlador de registro de usuarios.
//
// Responsabilidades:
// - Validar formulario.
// - Enviar datos al backend.
// - Guardar sesión JWT.
// - Redirigir al usuario.
// ======================================================


import { registrar } from "../api/authApi.js";


import {
    guardarToken,
    guardarUsuario,
    guardarRol,
    cerrarSesion
} from "../utils/storage.js";


import {
    mostrarToast
} from "../components/toast.js";


import {
    mostrarSpinner,
    ocultarSpinner
} from "../components/spinner.js";



// Elementos DOM

const formulario =
    document.getElementById("registroForm");


const username =
    document.getElementById("username");


const nombre =
    document.getElementById("nombre");


const apellido =
    document.getElementById("apellido");


const password =
    document.getElementById("password");



// Inicialización

function iniciarRegistro() {

    if (!formulario) return;


    formulario.addEventListener(
        "submit",
        enviarRegistro
    );

}




// Enviar formulario

async function enviarRegistro(event) {


    event.preventDefault();



    if (
        !username.value.trim() ||
        !nombre.value.trim() ||
        !apellido.value.trim() ||
        !password.value.trim()
    ) {

        mostrarToast(
            "Complete todos los campos."
        );

        return;

    }



    try {


        mostrarSpinner();



        const respuesta =
            await registrar({

                username: username.value.trim(),

                nombre: nombre.value.trim(),

                apellido: apellido.value.trim(),

                password: password.value


            });



        // limpiar sesión anterior

        cerrarSesion();



        // guardar nueva sesión

        guardarToken(
            respuesta.token
        );


        guardarUsuario(
            respuesta.username
        );


        guardarRol(
            respuesta.role
        );



        mostrarToast(
            "Usuario registrado correctamente."
        );



        setTimeout(() => {

            window.location.href =
                "tienda.html";

        }, 1000);



    }

    catch (error) {


        console.error(error);


        mostrarToast(
            error.message ??
            "Error al registrar usuario."
        );


    }

    finally {

        ocultarSpinner();

    }


}




document.addEventListener(
    "DOMContentLoaded",
    iniciarRegistro
);