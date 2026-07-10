import { poolPromise, sql } from "../config/db.js";
import {
    isSedeValid,
    getTelefonoMedicoTable,
    getMedicoTable,
    getMedicoAdministrativoTable
} from "../config/distributedConfig.js";

export const TelefonoMedicoModel = {
  // =========================
  // GET ALL
  // =========================
  getAllBySede: async (sede) => {
    if (!isSedeValid(sede)) {
      throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const tablaTelefonos = getTelefonoMedicoTable(sede);
    const tablaMedicosAdmin = getMedicoAdministrativoTable();

    const result = await pool.request().input("id_clinica", sql.VarChar, sede)
      .query(`
            SELECT
                t.id_clinica,
                t.id_medico,
                m.nombre,
                t.telefono
            FROM ${tablaTelefonos} t
            INNER JOIN ${tablaMedicosAdmin} m
                ON t.id_medico = m.id_medico
            WHERE t.id_clinica = @id_clinica
            ORDER BY m.nombre
        `);

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

    const tablaTelefonos = getTelefonoMedicoTable(sede);
    const tablaMedicos = getMedicoTable(sede);

    // Verificar médico
    const medico = await pool
      .request()
      .input("id_clinica", sql.VarChar, sede)
      .input("id_medico", sql.VarChar, data.id_medico).query(`
                SELECT 1
                FROM ${tablaMedicos}
                WHERE
                    id_clinica=@id_clinica
                AND id_medico=@id_medico
            `);

    if (medico.recordset.length === 0) {
      throw new Error("El médico no existe.");
    }

    // Verificar duplicado
    const existe = await pool
      .request()
      .input("id_clinica", sql.VarChar, sede)
      .input("id_medico", sql.VarChar, data.id_medico)
      .input("telefono", sql.VarChar, data.telefono).query(`
                SELECT 1
                FROM ${tablaTelefonos}
                WHERE
                    id_clinica=@id_clinica
                AND id_medico=@id_medico
                AND telefono=@telefono
            `);

    if (existe.recordset.length > 0) {
      throw new Error("Ese teléfono ya está registrado.");
    }

    const result = await pool
      .request()
      .input("id_clinica", sql.VarChar, sede)
      .input("id_medico", sql.VarChar, data.id_medico)
      .input("telefono", sql.VarChar, data.telefono).query(`
                INSERT INTO ${tablaTelefonos}
                (
                    id_clinica,
                    id_medico,
                    telefono
                )
                VALUES
                (
                    @id_clinica,
                    @id_medico,
                    @telefono
                )
            `);

    return result.rowsAffected[0] > 0;
  },

  //=========================================
  // ACTUALIZAR
  //=========================================
  update: async (idMedico, telefonoActual, telefonoNuevo, sede) => {
    if (!isSedeValid(sede)) {
      throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const tablaTelefonos = getTelefonoMedicoTable(sede);

    const result = await pool
      .request()
      .input("id_clinica", sql.VarChar, sede)
      .input("id_medico", sql.VarChar, idMedico)
      .input("telefono_actual", sql.VarChar, telefonoActual)
      .input("telefono_nuevo", sql.VarChar, telefonoNuevo).query(`
                UPDATE ${tablaTelefonos}
                SET telefono=@telefono_nuevo
                WHERE
                    id_clinica=@id_clinica
                AND id_medico=@id_medico
                AND telefono=@telefono_actual
            `);

    return result.rowsAffected[0] > 0;
  },

  //=========================================
  // ELIMINAR
  //=========================================
  delete: async (idMedico, telefono, sede) => {
    if (!isSedeValid(sede)) {
      throw new Error("Sede inválida");
    }

    const pool = await poolPromise;

    const tablaTelefonos = getTelefonoMedicoTable(sede);

    const result = await pool
      .request()
      .input("id_clinica", sql.VarChar, sede)
      .input("id_medico", sql.VarChar, idMedico)
      .input("telefono", sql.VarChar, telefono).query(`
                DELETE FROM ${tablaTelefonos}
                WHERE
                    id_clinica=@id_clinica
                AND id_medico=@id_medico
                AND telefono=@telefono
            `);

    return result.rowsAffected[0] > 0;
  },
};
