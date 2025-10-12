import { Request, Response } from "express";
import { getDB } from "../../config/db/mongoClient";

export const getCommentsByFixer = async (req: Request, res: Response) => {
  const fixerId = req.params.fixerId;
  const db = getDB();

  try {
    // Busca todos los jobs del fixer con comentarios
    const jobs = await db
      .collection("jobs")
      .find(
        { fixerId, comment: { $exists: true, $ne: "" } },
        { projection: { comment: 1, requesterId: 1 } }
      )
      .toArray();

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No hay comentarios para este fixer" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    res.status(500).json({ message: "Error obteniendo comentarios" });
  }
};