import { getPool, sql } from "../config/db.js";
import { isSedeValid } from "../config/distributedConfig.js";

export const TelefonoMedicoModel = {

    //=========================================
    // LISTAR
    //=========================================

    getAllBySede: async (sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await getPool(sede);

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)

            .execute("SP_GET_TELEFONOS");

        return result.recordset;

    },

    //=========================================
    // CREAR
    //=========================================

    create: async (data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await getPool(sede);

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)
            .input("id_medico", sql.VarChar, data.id_medico)
            .input("telefono", sql.VarChar, data.telefono)

            .execute("SP_INSERT_TELEFONO");

        return result.rowsAffected[0] > 0;

    },

    //=========================================
    // ACTUALIZAR
    //=========================================

    update: async (idMedico, telefonoActual, telefonoNuevo, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await getPool(sede);

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)
            .input("id_medico", sql.VarChar, idMedico)
            .input("telefono_actual", sql.VarChar, telefonoActual)
            .input("telefono_nuevo", sql.VarChar, telefonoNuevo)

            .execute("SP_UPDATE_TELEFONO");

        return result.rowsAffected[0] > 0;

    },

    //=========================================
    // ELIMINAR
    //=========================================

    delete: async (idMedico, telefono, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error("Sede inválida");
        }

        const pool = await getPool(sede);

        const result = await pool.request()

            .input("id_clinica", sql.VarChar, sede)
            .input("id_medico", sql.VarChar, idMedico)
            .input("telefono", sql.VarChar, telefono)

            .execute("SP_DELETE_TELEFONO");

        return result.rowsAffected[0] > 0;

    }

};