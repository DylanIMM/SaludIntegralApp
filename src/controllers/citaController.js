import { CitaModel } from "../models/citaModel.js";

//=====================================================
// OBTENER CITAS
//=====================================================

export const getCitas = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const citas = await CitaModel.getAllBySede(sede);

        res.status(200).json(citas);

    }

    catch (error) {

        console.error("Error obteniendo citas:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// OBTENER CITA POR ID
//=====================================================

export const getCitaById = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const cita = await CitaModel.getById(

            req.params.id,

            sede

        );

        if (!cita) {

            return res.status(404).json({

                error: "Cita no encontrada."

            });

        }

        res.status(200).json(cita);

    }

    catch (error) {

        console.error("Error obteniendo cita:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// CREAR CITA
//=====================================================

export const createCita = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const {

            fecha,
            hora,
            motivo_consulta,
            diagnostico,
            estado,
            id_medico,
            id_paciente,
            nro_consultorio

        } = req.body;

        if (

            !fecha ||
            !hora ||
            !motivo_consulta ||
            !id_medico ||
            !id_paciente ||
            !nro_consultorio

        ) {

            return res.status(400).json({

                error: "Todos los campos obligatorios deben completarse."

            });

        }

        const creada = await CitaModel.create(

            {

                fecha,
                hora,
                motivo_consulta,
                diagnostico,
                estado,
                id_medico,
                id_paciente,
                nro_consultorio

            },

            sede

        );

        if (!creada) {

            return res.status(500).json({

                error: "No fue posible registrar la cita."

            });

        }

        res.status(201).json({

            message: "Cita registrada correctamente."

        });

    }

    catch (error) {

        console.error("Error creando cita:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ACTUALIZAR CITA
//=====================================================

export const updateCita = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const actualizado = await CitaModel.update(

            req.params.id,

            req.body,

            sede

        );

        if (!actualizado) {

            return res.status(404).json({

                error: "Cita no encontrada."

            });

        }

        res.status(200).json({

            message: "Cita actualizada correctamente."

        });

    }

    catch (error) {

        console.error("Error actualizando cita:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ELIMINAR CITA
//=====================================================

export const deleteCita = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const eliminado = await CitaModel.delete(

            req.params.id,

            sede

        );

        if (!eliminado) {

            return res.status(404).json({

                error: "Cita no encontrada."

            });

        }

        res.status(200).json({

            message: "Cita eliminada correctamente."

        });

    }

    catch (error) {

        console.error("Error eliminando cita:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// PRÓXIMAS CITAS
//=====================================================

export const getUpcomingCitas = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const citas = await CitaModel.getUpcomingCitas(sede);

        res.status(200).json(citas);

    }

    catch (error) {

        console.error("Error obteniendo próximas citas:", error);

        res.status(500).json({

            error: error.message

        });

    }

};