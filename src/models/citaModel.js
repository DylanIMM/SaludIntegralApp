import { poolPromise, sql } from "../config/db.js";
import {
  isSedeValid,
  getCitaTable,
  getPacienteTable,
  getConsultorioTable,
  getMedicoTable,
  getMedicoAdministrativoTable
} from "../config/distributedConfig.js";

//====================================================
// GENERAR ID DE CITA
//====================================================

const generateCitaId = async (pool, tablaCitas) => {
  const result = await pool.request().query(`
        SELECT TOP 1 id_cita
        FROM ${tablaCitas}
        ORDER BY id_cita DESC
    `);

  if (result.recordset.length === 0) {
    return "CITA001";
  }

  const ultimo = result.recordset[0].id_cita;

  const numero = parseInt(ultimo.replace("CITA", "")) + 1;

  return `CITA${numero.toString().padStart(3, "0")}`;
};

export const CitaModel = {
  //====================================================
  // OBTENER TODAS LAS CITAS DE UNA SEDE
  //====================================================

  getAllBySede: async (sede) => {

    if (!isSedeValid(sede)) {
        throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const tablaCitas = getCitaTable(sede);
    const tablaPacientes = getPacienteTable(sede);
    const tablaMedicosAdmin = getMedicoAdministrativoTable();

    const result = await pool.request()

        .input("id_clinica", sql.VarChar, sede)

        .query(`

            SELECT

                c.id_cita,

                CONVERT(varchar(10), c.fecha, 23) AS fecha,

                CONVERT(varchar(5), c.hora, 108) AS hora,

                c.motivo_consulta,

                c.diagnostico,

                c.estado,

                c.id_medico,

                m.nombre AS nombre_medico,

                c.id_paciente,

                p.nombre AS nombre_paciente,

                c.nro_consultorio,

                c.id_clinica

            FROM ${tablaCitas} c

            INNER JOIN ${tablaMedicosAdmin} m

                ON c.id_medico = m.id_medico

            INNER JOIN ${tablaPacientes} p

                ON c.id_paciente = p.id_paciente

            WHERE c.id_clinica = @id_clinica

            ORDER BY

                c.fecha,

                c.hora

        `);

    return result.recordset;

},
  //====================================================
  // OBTENER UNA CITA
  //====================================================

  getById: async (id, sede) => {
    if (!isSedeValid(sede)) {
      throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const tablaCitas = getCitaTable(sede);

    const result = await pool
      .request()

      .input("id", sql.VarChar, id)
      .input("id_clinica", sql.VarChar, sede).query(`

                SELECT 

                    id_cita,
                    CONVERT(varchar(10), fecha, 23) AS fecha,
                    CONVERT(varchar(5), hora, 108) AS hora,
                    motivo_consulta,
                    diagnostico,
                    estado,
                    id_medico,
                    id_paciente,
                    nro_consultorio,
                    id_clinica

                FROM ${tablaCitas}

                WHERE

                    id_cita=@id

                AND

                    id_clinica=@id_clinica

            `);

    return result.recordset[0] || null;
  },
 // =========================
// CREATE
// =========================
create: async (data, sede) => {

    if (!isSedeValid(sede)) {
        throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const tablaCitas = getCitaTable(sede);
    const tablaPacientes = getPacienteTable(sede);
    const tablaConsultorios = getConsultorioTable(sede);
    const tablaMedicos = getMedicoTable(sede);

    //=========================
    // Generar ID
    //=========================

    const ultimo = await pool.request().query(`
        SELECT TOP 1 id_cita
        FROM ${tablaCitas}
        ORDER BY id_cita DESC
    `);

    let nuevoId = "CITA001";

    if (ultimo.recordset.length > 0) {

        const numero =
            parseInt(
                ultimo.recordset[0].id_cita.replace("CITA","")
            ) + 1;

        nuevoId =
            `CITA${numero.toString().padStart(3,"0")}`;

    }

    //=========================
    // Validar paciente
    //=========================

    const paciente = await pool.request()

        .input("id_paciente",sql.VarChar,data.id_paciente)

        .query(`

            SELECT id_paciente
            FROM ${tablaPacientes}
            WHERE id_paciente=@id_paciente

        `);

    if(paciente.recordset.length===0){

        throw new Error("El paciente no existe.");

    }

    //=========================
    // Validar médico
    //=========================

    const medico = await pool.request()

        .input("id_medico",sql.VarChar,data.id_medico)
        .input("id_clinica",sql.VarChar,sede)

        .query(`

            SELECT id_medico
            FROM ${tablaMedicos}
            WHERE id_medico=@id_medico
            AND id_clinica=@id_clinica

        `);

    if(medico.recordset.length===0){

        throw new Error("El médico no existe en esta sede.");

    }

    //=========================
    // Validar consultorio
    //=========================

    const consultorio = await pool.request()

        .input("consultorio",sql.Int,data.nro_consultorio)
        .input("id_clinica",sql.VarChar,sede)

        .query(`

            SELECT nro_consultorio
            FROM ${tablaConsultorios}
            WHERE nro_consultorio=@consultorio
            AND id_clinica=@id_clinica

        `);

    if(consultorio.recordset.length===0){

        throw new Error("Consultorio inexistente.");

    }

    //=========================
    // Conflicto médico
    //=========================

    const conflictoMedico = await pool.request()

        .input("fecha",sql.Date,data.fecha)
        .input("hora",sql.VarChar,data.hora)
        .input("id_medico",sql.VarChar,data.id_medico)
        .input("id_clinica",sql.VarChar,sede)

        .query(`

            SELECT id_cita
            FROM ${tablaCitas}
            WHERE fecha=@fecha
            AND hora=@hora
            AND id_medico=@id_medico
            AND id_clinica=@id_clinica

        `);

    if(conflictoMedico.recordset.length>0){

        throw new Error(
            "El médico ya tiene una cita en ese horario."
        );

    }

    //=========================
    // Conflicto consultorio
    //=========================

    const conflictoConsultorio = await pool.request()

        .input("fecha",sql.Date,data.fecha)
        .input("hora",sql.VarChar,data.hora)
        .input("consultorio",sql.Int,data.nro_consultorio)
        .input("id_clinica",sql.VarChar,sede)

        .query(`

            SELECT id_cita
            FROM ${tablaCitas}
            WHERE fecha=@fecha
            AND hora=@hora
            AND nro_consultorio=@consultorio
            AND id_clinica=@id_clinica

        `);

    if(conflictoConsultorio.recordset.length>0){

        throw new Error(
            "El consultorio ya está ocupado en ese horario."
        );

    }

    //=========================
    // INSERT
    //=========================

    const result = await pool.request()

        .input("id_cita",sql.VarChar,nuevoId)

        .input("fecha",sql.Date,data.fecha)
        .input("hora",sql.VarChar,data.hora)

        .input("motivo_consulta",sql.VarChar,data.motivo_consulta)
        .input("diagnostico",sql.VarChar,data.diagnostico)
        .input("estado",sql.VarChar,data.estado)

        .input("id_medico",sql.VarChar,data.id_medico)
        .input("id_paciente",sql.VarChar,data.id_paciente)

        .input("id_clinica",sql.VarChar,sede)

        .input("nro_consultorio",sql.Int,data.nro_consultorio)

        .query(`

            INSERT INTO ${tablaCitas}
            (
                id_cita,
                fecha,
                hora,
                motivo_consulta,
                diagnostico,
                estado,
                id_medico,
                id_paciente,
                id_clinica,
                nro_consultorio
            )

            VALUES
            (
                @id_cita,
                @fecha,
                @hora,
                @motivo_consulta,
                @diagnostico,
                @estado,
                @id_medico,
                @id_paciente,
                @id_clinica,
                @nro_consultorio
            )

        `);

    return result.rowsAffected[0] > 0;

},
// =========================
// UPDATE
// =========================
update: async (id, data, sede) => {

    if (!isSedeValid(sede)) {
        throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const tablaCitas = getCitaTable(sede);
    const tablaMedicos = getMedicoTable(sede);
    const tablaConsultorios = getConsultorioTable(sede);
    const tablaPacientes = getPacienteTable(sede);

    //=========================
    // Validar paciente
    //=========================

    const paciente = await pool.request()
        .input("id_paciente", sql.VarChar, data.id_paciente)
        .query(`
            SELECT id_paciente
            FROM ${tablaPacientes}
            WHERE id_paciente = @id_paciente
        `);

    if (paciente.recordset.length === 0) {
        throw new Error("El paciente no existe.");
    }

    //=========================
    // Validar médico
    //=========================

    const medico = await pool.request()
        .input("id_medico", sql.VarChar, data.id_medico)
        .input("id_clinica", sql.VarChar, sede)
        .query(`
            SELECT id_medico
            FROM ${tablaMedicos}
            WHERE id_medico = @id_medico
            AND id_clinica = @id_clinica
        `);

    if (medico.recordset.length === 0) {
        throw new Error("El médico no existe en esta sede.");
    }

    //=========================
    // Validar consultorio
    //=========================

    const consultorio = await pool.request()
        .input("nro", sql.Int, data.nro_consultorio)
        .input("id_clinica", sql.VarChar, sede)
        .query(`
            SELECT nro_consultorio
            FROM ${tablaConsultorios}
            WHERE nro_consultorio=@nro
            AND id_clinica=@id_clinica
        `);

    if (consultorio.recordset.length === 0) {
        throw new Error("Consultorio inexistente.");
    }

    //=========================
    // Validar conflicto médico
    //=========================

    const conflictoMedico = await pool.request()
        .input("fecha", sql.Date, data.fecha)
        .input("hora", sql.VarChar, data.hora)
        .input("id_medico", sql.VarChar, data.id_medico)
        .input("id_clinica", sql.VarChar, sede)
        .input("id_cita", sql.VarChar, id)
        .query(`
            SELECT id_cita
            FROM ${tablaCitas}
            WHERE fecha=@fecha
            AND hora=@hora
            AND id_medico=@id_medico
            AND id_clinica=@id_clinica
            AND id_cita<>@id_cita
        `);

    if (conflictoMedico.recordset.length > 0) {
        throw new Error("El médico ya tiene una cita en ese horario.");
    }

    //=========================
    // Validar conflicto consultorio
    //=========================

    const conflictoConsultorio = await pool.request()
        .input("fecha", sql.Date, data.fecha)
        .input("hora", sql.VarChar, data.hora)
        .input("consultorio", sql.Int, data.nro_consultorio)
        .input("id_clinica", sql.VarChar, sede)
        .input("id_cita", sql.VarChar, id)
        .query(`
            SELECT id_cita
            FROM ${tablaCitas}
            WHERE fecha=@fecha
            AND hora=@hora
            AND nro_consultorio=@consultorio
            AND id_clinica=@id_clinica
            AND id_cita<>@id_cita
        `);

    if (conflictoConsultorio.recordset.length > 0) {
        throw new Error("El consultorio ya está ocupado en ese horario.");
    }

    //=========================
    // UPDATE
    //=========================

    const result = await pool.request()

        .input("id_cita", sql.VarChar, id)
        .input("id_clinica", sql.VarChar, sede)

        .input("fecha", sql.Date, data.fecha)
        .input("hora", sql.VarChar, data.hora)

        .input("motivo_consulta", sql.VarChar, data.motivo_consulta)
        .input("diagnostico", sql.VarChar, data.diagnostico)
        .input("estado", sql.VarChar, data.estado)

        .input("id_medico", sql.VarChar, data.id_medico)
        .input("id_paciente", sql.VarChar, data.id_paciente)
        .input("nro_consultorio", sql.Int, data.nro_consultorio)

        .query(`
            UPDATE ${tablaCitas}
            SET
                fecha=@fecha,
                hora=@hora,
                motivo_consulta=@motivo_consulta,
                diagnostico=@diagnostico,
                estado=@estado,
                id_medico=@id_medico,
                id_paciente=@id_paciente,
                nro_consultorio=@nro_consultorio
            WHERE id_cita=@id_cita
            AND id_clinica=@id_clinica
        `);

    return result.rowsAffected[0] > 0;

}, 
 //====================================================
  // ELIMINAR
  //====================================================

  delete: async (id, sede) => {
    if (!isSedeValid(sede)) {
      throw new Error("Sede inválida");
    }

    const pool = await poolPromise;
    const tablaCitas = getCitaTable(sede);

    const result = await pool
      .request()

      .input("id", sql.VarChar, id)
      .input("id_clinica", sql.VarChar, sede).query(`

                DELETE

                FROM ${tablaCitas}

                WHERE

                    id_cita=@id

                AND

                    id_clinica=@id_clinica

            `);

    return result.rowsAffected[0] > 0;
  },

  //====================================================
  // PRÓXIMAS CITAS
  //====================================================

  getUpcomingCitas: async (sede) => {
    if (!isSedeValid(sede)) {
      throw new Error("Sede inválida");
    }

    const pool = await poolPromise;
    const tablaCitas = getCitaTable(sede);

    const result = await pool
      .request()

      .input("id_clinica", sql.VarChar, sede).query(`

                SELECT

                    id_cita,
                    fecha,
                    hora,
                    motivo_consulta,
                    estado,
                    id_medico,
                    id_paciente,
                    nro_consultorio

                FROM ${tablaCitas}

                WHERE

                    id_clinica=@id_clinica

                AND

                    fecha >= CAST(GETDATE() AS DATE)

                ORDER BY

                    fecha,
                    hora

            `);

    return result.recordset;
  },
};
