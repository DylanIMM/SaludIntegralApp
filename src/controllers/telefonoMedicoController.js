import { TelefonoMedicoModel } from "../models/telefonoMedicoModel.js";

//=====================================================
// OBTENER TELÉFONOS
//=====================================================

export const getTelefonosMedico = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const telefonos = await TelefonoMedicoModel.getAllBySede(sede);

        res.status(200).json(telefonos);

    }

    catch (error) {

        console.error("Error obteniendo teléfonos:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// CREAR TELÉFONO
//=====================================================

export const createTelefonoMedico = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const {

            id_medico,
            telefono

        } = req.body;

        if (

            !id_medico ||
            !telefono

        ) {

            return res.status(400).json({

                error: "Todos los campos son obligatorios."

            });

        }

        const creado = await TelefonoMedicoModel.create(

            {

                id_medico,
                telefono

            },

            sede

        );

        res.status(201).json({

            message: "Teléfono registrado correctamente."

        });

    }

    catch (error) {

        console.error("Error creando teléfono:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ACTUALIZAR TELÉFONO
//=====================================================

export const updateTelefonoMedico = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const { idMedico, telefono } = req.params;

        const { telefono: telefonoNuevo } = req.body;

        if (!telefonoNuevo) {

            return res.status(400).json({

                error: "Debe indicar el nuevo teléfono."

            });

        }

        const actualizado = await TelefonoMedicoModel.update(

            idMedico,

            telefono,

            telefonoNuevo,

            sede

        );


        res.status(200).json({

            message: "Teléfono actualizado correctamente."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ELIMINAR TELÉFONO
//=====================================================

export const deleteTelefonoMedico = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const { idMedico, telefono } = req.params;

        const eliminado = await TelefonoMedicoModel.delete(

            idMedico,

            telefono,

            sede

        );


        res.status(200).json({

            message: "Teléfono eliminado correctamente."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

};