import { Router } from 'express';
import { actualizarFotoPerfil } from './controller';

const router = Router();

router.put('/usuarios/foto', actualizarFotoPerfil);

export default router;
