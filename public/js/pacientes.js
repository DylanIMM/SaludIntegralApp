// ======================================
// PACIENTES.JS
// Sistema Salud Integral
// ======================================

const API = "/api/pacientes";

const sede = localStorage.getItem("SALUD_INTEGRAL_CURRENT_SEDE") || "C01";

const form = document.getElementById("crud-form");
const tbody = document.getElementById("table-tbody");
const btnSubmit = form.querySelector('button[type="submit"]');

let editMode = false;
let editId = null;

//========================================
// Inicializar
//========================================
document.addEventListener("DOMContentLoaded", () => {

    cargarPacientes();

    form.addEventListener("submit", guardarPaciente);

});

//========================================
// Obtener pacientes
//========================================
async function cargarPacientes() {

    try {

        const response = await fetch(API, {

            headers: {

                "x-sede": sede

            }

        });

        const pacientes = await response.json();

        tbody.innerHTML = "";

        if (pacientes.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="7" style="text-align:center">

                        No existen pacientes registrados.

                    </td>

                </tr>

            `;

            return;

        }

        pacientes.forEach(p => {

            tbody.innerHTML += `

            <tr>

                <td>${p.id_paciente}</td>

                <td>${p.cedula}</td>

                <td>${p.nombre}</td>

                <td>${p.edad}</td>

                <td>${p.direccion}</td>

                <td>${p.telefono}</td>

                <td>

                    <button
                        class="btn-action btn-edit"
                        onclick='editarPaciente(${JSON.stringify(p)})'>

                        Editar

                    </button>

                    <button
                        class="btn-action btn-danger"
                        onclick="eliminarPaciente('${p.id_paciente}')">

                        Eliminar

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

        tbody.innerHTML = `

        <tr>

            <td colspan="7">

                Error al conectar con el servidor.

            </td>

        </tr>

        `;

    }

}

//========================================
// Guardar
//========================================
async function guardarPaciente(e) {

    e.preventDefault();

    const paciente = {

        cedula: document.getElementById("cedula").value.trim(),

        nombre: document.getElementById("nombre").value.trim(),

        edad: Number(document.getElementById("edad").value),

        direccion: document.getElementById("direccion").value.trim(),

        telefono: document.getElementById("telefono").value.trim()

    };

    if (!editMode) {

        paciente.id_paciente = Number(

            document.getElementById("id_paciente").value

        );

    }

    try {

        let response;

        if (editMode) {

            response = await fetch(`${API}/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    "x-sede": sede

                },

                body: JSON.stringify(paciente)

            });

        }

        else {

            response = await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "x-sede": sede

                },

                body: JSON.stringify(paciente)

            });

        }

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error);

        }

        alert(data.message);

        limpiarFormulario();

        cargarPacientes();

    }

    catch (error) {

        alert(error.message);

    }

}

//========================================
// Editar
//========================================
window.editarPaciente = function (paciente) {

    editMode = true;

    editId = paciente.id_paciente;

    document.getElementById("id_paciente").value = paciente.id_paciente;
    document.getElementById("cedula").value = paciente.cedula;
    document.getElementById("nombre").value = paciente.nombre;
    document.getElementById("edad").value = paciente.edad;
    document.getElementById("direccion").value = paciente.direccion;
    document.getElementById("telefono").value = paciente.telefono;

    document.getElementById("id_paciente").disabled = true;

    btnSubmit.textContent = "Actualizar";

};

//========================================
// Eliminar
//========================================
window.eliminarPaciente = async function (id) {

    if (!confirm("¿Eliminar paciente?")) return;

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

        cargarPacientes();

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

    form.reset();

    editMode = false;

    editId = null;

    document.getElementById("id_paciente").disabled = false;

    btnSubmit.textContent = "Guardar";

}