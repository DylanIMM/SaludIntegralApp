import { poolPromise, sql } from '../config/db.js';
import { getClinicaTable } from '../config/distributedConfig.js';

export const ClinicaModel = {
    getAll: async (sede) => {
        const pool = await poolPromise;
        const table = getClinicaTable(sede);

        const result = await pool.request().query(`
            SELECT
                id_clinica,
                nombre,
                direccion,
                telefono
            FROM ${table}
            ORDER BY id_clinica
        `);

        return result.recordset;
    },

    create: async (data) => {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_clinica', sql.VarChar, data.id_clinica)
            .input('nombre', sql.VarChar, data.nombre)
            .input('direccion', sql.VarChar, data.direccion)
            .input('telefono', sql.VarChar, data.telefono)
            .query(`
                INSERT INTO Clinica
                (id_clinica, nombre, direccion, telefono)
                VALUES
                (@id_clinica, @nombre, @direccion, @telefono)
            `);

        return result.rowsAffected[0] > 0;
    },

    update: async (id, data) => {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .input('nombre', sql.VarChar, data.nombre)
            .input('direccion', sql.VarChar, data.direccion)
            .input('telefono', sql.VarChar, data.telefono)
            .query(`
                UPDATE Clinica
                SET
                    nombre = @nombre,
                    direccion = @direccion,
                    telefono = @telefono
                WHERE id_clinica = @id
            `);

        return result.rowsAffected[0] > 0;
    },

    delete: async (id) => {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .query(`
                DELETE FROM Clinica
                WHERE id_clinica = @id
            `);

        return result.rowsAffected[0] > 0;
    }
};