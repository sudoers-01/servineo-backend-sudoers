import express from "express";
import { cambiarContrasena } from "./controller";

const router = express.Router();

router.post("/change-password", cambiarContrasena);


export default router;