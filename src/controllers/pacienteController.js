import { PacienteModel } from '../models/pacienteModel.js';
import { isSedeValid } from '../config/distributedConfig.js';

export const getPacientes = async (req, res) => {
    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    try {
        const pacientes = await PacienteModel.getAllBySede(sede);

        res.status(200).json(pacientes);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

export const createPaciente = async (req, res) => {
    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    try {

        const {
            cedula,
            nombre,
            edad,
            direccion,
            telefono
        } = req.body;

        if (
            !cedula ||
            !nombre ||
            edad == null ||
            !direccion ||
            !telefono
        ) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios.'
            });
        }

        const paciente = await PacienteModel.create(req.body, sede);

        res.status(201).json({
            message: 'Paciente registrado correctamente.',
            data: paciente
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

export const updatePaciente = async (req, res) => {

    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    try {

        const actualizado = await PacienteModel.update(
            req.params.id,
            req.body,
            sede
        );

        if (!actualizado) {
            return res.status(404).json({
                error: 'Paciente no encontrado.'
            });
        }

        res.json({
            message: 'Paciente actualizado correctamente.'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

export const deletePaciente = async (req, res) => {

    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    try {

        const eliminado = await PacienteModel.delete(
            req.params.id,
            sede
        );

        if (!eliminado) {
            return res.status(404).json({
                error: 'Paciente no encontrado.'
            });
        }

        res.json({
            message: 'Paciente eliminado correctamente.'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};