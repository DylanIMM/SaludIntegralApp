// ======================================
// MEDICOS.JS
// Sistema Salud Integral
// ======================================

const API = "/api/medicos";

const sede =
    localStorage.getItem("SALUD_INTEGRAL_CURRENT_SEDE") || "C01";

const form = document.getElementById("crud-form");
const tbody = document.getElementById("table-tbody");
const thead = document.getElementById("table-head");
const btnSubmit = form.querySelector('button[type="submit"]');

let editMode = false;
let editId = null;

//======================================
document.addEventListener("DOMContentLoaded", () => {

    cargarMedicos();

    form.addEventListener("submit", guardarMedico);

});

//======================================

async function cargarMedicos() {

    try {

        const response = await fetch(API, {

            headers: {
                "x-sede": sede
            }

        });

        const medicos = await response.json();

        tbody.innerHTML = "";

        if (medicos.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="${sede === "C01" ? 6 : 4}" style="text-align:center">
                        No existen médicos registrados.
                    </td>
                </tr>
            `;

            return;
        }

        if(sede === "C01"){
            thead.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Horario de Atención</th>
                        <th>Acciones</th>
                    </tr>
                `;
        }else{
            thead.innerHTML = `
                    <tr>

                        <th>ID</th>

                        <th>Especialidad</th>

                        <th>Horario de atención</th>

                        <th>Acciones</th>

                    </tr>
                `;
        }

        medicos.forEach(medico => {

            if (sede === "C01") {

                tbody.innerHTML += `
                    <tr>

                        <td>${medico.id_medico}</td>

                        <td>${medico.cedula}</td>

                        <td>${medico.nombre}</td>

                        <td>${medico.especialidad ?? ""}</td>

                        <td>${medico.horario_atencion ?? ""}</td>

                        <td>

                            <button
                                class="btn-action btn-edit"
                                onclick='editarMedico(${JSON.stringify(medico)})'>
                                Editar
                            </button>

                            <button
                                class="btn-action btn-danger"
                                onclick="eliminarMedico('${medico.id_medico}')">
                                Eliminar
                            </button>

                        </td>

                    </tr>
                `;

            } else {
                tbody.innerHTML += `
                    <tr>

                        <td>${medico.id_medico}</td>

                        <td>${medico.especialidad}</td>

                        <td>${medico.horario_atencion}</td>

                        <td>

                            <button
                                class="btn-action btn-edit"
                                onclick='editarMedico(${JSON.stringify(medico)})'>
                                Editar
                            </button>

                            <button
                                class="btn-action btn-danger"
                                onclick="eliminarMedico('${medico.id_medico}')">
                                Eliminar
                            </button>

                        </td>

                    </tr>
                `;

            }

        });

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="${sede === "C01" ? 6 : 4}">
                    Error al conectar con el servidor.
                </td>
            </tr>
        `;

    }

}
//======================================

async function guardarMedico(e) {

    e.preventDefault();

    const medico = {

        cedula:

            document.getElementById("cedula").value.trim(),

        nombre:

            document.getElementById("nombre").value.trim(),

        especialidad:

            document.getElementById("especialidad").value.trim(),

        horario_atencion:

            document.getElementById("horario_atencion").value.trim()

    };

    try {

        let response;

        if (editMode) {

            response = await fetch(

                `${API}/${editId}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        "x-sede": sede

                    },

                    body: JSON.stringify(medico)

                }

            );

        }

        else {

            response = await fetch(

                API,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                        "x-sede": sede

                    },

                    body: JSON.stringify(medico)

                }

            );

        }

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error);

        }

        alert(data.message);

        limpiarFormulario();

        cargarMedicos();

    }

    catch (error) {

        alert(error.message);

    }

}

//======================================

window.editarMedico = function(medico){

    editMode = true;

    editId = medico.id_medico;

    document.getElementById("cedula").value =
        medico.cedula;

    document.getElementById("nombre").value =
        medico.nombre;

    document.getElementById("especialidad").value =
        medico.especialidad;

    document.getElementById("horario_atencion").value =
        medico.horario_atencion;

    btnSubmit.textContent = "Actualizar";

};

//======================================

window.eliminarMedico = async function(id){

    if(!confirm("¿Eliminar médico?")){

        return;

    }

    try{

        const response = await fetch(

            `${API}/${id}`,

            {

                method:"DELETE",

                headers:{

                    "x-sede":sede

                }

            }

        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        alert(data.message);

        cargarMedicos();

    }

    catch(error){

        alert(error.message);

    }

};

//======================================

window.clearForm = limpiarFormulario;

function limpiarFormulario(){

    form.reset();

    editMode = false;

    editId = null;

    btnSubmit.textContent = "Guardar";

}