import { poolPromise, sql } from '../config/db.js';
import { getPacienteTable } from '../config/distributedConfig.js';

const generatePacienteId = async (pool, tablaPaciente) => {
    const result = await pool.request().query(`
        SELECT TOP 1 id_paciente
        FROM ${tablaPaciente}
        ORDER BY id_paciente DESC
    `);

    if (result.recordset.length === 0) {
        return 'PAC001';
    }

    const ultimoId = result.recordset[0].id_paciente;
    const numero = parseInt(ultimoId.replace('PAC', '')) + 1;

    return `PAC${numero.toString().padStart(3, '0')}`;
};

export const PacienteModel = {

    getAllBySede: async (sede) => {

        const pool = await poolPromise;

        const tablaPaciente = getPacienteTable(sede);

        const result = await pool.request().query(`
            SELECT
                id_paciente,
                cedula,
                nombre,
                edad,
                direccion,
                telefono
            FROM ${tablaPaciente}
            ORDER BY id_paciente
        `);

        return result.recordset;
    },

    create: async (data, sede) => {

        const pool = await poolPromise;

        const tablaPaciente = getPacienteTable(sede);

        const nuevoId = await generatePacienteId(pool, tablaPaciente);

        await pool.request()

            .input('id_paciente', sql.VarChar, nuevoId)
            .input('cedula', sql.VarChar, data.cedula)
            .input('nombre', sql.VarChar, data.nombre)
            .input('edad', sql.Int, data.edad)
            .input('direccion', sql.VarChar, data.direccion)
            .input('telefono', sql.VarChar, data.telefono)

            .query(`
                INSERT INTO ${tablaPaciente}

                (
                    id_paciente,
                    cedula,
                    nombre,
                    edad,
                    direccion,
                    telefono
                )

                VALUES

                (
                    @id_paciente,
                    @cedula,
                    @nombre,
                    @edad,
                    @direccion,
                    @telefono
                )
            `);

        return {
            id_paciente: nuevoId,
            ...data
        };
    },

    update: async (id, data, sede) => {

        const pool = await poolPromise;

        const tablaPaciente = getPacienteTable(sede);

        await pool.request()

            .input('id', sql.VarChar, id)
            .input('cedula', sql.VarChar, data.cedula)
            .input('nombre', sql.VarChar, data.nombre)
            .input('edad', sql.Int, data.edad)
            .input('direccion', sql.VarChar, data.direccion)
            .input('telefono', sql.VarChar, data.telefono)

            .query(`
                UPDATE ${tablaPaciente}

                SET

                    cedula=@cedula,
                    nombre=@nombre,
                    edad=@edad,
                    direccion=@direccion,
                    telefono=@telefono

                WHERE id_paciente=@id
            `);

        return true;
    },

    delete: async (id, sede) => {

        const pool = await poolPromise;

        const tablaPaciente = getPacienteTable(sede);

        await pool.request()

            .input('id', sql.VarChar, id)

            .query(`
                DELETE FROM ${tablaPaciente}
                WHERE id_paciente=@id
            `);

        return true;
    }

};