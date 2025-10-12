import { Router } from "express";
import { googleAuth } from "./controller";
import { verifyJWT } from "./authMiddleware";

const router = Router();

router.post("/auth", googleAuth);

// 🆕 Nueva ruta para verificar sesión
router.get("/verify", verifyJWT, (req, res) => {
  return res.json({
    valid: true,
    user: (req as any).user, // viene del token
  });
});

export default router;
