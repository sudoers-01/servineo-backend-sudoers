import express from "express";
import { consultarUltimoCambio } from "./controller";

const router = express.Router();

router.get("/fecha-ultimo-cambio", consultarUltimoCambio);

export default router;