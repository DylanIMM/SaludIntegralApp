// ======================================
// CONSULTORIOS.JS
// Sistema Salud Integral
// ======================================

const API = "/api/consultorios";

const sede =
    localStorage.getItem("SALUD_INTEGRAL_CURRENT_SEDE") || "C01";

const form = document.getElementById("crud-form");
const tbody = document.getElementById("table-tbody");
const btnSubmit = form.querySelector('button[type="submit"]');

let editMode = false;
let consultorioActual = null;

//======================================
document.addEventListener("DOMContentLoaded", () => {

    cargarConsultorios();

    form.addEventListener("submit", guardarConsultorio);

});

//======================================

async function cargarConsultorios() {

    try {

        const response = await fetch(API, {

            headers: {

                "x-sede": sede

            }

        });

        const consultorios = await response.json();

        tbody.innerHTML = "";

        if (consultorios.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="4" style="text-align:center">

                        No existen consultorios registrados.

                    </td>

                </tr>

            `;

            return;

        }

        consultorios.forEach(c => {

            tbody.innerHTML += `

                <tr>

                    <td>${c.nro_consultorio}</td>

                    <td>${c.tipo_atencion}</td>

                    <td>${c.piso}</td>

                    <td>

                        <button
                            class="btn-action btn-edit"
                            onclick='editarConsultorio(${JSON.stringify(c)})'>

                            Editar

                        </button>

                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarConsultorio(${c.nro_consultorio})">

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

                <td colspan="4">

                    Error al conectar con el servidor.

                </td>

            </tr>

        `;

    }

}

//======================================

async function guardarConsultorio(e){

    e.preventDefault();

    const consultorio = {

        nro_consultorio: Number(

            document.getElementById("nro_consultorio").value

        ),

        tipo_atencion:

            document.getElementById("tipo_atencion").value.trim(),

        piso: Number(

            document.getElementById("piso").value

        )

    };

    try{

        let response;

        if(editMode){

            response = await fetch(

                `${API}/${consultorioActual}`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json",

                        "x-sede":sede

                    },

                    body:JSON.stringify(consultorio)

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

                    body:JSON.stringify(consultorio)

                }

            );

        }

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        alert(data.message);

        limpiarFormulario();

        cargarConsultorios();

    }

    catch(error){

        alert(error.message);

    }

}

//======================================

window.editarConsultorio = function(item){

    editMode = true;

    consultorioActual = item.nro_consultorio;

    document.getElementById("nro_consultorio").value =
        item.nro_consultorio;

    document.getElementById("tipo_atencion").value =
        item.tipo_atencion;

    document.getElementById("piso").value =
        item.piso;

    document.getElementById("nro_consultorio").disabled = true;

    btnSubmit.textContent = "Actualizar";

};

//======================================

window.eliminarConsultorio = async function(nro){

    if(!confirm("¿Eliminar consultorio?")){

        return;

    }

    try{

        const response = await fetch(

            `${API}/${nro}`,

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

        cargarConsultorios();

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

    consultorioActual = null;

    document.getElementById("nro_consultorio").disabled = false;

    btnSubmit.textContent = "Guardar";

}