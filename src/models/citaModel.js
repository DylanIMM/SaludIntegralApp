import { poolPromise, sql } from "../config/db.js";
import { isSedeValid } from "../config/distributedConfig.js";

export const CitaModel = {

    //====================================================
    // LISTAR
    //====================================================

    getAllBySede: async (sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)

            .execute("SP_GET_CITAS");

        return result.recordset;

    },

    //====================================================
    // CREAR
    //====================================================

    create: async (data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)
            .input("fecha", sql.Date, data.fecha)
            .input("hora", sql.VarChar, data.hora)

            .input("motivo_consulta", sql.VarChar, data.motivo_consulta)
            .input("diagnostico", sql.VarChar, data.diagnostico)
            .input("estado", sql.VarChar, data.estado)

            .input("id_medico", sql.VarChar, data.id_medico)
            .input("id_paciente", sql.VarChar, data.id_paciente)

            .input("nro_consultorio", sql.Int, data.nro_consultorio)

            .execute("SP_INSERT_CITA");

        return result.rowsAffected[0] > 0;

    },

    //====================================================
    // ACTUALIZAR
    //====================================================

    update: async (id, data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

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

            .execute("SP_UPDATE_CITA");

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

        const result = await pool.request()

            .input("id_cita", sql.VarChar, id)
            .input("id_clinica", sql.VarChar, sede)

            .execute("SP_DELETE_CITA");

        return result.rowsAffected[0] > 0;

    },

};