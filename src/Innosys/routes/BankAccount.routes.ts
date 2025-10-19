import { Router } from 'express';
import { createBankAccount } from '../controllers/bankAccount.controller';

const router = Router();

// POST /api/bank-accounts
// Ruta para registrar una nueva cuenta bancaria
router.post('/bank-accounts', createBankAccount);

export default router;
