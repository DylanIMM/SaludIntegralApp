// ======================================
// CITAS.JS
// ======================================

const API = "/api/citas";

const sede = localStorage.getItem("SALUD_INTEGRAL_CURRENT_SEDE") || "C01";

const form = document.getElementById("crud-form");
const tbody = document.getElementById("table-tbody");
const btnSubmit = document.getElementById("btn-submit");

let editMode = false;
let editId = null;

//=====================================

document.addEventListener("DOMContentLoaded", async () => {
  await cargarCombos();

  await cargarTabla();

  form.addEventListener("submit", guardarCita);
});

//=====================================

async function cargarCombos() {
  await Promise.all([cargarPacientes(), cargarMedicos(), cargarConsultorios()]);
}

//=====================================

async function cargarPacientes() {
  const response = await fetch("/api/pacientes", {
    headers: {
      "x-sede": sede,
    },
  });

  const pacientes = await response.json();

  const select = document.getElementById("id_paciente");

  select.innerHTML = "";

  pacientes.forEach((p) => {
    select.innerHTML += `

            <option value="${p.id_paciente}">

                ${p.nombre}

            </option>

        `;
  });
}

//=====================================

async function cargarMedicos() {
  const response = await fetch("/api/medicos", {
    headers: {
      "x-sede": sede,
    },
  });

  const medicos = await response.json();

  const select = document.getElementById("id_medico");

  select.innerHTML = "";

  medicos.forEach((m) => {
    select.innerHTML += `

            <option value="${m.id_medico}">

                ${m.nombre}

            </option>

        `;
  });
}

//=====================================

async function cargarConsultorios() {
  const response = await fetch("/api/consultorios", {
    headers: {
      "x-sede": sede,
    },
  });

  const consultorios = await response.json();

  const select = document.getElementById("nro_consultorio");

  select.innerHTML = "";

  consultorios.forEach((c) => {
    select.innerHTML += `

            <option value="${c.nro_consultorio}">

                ${c.nro_consultorio}

            </option>

        `;
  });
}

//=====================================

async function cargarTabla() {
  const response = await fetch(API, {
    headers: {
      "x-sede": sede,
    },
  });

  const citas = await response.json();

  tbody.innerHTML = "";

  if (citas.length === 0) {
    tbody.innerHTML = `

            <tr>

                <td colspan="10">

                    No existen registros.

                </td>

            </tr>

        `;

    return;
  }

  citas.forEach((c) => {
    tbody.innerHTML += `

        <tr>

            <td>${c.id_cita}</td>

            <td>${c.fecha}</td>

            <td>${c.hora}</td>

            <td>${c.motivo_consulta}</td>

            <td>${c.diagnostico}</td>

            <td>${c.estado}</td>

            <td>${c.nombre_medico}</td>

            <td>${c.nombre_paciente}</td>

            <td>${c.nro_consultorio}</td>
            <td>

                <button
                    class="btn-action btn-edit"
                    onclick='editar(${JSON.stringify(c)})'>

                    Editar

                </button>

                <button
                    class="btn-action btn-danger"
                    onclick="eliminar('${c.id_cita}')">

                    Eliminar

                </button>

            </td>

        </tr>

        `;
  });
}

//=====================================
// GUARDAR
//=====================================

async function guardarCita(e) {
  e.preventDefault();

  const cita = {
    fecha: document.getElementById("fecha").value,

    hora: document.getElementById("hora").value,

    motivo_consulta: document.getElementById("motivo_consulta").value.trim(),

    diagnostico: document.getElementById("diagnostico").value.trim(),

    estado: document.getElementById("estado").value,

    id_medico: document.getElementById("id_medico").value,

    id_paciente: document.getElementById("id_paciente").value,

    nro_consultorio: Number(document.getElementById("nro_consultorio").value),
  };

  try {
    const response = await fetch(
      editMode ? `${API}/${editId}` : API,

      {
        method: editMode ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",

          "x-sede": sede,
        },

        body: JSON.stringify(cita),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    alert(data.message);

    limpiarFormulario();

    await cargarTabla();
  } catch (err) {
    alert(err.message);
  }
}

//=====================================
// EDITAR
//=====================================

window.editar = function(c) {

    editMode = true;

    editId = c.id_cita;

    document.getElementById("fecha").value = c.fecha;

    document.getElementById("hora").value = c.hora;

    document.getElementById("motivo_consulta").value = c.motivo_consulta;

    document.getElementById("diagnostico").value = c.diagnostico ?? "";

    document.getElementById("estado").value = c.estado;

    document.getElementById("id_medico").value = c.id_medico;

    document.getElementById("id_paciente").value = c.id_paciente;

    document.getElementById("nro_consultorio").value = c.nro_consultorio;

    btnSubmit.textContent = "Actualizar";
};

//=====================================
// ELIMINAR
//=====================================

window.eliminar = async function (id) {
  if (!confirm("¿Desea eliminar esta cita?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API}/${id}`,

      {
        method: "DELETE",

        headers: {
          "x-sede": sede,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    alert(data.message);

    await cargarTabla();
  } catch (err) {
    alert(err.message);
  }
};

//=====================================
// LIMPIAR FORMULARIO
//=====================================

window.clearForm = limpiarFormulario;

function limpiarFormulario() {
  form.reset();

  editMode = false;

  editId = null;

  btnSubmit.textContent = "Guardar";
}
