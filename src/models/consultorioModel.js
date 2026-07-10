import { poolPromise, sql } from '../config/db.js';
import {
    isSedeValid,
    getConsultorioTable,
    getCitaTable
} from '../config/distributedConfig.js';

export const ConsultorioModel = {

    //=========================================
    // OBTENER TODOS
    //=========================================
    getAllBySede: async (sede) => {

        if (!isSedeValid(sede)) {
            throw new Error('Sede inválida');
        }

        const pool = await poolPromise;
        const tabla = getConsultorioTable(sede);

        const result = await pool.request()
            .input('id_clinica', sql.VarChar, sede)
            .query(`
                SELECT
                    id_clinica,
                    nro_consultorio,
                    tipo_atencion,
                    piso
                FROM ${tabla}
                WHERE id_clinica = @id_clinica
                ORDER BY nro_consultorio
            `);

        return result.recordset;
    },

    //=========================================
    // CREAR
    //=========================================
    create: async (data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error('Sede inválida');
        }

        const pool = await poolPromise;
        const tabla = getConsultorioTable(sede);

        const existe = await pool.request()
            .input('id_clinica', sql.VarChar, sede)
            .input('nro', sql.Int, data.nro_consultorio)
            .query(`
                SELECT 1
                FROM ${tabla}
                WHERE id_clinica=@id_clinica
                AND nro_consultorio=@nro
            `);

        if (existe.recordset.length > 0) {
            throw new Error("El consultorio ya existe.");
        }

        const result = await pool.request()
            .input('id_clinica', sql.VarChar, sede)
            .input('nro', sql.Int, data.nro_consultorio)
            .input('tipo', sql.VarChar, data.tipo_atencion)
            .input('piso', sql.Int, data.piso)
            .query(`
                INSERT INTO ${tabla}
                (
                    id_clinica,
                    nro_consultorio,
                    tipo_atencion,
                    piso
                )
                VALUES
                (
                    @id_clinica,
                    @nro,
                    @tipo,
                    @piso
                )
            `);

        return result.rowsAffected[0] > 0;
    },

    //=========================================
    // ACTUALIZAR
    //=========================================
    update: async (nroConsultorio, data, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error('Sede inválida');
        }

        const pool = await poolPromise;
        const tabla = getConsultorioTable(sede);

        const result = await pool.request()
            .input('id_clinica', sql.VarChar, sede)
            .input('nro', sql.Int, nroConsultorio)
            .input('tipo', sql.VarChar, data.tipo_atencion)
            .input('piso', sql.Int, data.piso)
            .query(`
                UPDATE ${tabla}
                SET
                    tipo_atencion=@tipo,
                    piso=@piso
                WHERE
                    id_clinica=@id_clinica
                AND nro_consultorio=@nro
            `);

        return result.rowsAffected[0] > 0;
    },

    //=========================================
    // ELIMINAR
    //=========================================
    delete: async (nroConsultorio, sede) => {

        if (!isSedeValid(sede)) {
            throw new Error('Sede inválida');
        }

        const pool = await poolPromise;

        const tabla = getConsultorioTable(sede);
        const tablaCitas = getCitaTable(sede);

        const citas = await pool.request()
            .input('id_clinica', sql.VarChar, sede)
            .input('nro', sql.Int, nroConsultorio)
            .query(`
                SELECT 1
                FROM ${tablaCitas}
                WHERE
                    id_clinica=@id_clinica
                AND nro_consultorio=@nro
            `);

        if (citas.recordset.length > 0) {
            throw new Error(
                "No se puede eliminar el consultorio porque tiene citas registradas."
            );
        }

        const result = await pool.request()
            .input('id_clinica', sql.VarChar, sede)
            .input('nro', sql.Int, nroConsultorio)
            .query(`
                DELETE FROM ${tabla}
                WHERE
                    id_clinica=@id_clinica
                AND nro_consultorio=@nro
            `);

        return result.rowsAffected[0] > 0;
    }

};