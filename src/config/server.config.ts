import express from 'express';
import cors from 'cors';
import AppRoutes from './server.routes';

const app = express();

app.use(
  cors({
    origin: ['https://devmasters-servineo-frontend-zk3q.vercel.app', 'http://localhost:8080'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(AppRoutes);

export default app;
