import { Router } from "express";

import {

    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico

} from "../controllers/medicoController.js";

const router = Router();

router.get("/", getMedicos);

router.post("/", createMedico);

router.put("/:id", updateMedico);

router.delete("/:id", deleteMedico);

export default router;