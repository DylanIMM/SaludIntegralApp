import { poolPromise, sql } from "../config/db.js";
import { isSedeValid } from "../config/distributedConfig.js";

export const ConsultorioModel = {

    //=========================================
    // OBTENER TODOS
    //=========================================

    getAllBySede: async (sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)

            .execute("SP_GET_CONSULTORIOS");

        return result.recordset;

    },

    //=========================================
    // CREAR
    //=========================================

    create: async (data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)
            .input("tipo_atencion", sql.VarChar, data.tipo_atencion)
            .input("piso", sql.Int, data.piso)

            .execute("SP_INSERT_CONSULTORIO");

        return result.rowsAffected[0] > 0;

    },

    //=========================================
    // ACTUALIZAR
    //=========================================

    update: async (nroConsultorio, data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)
            .input("nro_consultorio", sql.Int, nroConsultorio)
            .input("tipo_atencion", sql.VarChar, data.tipo_atencion)
            .input("piso", sql.Int, data.piso)

            .execute("SP_UPDATE_CONSULTORIO");

        return result.rowsAffected[0] > 0;

    },

    //=========================================
    // ELIMINAR
    //=========================================

    delete: async (nroConsultorio, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)
            .input("nro_consultorio", sql.Int, nroConsultorio)

            .execute("SP_DELETE_CONSULTORIO");

        return result.rowsAffected[0] > 0;

    }

};