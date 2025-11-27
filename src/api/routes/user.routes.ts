import { Router } from "express";
import {  listUsers , getUserById} from "../controllers/user.controller";

const router = Router();

router.get("/users", listUsers);
router.get("/:id", getUserById); 

export default router;
