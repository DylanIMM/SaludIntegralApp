// ======================================
// MAIN.JS
// Sistema Salud Integral
// ======================================

const STORAGE_KEY = "SALUD_INTEGRAL_CURRENT_SEDE";

const sede =
    localStorage.getItem(STORAGE_KEY) || "C01";

//=====================================

document.addEventListener("DOMContentLoaded", async () => {

    mostrarSede();

    configurarCambioSede();

    if (document.getElementById("card-pacientes")) {

        await cargarDashboard();

    }

});

//=====================================
// Mostrar sede actual
//=====================================

function mostrarSede() {

    const badge = document.getElementById("current-sede-badge");

    if (!badge) return;

    badge.textContent =
        sede === "C01"
            ? "SEDE NORTE (C01)"
            : "SEDE CENTRO (C02)";

}

//=====================================
// Cambiar sede
//=====================================

function configurarCambioSede() {

    const btn =
        document.getElementById("btn-change-sede");

    if (!btn) return;

    btn.addEventListener("click", () => {

        localStorage.removeItem(STORAGE_KEY);

    });

}

//=====================================
// Dashboard
//=====================================

async function cargarDashboard() {

    try {

        const [

            pacientes,

            medicos,

            consultorios,

            citas

        ] = await Promise.all([

            obtener("pacientes"),

            obtener("medicos"),

            obtener("consultorios"),

            obtener("citas")

        ]);

        actualizarTarjetas(

            pacientes.length,

            medicos.length,

            consultorios.length,

            citas.length

        );

        cargarTablaCitas(citas);

    }

    catch (error) {

        console.error(error);

    }

}

//=====================================

async function obtener(endpoint) {

    const response = await fetch(

        `/api/${endpoint}`,

        {

            headers: {

                "x-sede": sede

            }

        }

    );

    if (!response.ok) {

        throw new Error(

            `Error obteniendo ${endpoint}`

        );

    }

    return await response.json();

}

//=====================================

function actualizarTarjetas(

    pacientes,

    medicos,

    consultorios,

    citas

) {

    document.getElementById("card-pacientes").textContent =
        pacientes;

    document.getElementById("card-medicos").textContent =
        medicos;

    document.getElementById("card-consultorios").textContent =
        consultorios;

    document.getElementById("card-citas").textContent =
        citas;

}

//=====================================
// Tabla dashboard
//=====================================

function cargarTablaCitas(citas) {

    const tbody =
        document.getElementById("dashboard-citas-body");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (citas.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    No existen citas registradas.

                </td>

            </tr>

        `;

        return;

    }

    citas.forEach(cita => {

        tbody.innerHTML += `

            <tr>

                <td>

                    ${cita.fecha}

                </td>

                <td>

                    ${cita.hora}

                </td>

                <td>

                    ${cita.nombre_paciente}

                </td>

                <td>

                    ${cita.nombre_medico}

                </td>

                <td>

                    Consultorio ${cita.nro_consultorio}

                </td>

                <td>

                    ${cita.estado}

                </td>

            </tr>

        `;

    });

}