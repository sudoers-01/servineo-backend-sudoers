import { Router } from "express";
import { getCommentsByFixer } from "./comment.controller";

const router = Router();

// GET /api/comments/:fixerId
router.get("/:fixerId", getCommentsByFixer);

export default router;