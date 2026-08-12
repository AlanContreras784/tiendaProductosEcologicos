
// ======================================================
// adminUsuarios.js
//
// Módulo encargado de la consulta de usuarios dentro
// del Panel de Administración.
//
// Responsabilidades actuales:
// - Renderizar la sección de usuarios.
// - Obtener usuarios desde la API.
// - Mostrar los usuarios registrados.
// - Actualizar el contador de usuarios del Dashboard.
//
// Este módulo NO permite modificar usuarios.
//
// Las operaciones de edición, cambio de roles,
// activación/desactivación, etc. quedan para una futura
// etapa cuando exista el backend correspondiente.
// ======================================================

import {
    obtenerUsuarios
} from "../api/usuariosApi.js";


// ======================================================
// ELEMENTOS DEL DOM
//
// El contador pertenece al Dashboard principal.
//
// La tabla se obtiene después de renderizar dinámicamente
// la sección de usuarios.
// ======================================================

const totalUsuarios =
    document.getElementById("totalUsuarios");


// ======================================================
// INICIALIZAR MÓDULO DE USUARIOS
//
// Esta función pública es llamada desde admin.js cuando
// el administrador hace click en la tarjeta "Usuarios".
//
// Recibe el contenedor donde se debe renderizar la sección.
// ======================================================

export async function iniciarAdminUsuarios(
    contenedor
) {

    if (!contenedor) {

        console.error(
            "No se encontró el contenedor del módulo de usuarios."
        );

        return;
    }


    // --------------------------------------------------
    // Renderizar estructura HTML.
    // --------------------------------------------------

    contenedor.innerHTML =
        renderizarUsuarios();


    // --------------------------------------------------
    // Obtener los usuarios desde el backend.
    // --------------------------------------------------

    await cargarUsuarios();
}


// ======================================================
// CARGAR USUARIOS
//
// Obtiene los usuarios mediante usuariosApi.js.
//
// Endpoint utilizado:
//
// GET /usuarios
//
// El backend verifica que el usuario autenticado
// tenga ROLE_ADMIN.
// ======================================================

export async function cargarUsuarios() {

    try {

        const usuarios =
            await obtenerUsuarios();


        // --------------------------------------------------
        // Actualizar contador del Dashboard.
        // --------------------------------------------------

        if (totalUsuarios) {

            totalUsuarios.textContent =
                usuarios.length;
        }


        // --------------------------------------------------
        // Renderizar tabla.
        // --------------------------------------------------

        renderizarTablaUsuarios(
            usuarios
        );

    }
    catch (error) {

        console.error(
            "Error al cargar usuarios:",
            error
        );


        const tablaUsuarios =
            document.getElementById(
                "tablaUsuarios"
            );


        if (tablaUsuarios) {

            tablaUsuarios.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="admin-cargando"
                    >
                        No se pudieron cargar los usuarios.
                    </td>
                </tr>
            `;
        }
    }
}


// ======================================================
// RENDERIZAR USUARIOS
//
// Genera la estructura HTML de la sección de usuarios.
//
// Esta función se ejecuta antes de cargar los datos.
// ======================================================

export function renderizarUsuarios() {

    return `
        <section class="admin-usuarios-section">

            <!-- ==========================================
                 ENCABEZADO
            =========================================== -->

            <div class="admin-seccion-header">

                <div>

                    <h3>
                        Gestión de usuarios
                    </h3>

                    <p>
                        Consultá los usuarios registrados
                        en la plataforma.
                    </p>

                </div>

            </div>


            <!-- ==========================================
                 TABLA DE USUARIOS
            =========================================== -->

            <div class="admin-tabla-section">

                <h4>
                    Usuarios registrados
                </h4>

                <div class="admin-tabla-wrapper">

                    <table class="admin-tabla">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Usuario</th>

                                <th>Nombre</th>

                                <th>Apellido</th>

                                <th>Rol</th>

                                <th>Acciones</th>

                            </tr>

                        </thead>


                        <tbody id="tablaUsuarios">

                            <tr>

                                <td
                                    colspan="6"
                                    class="admin-cargando"
                                >
                                    Cargando usuarios...
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </section>
    `;
}


// ======================================================
// RENDERIZAR TABLA DE USUARIOS
//
// Recibe el listado obtenido desde la API y genera
// las filas correspondientes.
//
// Por ahora no existen acciones sobre usuarios,
// por lo que la columna "Acciones" queda preparada
// para futuras funcionalidades.
// ======================================================

export function renderizarTablaUsuarios(
    usuarios
) {

    const tablaUsuarios =
        document.getElementById(
            "tablaUsuarios"
        );


    if (!tablaUsuarios) {

        console.error(
            "No se encontró la tabla de usuarios."
        );

        return;
    }


    // --------------------------------------------------
    // No existen usuarios.
    // --------------------------------------------------

    if (
        !usuarios ||
        usuarios.length === 0
    ) {

        tablaUsuarios.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    class="admin-cargando"
                >
                    No hay usuarios registrados.
                </td>

            </tr>
        `;

        return;
    }


    // --------------------------------------------------
    // Generar filas.
    // --------------------------------------------------

    tablaUsuarios.innerHTML =
        usuarios.map(usuario => `

            <tr>

                <td>
                    ${usuario.id}
                </td>

                <td>
                    ${usuario.username}
                </td>

                <td>
                    ${usuario.nombre ?? "-"}
                </td>

                <td>
                    ${usuario.apellido ?? "-"}
                </td>

                <td>
                    ${usuario.role ?? "-"}
                </td>

                <td>
                    <span>
                        Sin acciones
                    </span>
                </td>

            </tr>

        `).join("");
}
