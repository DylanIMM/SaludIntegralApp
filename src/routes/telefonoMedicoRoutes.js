import { Router } from "express";

import {
    getTelefonosMedico,
    createTelefonoMedico,
    updateTelefonoMedico,
    deleteTelefonoMedico
} from "../controllers/telefonoMedicoController.js";

const router = Router();

router.get("/", getTelefonosMedico);

router.post("/", createTelefonoMedico);

// PK compuesta
router.put("/:idMedico/:telefono", updateTelefonoMedico);

router.delete("/:idMedico/:telefono", deleteTelefonoMedico);

export default router;