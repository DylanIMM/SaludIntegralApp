import { ConsultorioModel } from "../models/consultorioModel.js";

//=====================================================
// OBTENER CONSULTORIOS
//=====================================================

export const getConsultorios = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const consultorios = await ConsultorioModel.getAllBySede(sede);

        res.status(200).json(consultorios);

    }

    catch (error) {

        console.error("Error obteniendo consultorios:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// CREAR CONSULTORIO
//=====================================================

export const createConsultorio = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const {

            tipo_atencion,
            piso

        } = req.body;

        if (

            !tipo_atencion ||
            piso == null

        ) {

            return res.status(400).json({

                error: "Todos los campos son obligatorios."

            });

        }

        const creado = await ConsultorioModel.create(

            {

                tipo_atencion,
                piso

            },

            sede

        );


        res.status(201).json({

            message: "Consultorio registrado correctamente."

        });

    }

    catch (error) {

        console.error("Error creando consultorio:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ACTUALIZAR CONSULTORIO
//=====================================================

export const updateConsultorio = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const {

            tipo_atencion,
            piso

        } = req.body;

        if (

            !tipo_atencion ||
            piso == null

        ) {

            return res.status(400).json({

                error: "Todos los campos son obligatorios."

            });

        }

        const actualizado = await ConsultorioModel.update(

            req.params.id,

            {

                tipo_atencion,
                piso

            },

            sede

        );


        res.status(200).json({

            message: "Consultorio actualizado correctamente."

        });

    }

    catch (error) {

        console.error("Error actualizando consultorio:", error);

        res.status(500).json({

            error: error.message

        });

    }

};

//=====================================================
// ELIMINAR CONSULTORIO
//=====================================================

export const deleteConsultorio = async (req, res) => {

    const sede = req.headers["x-sede"] || "C01";

    try {

        const eliminado = await ConsultorioModel.delete(

            req.params.id,

            sede

        );


        res.status(200).json({

            message: "Consultorio eliminado correctamente."

        });

    }

    catch (error) {

        console.error("Error eliminando consultorio:", error);

        res.status(500).json({

            error: error.message

        });

    }

};