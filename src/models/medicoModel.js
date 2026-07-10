import { poolPromise, sql } from '../config/db.js';
import {
    isSedeValid,
    getMedicoAdministrativoTable,
    getMedicoTable,
    getTelefonoMedicoTable,
    getCitaTable
} from '../config/distributedConfig.js';

const generateMedicoId = async (pool) => {

    const result = await pool.request().query(`
        SELECT TOP 1 id_medico
        FROM MEDICO_ADMINISTRATIVO
        ORDER BY id_medico DESC
    `);

    if (result.recordset.length === 0) {
        return 'MED001';
    }

    const ultimo = result.recordset[0].id_medico;
    const numero = parseInt(ultimo.replace('MED','')) + 1;

    return `MED${numero.toString().padStart(3,'0')}`;
};

export const MedicoModel = {

    //====================================
    // LISTAR
    //====================================

    getAllBySede: async (sede)=>{

        if(!isSedeValid(sede)){
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const tablaAdmin = getMedicoAdministrativoTable();
        const tablaOperativa = getMedicoTable(sede);

        const result = await pool.request().query(`
            SELECT

                ma.id_medico,
                ma.cedula,
                ma.nombre,

                mo.especialidad,
                mo.horario_atencion,
                mo.id_clinica

            FROM ${tablaAdmin} ma

            INNER JOIN ${tablaOperativa} mo
                ON ma.id_medico = mo.id_medico

            ORDER BY ma.id_medico
        `);

        return result.recordset;

    },

    //====================================
    // CREAR
    //====================================

    create: async(data,sede)=>{

        if(!isSedeValid(sede)){
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const tablaAdmin = getMedicoAdministrativoTable();
        const tablaOperativa = getMedicoTable(sede);

        const existe = await pool.request()

            .input("cedula",sql.VarChar,data.cedula)

            .query(`
                SELECT id_medico
                FROM ${tablaAdmin}
                WHERE cedula=@cedula
            `);

        if(existe.recordset.length>0){

            throw new Error("Ya existe un médico con esa cédula");

        }

        const nuevoId = await generateMedicoId(pool);

        try{

            await pool.request()

                .input("id_medico",sql.VarChar,nuevoId)
                .input("cedula",sql.VarChar,data.cedula)
                .input("nombre",sql.VarChar,data.nombre)

                .query(`
                    INSERT INTO ${tablaAdmin}

                    (
                        id_medico,
                        cedula,
                        nombre
                    )

                    VALUES

                    (
                        @id_medico,
                        @cedula,
                        @nombre
                    )
                `);

            await pool.request()

                .input("id_medico",sql.VarChar,nuevoId)
                .input("especialidad",sql.VarChar,data.especialidad)
                .input("horario_atencion",sql.VarChar,data.horario_atencion)
                .input("id_clinica",sql.VarChar,sede)

                .query(`
                    INSERT INTO ${tablaOperativa}

                    (
                        id_medico,
                        especialidad,
                        horario_atencion,
                        id_clinica
                    )

                    VALUES

                    (
                        @id_medico,
                        @especialidad,
                        @horario_atencion,
                        @id_clinica
                    )
                `);

            return{

                id_medico:nuevoId,
                ...data,
                id_clinica:sede

            };

        }

        catch(error){

            await pool.request()

                .input("id_medico",sql.VarChar,nuevoId)

                .query(`
                    DELETE FROM ${tablaAdmin}
                    WHERE id_medico=@id_medico
                `);

            throw error;

        }

    },

    //====================================
    // ACTUALIZAR
    //====================================

    update: async(id,data,sede)=>{

        if(!isSedeValid(sede)){
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const tablaAdmin = getMedicoAdministrativoTable();
        const tablaOperativa = getMedicoTable(sede);

        const admin = await pool.request()

            .input("id",sql.VarChar,id)
            .input("cedula",sql.VarChar,data.cedula)
            .input("nombre",sql.VarChar,data.nombre)

            .query(`
                UPDATE ${tablaAdmin}

                SET

                    cedula=@cedula,
                    nombre=@nombre

                WHERE id_medico=@id
            `);

        const operativo = await pool.request()

            .input("id",sql.VarChar,id)
            .input("id_clinica",sql.VarChar,sede)
            .input("especialidad",sql.VarChar,data.especialidad)
            .input("horario",sql.VarChar,data.horario_atencion)

            .query(`
                UPDATE ${tablaOperativa}

                SET

                    especialidad=@especialidad,
                    horario_atencion=@horario

                WHERE

                    id_medico=@id

                AND

                    id_clinica=@id_clinica
            `);

        return admin.rowsAffected[0]>0 &&
               operativo.rowsAffected[0]>0;

    },

    //====================================
    // ELIMINAR
    //====================================

    delete: async(id,sede)=>{

        if(!isSedeValid(sede)){
            throw new Error("Sede inválida");
        }

        const pool = await poolPromise;

        const tablaAdmin = getMedicoAdministrativoTable();
        const tablaOperativa = getMedicoTable(sede);
        const tablaTelefonos = getTelefonoMedicoTable(sede);
        const tablaCitas = getCitaTable(sede);

        const citas = await pool.request()

            .input("id",sql.VarChar,id)
            .input("id_clinica",sql.VarChar,sede)

            .query(`
                SELECT id_cita

                FROM ${tablaCitas}

                WHERE

                    id_medico=@id

                AND

                    id_clinica=@id_clinica
            `);

        if(citas.recordset.length>0){

            throw new Error("No se puede eliminar el médico porque tiene citas registradas.");

        }

        await pool.request()

            .input("id",sql.VarChar,id)
            .input("id_clinica",sql.VarChar,sede)

            .query(`
                DELETE FROM ${tablaTelefonos}

                WHERE

                    id_medico=@id

                AND

                    id_clinica=@id_clinica
            `);

        const operativo = await pool.request()

            .input("id",sql.VarChar,id)
            .input("id_clinica",sql.VarChar,sede)

            .query(`
                DELETE FROM ${tablaOperativa}

                WHERE

                    id_medico=@id

                AND

                    id_clinica=@id_clinica
            `);

        const admin = await pool.request()

            .input("id",sql.VarChar,id)

            .query(`
                DELETE FROM ${tablaAdmin}
                WHERE id_medico=@id
            `);

        return operativo.rowsAffected[0]>0 &&
               admin.rowsAffected[0]>0;

    }

};