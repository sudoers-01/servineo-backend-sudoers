// src/modules/controlC/HU6/device.routes.ts
import { Router } from "express";
import { registerDevice, getDevices } from "./device.controller";

const router = Router();

router.post("/register", registerDevice);
router.get("/:userId", getDevices);

export default router;
