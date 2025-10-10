import express, { Request, Response } from "express";
import { connectDB } from "../../config/db/mongoClient.js";
import { IRequestForm } from "../models/requestModel.js";

const router = express.Router();

router.post("/", async (req: Request<{}, {}, IRequestForm>, res: Response): Promise<void> => {
  try {
    const { jobMotive, jobDescription, location, startTime, endTime, suggestedRate } = req.body;

    const db = await connectDB();
    const collection = db.collection<IRequestForm>("requestforms");
    
    const newRequest: IRequestForm = {
      jobMotive,
      jobDescription, 
      location,
      startTime,
      endTime,
      suggestedRate: suggestedRate || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newRequest);
    
    // Transformar respuesta (similar al transform de Mongoose)
    const responseData = {
      id: result.insertedId.toString(),
      jobMotive: newRequest.jobMotive,
      jobDescription: newRequest.jobDescription,
      location: newRequest.location,
      startTime: newRequest.startTime,
      endTime: newRequest.endTime,
      suggestedRate: newRequest.suggestedRate,
      createdAt: newRequest.createdAt
    };
    
    res.status(201).json({ 
      message: "Solicitud creada exitosamente", 
      data: responseData 
    });
  } catch (error) {
    console.error("Error al guardar la solicitud:", error);
    res.status(500).json({ message: "Error al guardar la solicitud", error });
  }
});

export default router;