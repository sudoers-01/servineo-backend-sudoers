import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import AppRoutes from './server.routes';
import { getDB } from './db/mongoClient';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = getDB();
  next();
});

app.use(cors());
app.use(express.json());
app.use(AppRoutes);

export default app;
