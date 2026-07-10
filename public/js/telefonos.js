// ======================================
// TELEFONOS.JS
// Sistema Salud Integral
// ======================================

const API = "/api/telefonos-medicos";

const sede =
    localStorage.getItem("SALUD_INTEGRAL_CURRENT_SEDE") || "C01";

const form = document.getElementById("crud-form");
const tbody = document.getElementById("table-tbody");
const btnSubmit = form.querySelector('button[type="submit"]');

let editMode = false;
let telefonoOriginal = null;
let medicoOriginal = null;

//======================================
document.addEventListener("DOMContentLoaded", () => {

    cargarTelefonos();
    cargarMedicos();

    form.addEventListener("submit", guardarTelefono);

});

//======================================

async function cargarTelefonos() {

    try {

        const response = await fetch(API, {

            headers: {

                "x-sede": sede

            }

        });

        const telefonos = await response.json();

        tbody.innerHTML = "";

        if (telefonos.length === 0) {

            tbody.innerHTML = `

            <tr>

                <td colspan="3" style="text-align:center">

                    No existen teléfonos registrados.

                </td>

            </tr>

            `;

            return;

        }

        telefonos.forEach(t => {

            tbody.innerHTML += `

            <tr>

                <td>${t.nombre}</td>

                <td>${t.telefono}</td>

                <td>

                    <button
                        class="btn-action btn-edit"
                        onclick='editarTelefono(${JSON.stringify(t)})'>

                        Editar

                    </button>

                    <button
                        class="btn-action btn-danger"
                        onclick="eliminarTelefono('${t.id_medico}','${t.telefono}')">

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

            <td colspan="3">

                Error al conectar con el servidor.

            </td>

        </tr>

        `;

    }

}

//========================================

async function cargarMedicos() {

    const response = await fetch("/api/medicos", {

        headers: {

            "x-sede": sede

        }

    });

    const medicos = await response.json();

    const select = document.getElementById("id_medico");

    select.innerHTML = "";

    medicos.forEach(m => {

        select.innerHTML +=

            `<option value="${m.id_medico}">

                ${m.nombre}

            </option>`;

    });

}



//======================================

async function guardarTelefono(e){

    e.preventDefault();

    const telefono = {

        id_medico:
            document.getElementById("id_medico").value.trim(),

        telefono:
            document.getElementById("telefono").value.trim()

    };

    try{

        let response;

        if(editMode){

            response = await fetch(

                `${API}/${medicoOriginal}/${telefonoOriginal}`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json",

                        "x-sede":sede

                    },

                    body:JSON.stringify({

                        telefono: telefono.telefono

                    })

                }

            );

        }

        else{

            response = await fetch(

                API,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json",

                        "x-sede":sede

                    },

                    body:JSON.stringify(telefono)

                }

            );

        }

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        alert(data.message);

        limpiarFormulario();

        cargarTelefonos();

    }

    catch(error){

        alert(error.message);

    }

}

//======================================

window.editarTelefono = function(item){

    editMode = true;

    medicoOriginal = item.id_medico;

    telefonoOriginal = item.telefono;

    document.getElementById("id_medico").value =
        item.id_medico;

    document.getElementById("telefono").value =
        item.telefono;

    document.getElementById("id_medico").disabled = true;

    btnSubmit.textContent = "Actualizar";

};

//======================================

window.eliminarTelefono = async function(idMedico, telefono){

    if(!confirm("¿Eliminar teléfono?")){

        return;

    }

    try{

        const response = await fetch(

            `${API}/${idMedico}/${telefono}`,

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

        cargarTelefonos();

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

    telefonoOriginal = null;

    medicoOriginal = null;

    document.getElementById("id_medico").disabled = false;

    btnSubmit.textContent = "Guardar";

}