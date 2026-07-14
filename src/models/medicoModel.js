import { poolPromise, sql } from "../config/db.js";
import { isSedeValid } from "../config/distributedConfig.js";

export const MedicoModel = {

    //====================================
    // LISTAR
    //====================================

    getAllBySede: async (sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)

            .execute("SP_GET_MEDICOS");

        return result.recordset;

    },

    //====================================
    // CREAR
    //====================================
create: async (data, sede) => {

    if (!isSedeValid(sede)) {
        throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const result = await pool.request()

        .input("cedula", sql.VarChar, data.cedula)
        .input("nombre", sql.VarChar, data.nombre)
        .input("especialidad", sql.VarChar, data.especialidad)
        .input("horario_atencion", sql.VarChar, data.horario_atencion)
        .input("id_clinica", sql.VarChar, sede)

        .execute("SP_INSERT_MEDICO");

    return {

        id_medico: result.recordset[0].id_medico,
        ...data,
        id_clinica: sede

    };

},

    //====================================
    // ACTUALIZAR
    //====================================

    update: async (id, data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_medico", sql.VarChar, id)
            .input("cedula", sql.VarChar, data.cedula)
            .input("nombre", sql.VarChar, data.nombre)
            .input("especialidad", sql.VarChar, data.especialidad)
            .input("horario_atencion", sql.VarChar, data.horario_atencion)
            .input("id_clinica", sql.VarChar, sede)

            .execute("SP_UPDATE_MEDICO");

        return result.rowsAffected[0] > 0;

    },

    //====================================
    // ELIMINAR
    //====================================

    delete: async (id, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_medico", sql.VarChar, id)
            .input("id_clinica", sql.VarChar, sede)

            .execute("SP_DELETE_MEDICO");

        return result.rowsAffected[0] > 0;

    }

};