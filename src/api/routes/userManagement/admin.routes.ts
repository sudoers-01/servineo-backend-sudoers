import { Router } from "express";
import { loginAdministrador } from "../../controllers/userManagement/admin.controller";
import chartRouter from '../chart.routes';

const router = Router();

// POST /api/admin
router.post("/login", loginAdministrador);
router.post("/chart", chartRouter);

export default router;
