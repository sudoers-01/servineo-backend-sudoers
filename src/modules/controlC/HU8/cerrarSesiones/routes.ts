import express from "express";
import { verifyJWT } from "../../HU3/google/authMiddleware";
import { logoutAllController } from "./controller";

const router = express.Router();
router.post("/logout-all", verifyJWT, logoutAllController);
export default router;
