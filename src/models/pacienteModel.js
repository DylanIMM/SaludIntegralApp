import { poolPromise, sql } from "../config/db.js";

export const PacienteModel = {

    //====================================
    // LISTAR
    //====================================

    getAllBySede: async (sede) => {

        const pool = await poolPromise;

        const result = await pool.request()

            .execute("SP_GET_PACIENTES");

        return result.recordset;

    },

    //====================================
    // CREAR
    //====================================

    create: async (data, sede) => {

        const pool = await poolPromise;

        const result = await pool.request()

    .input("cedula", sql.VarChar, data.cedula)
    .input("nombre", sql.VarChar, data.nombre)
    .input("edad", sql.Int, data.edad)
    .input("direccion", sql.VarChar, data.direccion)
    .input("telefono", sql.VarChar, data.telefono)

    .execute("SP_INSERT_PACIENTE");

return {

    id_paciente: result.recordset[0].id_paciente,

    ...data

};
    },

    //====================================
    // ACTUALIZAR
    //====================================

    update: async (id, data, sede) => {

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_paciente", sql.VarChar, id)
            .input("cedula", sql.VarChar, data.cedula)
            .input("nombre", sql.VarChar, data.nombre)
            .input("edad", sql.Int, data.edad)
            .input("direccion", sql.VarChar, data.direccion)
            .input("telefono", sql.VarChar, data.telefono)

            .execute("SP_UPDATE_PACIENTE");

        return result.rowsAffected[0] > 0;

    },

    //====================================
    // ELIMINAR
    //====================================

    delete: async (id, sede) => {

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_paciente", sql.VarChar, id)

            .execute("SP_DELETE_PACIENTE");

        return result.rowsAffected[0] > 0;

    }

};