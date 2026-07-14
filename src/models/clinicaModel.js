import { poolPromise, sql } from '../config/db.js';

export const ClinicaModel = {

    //====================================
    // LISTAR
    //====================================

    getAll: async () => {

        const pool = await poolPromise;

        const result = await pool.request()

            .execute("SP_GET_CLINICAS");

        return result.recordset;

    },

    //====================================
    // CREAR
    //====================================

    create: async (data) => {

        const pool = await poolPromise;

        const result = await pool.request()

            .input("nombre", sql.VarChar, data.nombre)
            .input("direccion", sql.VarChar, data.direccion)
            .input("telefono", sql.VarChar, data.telefono)

            .execute("SP_INSERT_CLINICA");

        return result.rowsAffected[0] > 0;

    },

    //====================================
    // ACTUALIZAR
    //====================================

    update: async (id, data) => {

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, id)
            .input("nombre", sql.VarChar, data.nombre)
            .input("direccion", sql.VarChar, data.direccion)
            .input("telefono", sql.VarChar, data.telefono)

            .execute("SP_UPDATE_CLINICA");

        return result.rowsAffected[0] > 0;

    },

    //====================================
    // ELIMINAR
    //====================================

    delete: async (id) => {

        const pool = await poolPromise;

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, id)

            .execute("SP_DELETE_CLINICA");

        return result.rowsAffected[0] > 0;

    }

};