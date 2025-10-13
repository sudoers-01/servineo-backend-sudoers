import { Router } from "express";
import { registrarUbicacion } from "./controller";
import { verifyJWT } from "../google/controller";

const router = Router();

router.post("/", verifyJWT, registrarUbicacion);

export default router;
