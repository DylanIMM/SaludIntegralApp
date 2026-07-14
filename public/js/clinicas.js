// ======================================
// CLINICAS.JS
// Sistema Salud Integral
// ======================================

const API = "/api/clinicas";

const sede = localStorage.getItem("SALUD_INTEGRAL_CURRENT_SEDE") || "C01";

const form = document.getElementById("crud-form");
const tbody = document.getElementById("table-tbody");
const formContainer = document.getElementById("form-container");

const btnSubmit = form
    ? form.querySelector('button[type="submit"]')
    : null;

let editMode = false;
let editId = null;

//========================================
// Configurar vista según sede
//========================================
if (sede === "C02") {

    if (formContainer) {

        formContainer.remove();

    }

    const thAcciones = document.querySelector("thead th:last-child");

    if (
        thAcciones &&
        thAcciones.textContent.toLowerCase().includes("acciones")
    ) {

        thAcciones.remove();

    }

}

//========================================
// Inicializar
//========================================
document.addEventListener("DOMContentLoaded", () => {

    cargarClinicas();

    if (form) {

        form.addEventListener("submit", guardarClinica);

    }

});

//========================================
// Obtener clínicas
//========================================
async function cargarClinicas() {

    try {

        const response = await fetch(API, {

            headers: {

                "x-sede": sede

            }

        });

        const clinicas = await response.json();

        tbody.innerHTML = "";

        if (clinicas.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="${sede === "C01" ? 5 : 4}"
                        style="text-align:center">

                        No existen clínicas registradas.

                    </td>

                </tr>

            `;

            return;

        }

        clinicas.forEach(c => {

            let fila = `

                <tr>

                    <td>${c.id_clinica}</td>

                    <td>${c.nombre}</td>

                    <td>${c.direccion}</td>

                    <td>${c.telefono}</td>

            `;

            if (sede === "C01") {

                fila += `

                    <td>

                        <button
                            class="btn-action btn-edit"
                            onclick='editarClinica(${JSON.stringify(c)})'>

                            Editar

                        </button>

                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarClinica('${c.id_clinica}')">

                            Eliminar

                        </button>

                    </td>

                `;

            }

            fila += "</tr>";

            tbody.innerHTML += fila;

        });

    }

    catch (error) {

        console.error(error);

        tbody.innerHTML = `

            <tr>

                <td colspan="${sede === "C01" ? 5 : 4}">

                    Error al conectar con el servidor.

                </td>

            </tr>

        `;

    }

}

//========================================
// Guardar
//========================================
async function guardarClinica(e) {

    e.preventDefault();

    const clinica = {

        nombre: document
            .getElementById("nombre")
            .value
            .trim(),

        direccion: document
            .getElementById("direccion")
            .value
            .trim(),

        telefono: document
            .getElementById("telefono")
            .value
            .trim()

    };

    try {

        let response;

        if (editMode) {

            response = await fetch(`${API}/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    "x-sede": sede

                },

                body: JSON.stringify(clinica)

            });

        }

        else {

            response = await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "x-sede": sede

                },

                body: JSON.stringify(clinica)

            });

        }

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error);

        }

        alert(data.message);

        limpiarFormulario();

        cargarClinicas();

    }

    catch (error) {

        alert(error.message);

    }

}

//========================================
// Editar
//========================================
window.editarClinica = function (clinica) {

    editMode = true;

    editId = clinica.id_clinica;

    document.getElementById("nombre").value = clinica.nombre;
    document.getElementById("direccion").value = clinica.direccion;
    document.getElementById("telefono").value = clinica.telefono;

    btnSubmit.textContent = "Actualizar";

};

//========================================
// Eliminar
//========================================
window.eliminarClinica = async function (id) {

    if (!confirm(`¿Eliminar la clínica ${id}?`)) {

        return;

    }

    try {

        const response = await fetch(`${API}/${id}`, {

            method: "DELETE",

            headers: {

                "x-sede": sede

            }

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error);

        }

        alert(data.message);

        cargarClinicas();

    }

    catch (error) {

        alert(error.message);

    }

};

//========================================
// Limpiar
//========================================
window.clearForm = limpiarFormulario;

function limpiarFormulario() {

    if (!form) return;

    form.reset();

    editMode = false;

    btnSubmit.textContent = "Guardar";

}