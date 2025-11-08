import { Router } from 'express';
import { loginUsuario, loginGoogle } from "./auth.controller";
import { forgotPassword, magicLogin } from "./forgot.controller";

const router = Router();

router.post('/login', loginUsuario);
router.post("/google", loginGoogle);

router.post("/forgot-password", forgotPassword);
router.get("/magic-login", magicLogin);

export default router;
