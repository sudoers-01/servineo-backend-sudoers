import { Router } from "express";
import { loginAdministrador } from "../../controllers/userManagement/admin.controller";

const router = Router();

router.post("/login", loginAdministrador);

export default router;
