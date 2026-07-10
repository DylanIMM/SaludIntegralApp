import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import pacienteRoutes from './routes/pacienteRoutes.js';
import clinicaRoutes from './routes/clinicaRoutes.js';
import medicoRoutes from './routes/medicoRoutes.js';
import consultorioRoutes from './routes/consultorioRoutes.js';
import telefonoMedicoRoutes from './routes/telefonoMedicoRoutes.js';
import citaRoutes from './routes/citaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// MIDDLEWARES
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.sede = req.headers['x-sede'] || 'C01';
    next();
});

// =========================
// STATIC FILES
// =========================
app.use(express.static(path.join(__dirname, '../public')));

// =========================
// ROUTES API
// =========================
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/clinicas', clinicaRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/consultorios', consultorioRoutes);
app.use('/api/telefonos-medicos', telefonoMedicoRoutes);
app.use('/api/citas', citaRoutes);

// =========================
// HEALTH CHECK
// =========================
app.get('/api/ping', (req, res) => {
    res.status(200).json({
        message: 'Servidor Salud Integral en línea'
    });
});

// =========================
// 404
// =========================
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// =========================
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});