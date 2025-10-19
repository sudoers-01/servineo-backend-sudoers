import { Router } from 'express';
import { loginUsuario, loginGoogle } from "./auth.controller";

const router = Router();

router.post('/login', loginUsuario);
router.post("/google", loginGoogle);

export default router;
