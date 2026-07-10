import { Router } from "express";

import {

    getClinicas,
    createClinica,
    updateClinica,
    deleteClinica

} from "../controllers/clinicaController.js";

const router = Router();

router.get("/", getClinicas);

router.post("/", createClinica);

router.put("/:id", updateClinica);

router.delete("/:id", deleteClinica);

export default router;