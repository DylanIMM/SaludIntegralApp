import { MedicoModel } from "../models/medicoModel.js";

//=====================================================
// OBTENER MÉDICOS
//=====================================================

export const getMedicos = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const medicos = await MedicoModel.getAllBySede(sede);

        res.status(200).json(medicos);

    }

    catch (error) {

        console.error("Error obteniendo médicos:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// CREAR MÉDICO
//=====================================================

export const createMedico = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const {

            cedula,
            nombre,
            especialidad,
            horario_atencion

        } = req.body;

        if (

            !cedula ||
            !nombre ||
            !especialidad ||
            !horario_atencion

        ) {

            return res.status(400).json({

                error: "Todos los campos son obligatorios."

            });

        }

        const medico = await MedicoModel.create(

            {

                cedula,
                nombre,
                especialidad,
                horario_atencion

            },

            sede

        );

        res.status(201).json({

            message: "Médico registrado correctamente.",

            medico

        });

    }

    catch (error) {

        console.error("Error creando médico:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ACTUALIZAR MÉDICO
//=====================================================

export const updateMedico = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const {

            cedula,
            nombre,
            especialidad,
            horario_atencion

        } = req.body;

        if (

            !cedula ||
            !nombre ||
            !especialidad ||
            !horario_atencion

        ) {

            return res.status(400).json({

                error: "Todos los campos son obligatorios."

            });

        }

        const actualizado = await MedicoModel.update(

            req.params.id,

            {

                cedula,
                nombre,
                especialidad,
                horario_atencion

            },

            sede

        );

        if (!actualizado) {

            return res.status(404).json({

                error: "Médico no encontrado."

            });

        }

        res.status(200).json({

            message: "Médico actualizado correctamente."

        });

    }

    catch (error) {

        console.error("Error actualizando médico:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ELIMINAR MÉDICO
//=====================================================

export const deleteMedico = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const eliminado = await MedicoModel.delete(

            req.params.id,

            sede

        );

        if (!eliminado) {

            return res.status(404).json({

                error: "Médico no encontrado."

            });

        }

        res.status(200).json({

            message: "Médico eliminado correctamente."

        });

    }

    catch (error) {

        console.error("Error eliminando médico:", error);

        res.status(500).json({

            error: error.message

        });

    }

};