// ======================================================
// auth.js
// Manejo del login
// ======================================================

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const username =
            document.getElementById("username").value.trim();


        const password =
            document.getElementById("password").value;


        try {

            const respuesta = await login(username, password);

            console.log("Login correcto:", respuesta);


            mostrarToast("Inicio de sesión correcto. Bienvenido " + username);


            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);


        } catch(error) {

            console.error(error);


            if (error.status === 401) {

                mostrarToast("Usuario o contraseña incorrectos.");

            } else if (error.status === 403) {

                mostrarToast("No tienes permisos para realizar esta acción.");

            } else {

                mostrarToast(error.message);

            }

        }

    });

}

// ======================================================
// REGISTRO
// ======================================================

const registroForm = document.getElementById("registroForm");


if (registroForm) {

    registroForm.addEventListener("submit", async (e)=>{

        e.preventDefault();


        const usuario = {

            nombre:
                document.getElementById("nombre").value.trim(),

            apellido:
                document.getElementById("apellido").value.trim(),

            username:
                document.getElementById("username").value.trim(),

            password:
                document.getElementById("password").value

        };


        try {


            await registrarUsuario(usuario);


            mostrarToast(
                "Usuario registrado correctamente"
            );


            setTimeout(()=>{

                window.location.href="index.html";

            },1500);



        } catch(error){


            console.error(error);


            if(error.status === 400){

                mostrarToast(
                    "Datos inválidos. Revisá los campos."
                );


            }else{

                mostrarToast(
                    error.message
                );

            }

        }

    });

}