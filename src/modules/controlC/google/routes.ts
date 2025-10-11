import { Router } from "express";
import { googleAuth } from "./controller";

const router = Router();
router.post("/auth", googleAuth);

export default router;
