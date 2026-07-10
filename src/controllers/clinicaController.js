import { ClinicaModel } from '../models/clinicaModel.js';
import { isSedeValid } from '../config/distributedConfig.js';

export const getClinicas = async (req, res) => {

    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    try {

        const clinicas = await ClinicaModel.getAll(sede);

        res.status(200).json(clinicas);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

export const createClinica = async (req, res) => {

    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    // Solo publica C01
    if (sede !== 'C01') {
        return res.status(403).json({
            error: 'Solo la sede C01 puede registrar clínicas.'
        });
    }

    try {

        const {
            id_clinica,
            nombre,
            direccion,
            telefono
        } = req.body;

        if (
            !id_clinica ||
            !nombre ||
            !direccion ||
            !telefono
        ) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios.'
            });
        }

        const creada = await ClinicaModel.create(req.body);

        if (!creada) {
            return res.status(500).json({
                error: 'No se pudo registrar la clínica.'
            });
        }

        res.status(201).json({
            message: 'Clínica registrada correctamente.'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

export const updateClinica = async (req, res) => {

    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    if (sede !== 'C01') {
        return res.status(403).json({
            error: 'Solo la sede C01 puede modificar clínicas.'
        });
    }

    try {

        const actualizada = await ClinicaModel.update(
            req.params.id,
            req.body
        );

        if (!actualizada) {
            return res.status(404).json({
                error: 'Clínica no encontrada.'
            });
        }

        res.json({
            message: 'Clínica actualizada correctamente.'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

export const deleteClinica = async (req, res) => {

    const sede = req.headers['x-sede'] || 'C01';

    if (!isSedeValid(sede)) {
        return res.status(400).json({
            error: 'Sede inválida.'
        });
    }

    if (sede !== 'C01') {
        return res.status(403).json({
            error: 'Solo la sede C01 puede eliminar clínicas.'
        });
    }

    try {

        const eliminada = await ClinicaModel.delete(
            req.params.id
        );

        if (!eliminada) {
            return res.status(404).json({
                error: 'Clínica no encontrada.'
            });
        }

        res.json({
            message: 'Clínica eliminada correctamente.'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};