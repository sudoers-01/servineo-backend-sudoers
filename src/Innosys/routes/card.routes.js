import { Router } from "express";
import { createCard, listCards } from "../controllers/card.controller.js";

const router = Router();

router.post("/cardscreate", createCard);
router.get("/cards", listCards);

export default router;
