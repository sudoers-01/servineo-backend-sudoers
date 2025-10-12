import { Router } from "express";
import { registrarUbicacion } from "./controller";

const router = Router();


router.post("/", registrarUbicacion);

export default router;