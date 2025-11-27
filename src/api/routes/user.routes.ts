import { Router } from "express";
import {  listUsers , getUserById} from "../controllers/user.controller";

const routerUser = Router();

routerUser.get("/users", listUsers);
routerUser.get("/:id", getUserById); 

export default routerUser;
